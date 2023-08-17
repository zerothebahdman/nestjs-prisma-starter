import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  ChangeEmailRequest,
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
import { MailSenderService } from 'src/mail-sender/mail-sender.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly helperClass: HelperClass,
    private readonly emailService: MailSenderService,
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

  @ApiBearerAuth()
  @Post('change-email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async sendChangeEmailMail(
    @Usr() user: AuthUser,
    @Body() changeEmailRequest: ChangeEmailRequest,
  ): Promise<void> {
    await this.authService.sendChangeEmailMail(
      changeEmailRequest,
      user.id,
      user.firstName,
      user.email,
    );
  }

  @Get('change-email')
  @HttpCode(HttpStatus.OK)
  async changeEmail(@Query('token') token: string): Promise<void> {
    await this.authService.changeEmail(token);
  }

  @Post('forgot-password/:email')
  @HttpCode(HttpStatus.OK)
  async sendResetPassword(@Param('email') email: string): Promise<void> {
    const user = await this.userService.queryUserDetails({
      email: email.toLocaleLowerCase(),
    });
    const token = this.helperClass.generateRandomString(6, 'num');
    const hashToken = await this.helperClass.hashString(token);
    await this.authService.initiateResetPassword(user, hashToken);
    await this.emailService.sendResetPasswordMail(user.name, user.email, token);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordRequest,
    @Usr() user: AuthUser,
  ): Promise<void> {
    await this.authService.changePassword(
      changePasswordRequest,
      user.id,
      user.firstName,
      user.email,
    );
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
  // @UseGuards(AuthGuard())
  async resendVerificationMail(@Body() body: CheckEmailRequest): Promise<void> {
    const user = await this.userService.queryUserDetails({
      email: body.email.toLocaleLowerCase(),
    });
    // if (user.accountStatus.status === ACCOUNT_STATUS.CONFIRMED)
    //   throw new Error(`Oops!, account has already been verified`);
    const token = this.helperClass.generateRandomString(6, 'num');
    const hashToken = await this.helperClass.hashString(token);
    await this.authService.resendVerificationMail(user.id, hashToken);
    await this.emailService.sendVerifyEmailMail(user.name, user.email, token);
  }
}
