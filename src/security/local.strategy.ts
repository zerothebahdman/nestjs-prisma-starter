import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string): Promise<any> {
    const user = await this.authService.validateUser({
      email,
    });
    if (!user) {
      throw new BadRequestException('Oops Invalid Credentials');
    }
    return user;
  }
}
