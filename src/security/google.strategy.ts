import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '966830297296-l2li3u7r0j0i5hahmbo8eouv5tf1p3iu.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://getkrext.com/api/v1/auth/google-callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    acccessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      picture: photos[0].value,
      acccessToken,
    };
    done(null, user);
  }
}
