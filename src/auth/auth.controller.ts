import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HelperClass } from '../utils/helpers';
import { EmailService } from '../mail-sender/mail-sender.service';
import { AccountStatus } from '@prisma/client';
import { HttpExceptionFilter } from '../exception/http-exception-filter';
import { YupValidationPipe } from '../validator/yup.validation';
import {
  CheckEmailRequestDto,
  checkEmailSchema,
} from './dtos/request/check-email.request';
import {
  VerifyUserEmailDto,
  VerifyUserEmailSchema,
} from './dtos/request/verify-email.request';
import {
  SignupRequestDto,
  signupRequestSchema,
} from './dtos/request/signup.request';
import { LoginRequestDto, LoginRequestSchema } from './dtos/request';
import {
  ResetPasswordRequestDto,
  ResetPasswordRequestSchema,
} from './dtos/request/reset-password.request';
import { ConfigService } from '@nestjs/config';

@ApiTags('Authentication')
@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly helperClass: HelperClass,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmailAvailability(
    @Body(new YupValidationPipe(checkEmailSchema))
    body: CheckEmailRequestDto,
  ) {
    try {
      const isAvailable = await this.authService.isEmailAvailable(body.email);
      return {
        status: HttpStatus.OK,
        message: `Email is ${
          isAvailable ? 'available' : 'not available'
        } for use`,
        isAvailable,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(new YupValidationPipe(signupRequestSchema))
    body: SignupRequestDto,
  ) {
    try {
      const emailTaken = await this.userService.queryUserDetails({
        email: body.email.toLocaleLowerCase(),
      });
      if (emailTaken) throw new BadRequestException(`Email is already taken`);
      const token = this.helperClass.generateRandomString(6, 'num');
      const hashToken = await this.helperClass.hashString(token);
      await this.authService.signup(body, hashToken);
      await this.emailService.sendVerifyEmailMail(
        body.first_name,
        body.email,
        token,
      );
      return {
        status: HttpStatus.CREATED,
        message: 'Signup Successful',
        ...(this.configService.getOrThrow<string>('env') === 'test' && {
          token,
        }),
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new YupValidationPipe(LoginRequestSchema))
    loginRequest: LoginRequestDto,
  ) {
    try {
      const login = await this.authService.login(loginRequest);
      return {
        status: HttpStatus.OK,
        message: 'Login Successful',
        access_token: login,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyMail(
    @Body(new YupValidationPipe(VerifyUserEmailSchema))
    body: VerifyUserEmailDto,
  ) {
    try {
      const hashToken = await this.helperClass.hashString(body.token);
      await this.authService.verifyEmail(hashToken);
      return {
        status: HttpStatus.OK,
        message: 'Email Verified Successfully',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  @Post('forgot-password')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset token sent successfully',
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body(new YupValidationPipe(checkEmailSchema)) body: CheckEmailRequestDto,
  ) {
    try {
      const user = await this.userService.queryUserDetails({
        email: body.email.toLocaleLowerCase(),
      });
      if (!user) throw new BadRequestException(`Oops!, user does not exist`);
      const token = this.helperClass.generateRandomString(6, 'num');
      const hashToken = await this.helperClass.hashString(token);
      await this.authService.initiateResetPassword(user, hashToken);
      await this.emailService.sendResetPasswordMail(
        `${user.first_name} ${user.last_name}`,
        user.email,
        token,
      );
      return {
        status: HttpStatus.OK,
        message: 'Password reset token sent successfully',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body(new YupValidationPipe(ResetPasswordRequestSchema))
    body: ResetPasswordRequestDto,
  ) {
    try {
      const hashToken = await this.helperClass.hashString(body.token);
      await this.authService.resetPassword({
        token: hashToken,
        password: body.password,
        confirmPassword: body.confirmPassword,
      });
      return {
        status: HttpStatus.OK,
        message: 'Password reset successful',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerificationMail(
    @Body(new YupValidationPipe(checkEmailSchema)) body: CheckEmailRequestDto,
  ) {
    try {
      const user = await this.userService.queryUserDetails({
        email: body.email.toLocaleLowerCase(),
      });
      console.log(user);
      if (!user) throw new BadRequestException(`Oops!, user does not exist`);
      if (user.status === AccountStatus.confirmed)
        throw new BadRequestException(
          `Oops!, account has already been verified`,
        );
      const token = this.helperClass.generateRandomString(6, 'num');
      const hashToken = await this.helperClass.hashString(token);
      await this.authService.resendVerificationMail(user.id, hashToken);
      await this.emailService.sendVerifyEmailMail(
        `${user.first_name} ${user.last_name}`,
        user.email,
        token,
      );
      return {
        status: HttpStatus.OK,
        message: 'Verification mail sent successfully',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
    }
  }
}
