import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Usr } from '../user/user.decorator';
import {
  ChangePasswordRequest,
  CheckEmailRequest,
  CheckEmailResponse,
  CheckUsernameRequest,
  CheckUsernameResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  SignupRequest,
} from './dtos';
import { UserResponse } from '../user/models';
import { AuthUser } from './auth-user';
import { UserService } from '../user/user.service';
import { HelperClass } from 'src/utils/helpers';
import { EmailService } from 'src/mail-sender/mail-sender.service';
import { AccountStatus } from '@prisma/client';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly helperClass: HelperClass,
    private readonly emailService: EmailService,
  ) {}

  @ApiOperation({ summary: 'Check username validity' })
  @Post('check-username')
  @HttpCode(HttpStatus.OK)
  async checkUsernameAvailability(
    @Body() checkUsernameRequest: CheckUsernameRequest,
  ): Promise<CheckUsernameResponse> {
    const isAvailable = await this.authService.isUsernameAvailable(
      checkUsernameRequest.username,
    );
    return new CheckUsernameResponse(isAvailable);
  }

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmailAvailability(
    @Body() checkEmailRequest: CheckEmailRequest,
  ): Promise<CheckEmailResponse> {
    const isAvailable = await this.authService.isEmailAvailable(
      checkEmailRequest.email,
    );
    return new CheckEmailResponse(isAvailable);
  }
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User created successfully',
    type: UserResponse,
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupRequest: SignupRequest): Promise<void> {
    const token = this.helperClass.generateRandomString(6, 'num');
    const hashToken = await this.helperClass.hashString(token);
    await this.authService.signup(signupRequest, hashToken);
    await this.emailService.sendVerifyEmailMail(
      signupRequest.firstName,
      signupRequest.email,
      token,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return new LoginResponse(await this.authService.login(loginRequest));
  }

  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async getUserWithToken(@Usr() user: AuthUser): Promise<UserResponse> {
    return UserResponse.fromUserEntity(user);
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verifyMail(@Query('token') token: string): Promise<void> {
    await this.authService.verifyEmail(token);
  }

  @Get('change-email')
  @HttpCode(HttpStatus.OK)
  async changeEmail(@Query('token') token: string): Promise<void> {
    await this.authService.changeEmail(token);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordRequest,
    @Usr() user: AuthUser,
  ): Promise<void> {
    await this.authService.changePassword(changePasswordRequest, user.id);
    this.emailService.sendPasswordChangeInfoMail(user.firstName, user.email);
  }

  @Post('forgot-password')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset token sent successfully',
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: CheckEmailRequest) {
    const user = await this.userService.queryUserDetails({
      email: body.email.toLocaleLowerCase(),
    });
    const token = this.helperClass.generateRandomString(6, 'num');
    const hashToken = await this.helperClass.hashString(token);
    await this.authService.initiateResetPassword(user, hashToken);
    await this.emailService.sendResetPasswordMail(user.name, user.email, token);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordRequest,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordRequest);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerificationMail(@Body() body: CheckEmailRequest): Promise<void> {
    const user = await this.userService.queryUserDetails({
      email: body.email.toLocaleLowerCase(),
    });
    if (user.status === AccountStatus.confirmed)
      throw new Error(`Oops!, account has already been verified`);
    const token = this.helperClass.generateRandomString(6, 'num');
    const hashToken = await this.helperClass.hashString(token);
    await this.authService.resendVerificationMail(user.id, hashToken);
    await this.emailService.sendVerifyEmailMail(user.name, user.email, token);
  }
}
