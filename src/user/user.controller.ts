import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Usr } from './user.decorator';
import { AuthUser } from '../auth/auth-user';
import { YupValidationPipe } from '../validator/yup.validation';
import { UpdateUserRequestDto, UpdateUserRequestSchema } from './models';
import { HttpExceptionFilter } from '../exception/http-exception-filter';

@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async updateUser(
    @Param('id') id: string,
    @Body(new YupValidationPipe(UpdateUserRequestSchema))
    updateRequest: UpdateUserRequestDto,
    @Usr() user: AuthUser,
  ): Promise<void> {
    if (id !== user.id) {
      throw new UnauthorizedException();
    }
    await this.userService.updateUser(id, updateRequest);
  }
}
