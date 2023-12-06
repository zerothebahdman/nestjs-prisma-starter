import * as bcrypt from 'bcrypt';

import { AccountStatus, TokenType, User } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginRequestDto,
  ResetPasswordRequestDto,
  SignupRequestDto,
} from './dtos/request';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { AuthUser } from './auth-user';
import { JwtPayload } from './jwt-payload';
import { PrismaService } from '../common/services/prisma.service';
import { UserService } from '../user/user.service';
import moment = require('moment');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupRequest: SignupRequestDto, token: string) {
    const user = await this.prisma.user.create({
      data: {
        email: signupRequest.email.toLowerCase(),
        password: await bcrypt.hash(signupRequest.password, 14),
        first_name: signupRequest.first_name,
        last_name: signupRequest.last_name,
        Token: {
          create: {
            token,
            type: TokenType.email_verification,
            valid_until: moment().add(1, 'hour').toDate(),
          },
        },
      },
      select: null,
    });
    return user;
  }

  async resendVerificationMail(userId: string, token: string): Promise<void> {
    // delete old email verification tokens if exist
    const deletePrevEmailVerificationIfExist = this.prisma.token.deleteMany({
      where: { user_id: userId, type: TokenType.email_verification },
    });

    const createEmailVerification = this.prisma.token.create({
      data: {
        user_id: userId,
        token,
        type: TokenType.email_verification,
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevEmailVerificationIfExist,
      createEmailVerification,
    ]);
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenExists = await this.prisma.token.findUnique({
      where: { token, type: TokenType.email_verification },
    });
    if (tokenExists === null) {
      throw new NotFoundException('Oops!, invalid token');
    }
    if (tokenExists.valid_until < new Date()) {
      throw new BadRequestException('Token expired');
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: tokenExists.user_id },
        data: {
          email_verified: true,
          status: AccountStatus.confirmed,
        },
        select: null,
      }),
      this.prisma.token.delete({
        where: { token },
      }),
    ]);
  }

  async initiateResetPassword(user: User, token: string): Promise<void> {
    const deletePrevPasswordResetIfExist = this.prisma.token.deleteMany({
      where: { user_id: user.id, type: TokenType.reset_password },
    });

    const createPasswordReset = this.prisma.token.create({
      data: {
        user_id: user.id,
        token,
        type: TokenType.reset_password,
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevPasswordResetIfExist,
      createPasswordReset,
    ]);
  }

  async resetPassword(resetPasswordRequest: ResetPasswordRequestDto) {
    const passwordReset = await this.prisma.token.findFirstOrThrow({
      where: { token: resetPasswordRequest.token },
    });
    if (passwordReset === null)
      throw new NotFoundException('Oops!, invalid token');
    if (passwordReset.valid_until < new Date())
      throw new BadRequestException('Token expired');
    const hashedPassword = await bcrypt.hash(
      resetPasswordRequest!.password,
      14,
    );
    const user = this.prisma.user.update({
      where: { id: passwordReset.user_id },
      data: {
        password: hashedPassword,
      },
      select: null,
    });
    await this.prisma.$transaction([
      user,
      this.prisma.token.delete({
        where: { token: resetPasswordRequest.token },
      }),
    ]);

    return user;
  }

  async validateUser(payload: Partial<JwtPayload>): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (user !== null && user.email === payload.email) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async login(loginRequest: LoginRequestDto): Promise<string> {
    const normalizedIdentifier = loginRequest.identifier.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: normalizedIdentifier,
          },
          {
            email: normalizedIdentifier,
          },
        ],
      },
      select: {
        id: true,
        password: true,
        email: true,
        username: true,
      },
    });

    if (
      user === null ||
      !bcrypt.compareSync(loginRequest.password, user.password)
    ) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
    };

    return this.jwtService.signAsync(payload);
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { username: true },
    });
    return user === null;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { email: true },
    });
    return user === null;
  }

  async generateToken(user: User, signOptions: JwtSignOptions = {}) {
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, signOptions),
    };
  }
}
