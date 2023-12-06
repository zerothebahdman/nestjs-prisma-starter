import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HelperClass } from '../utils/helpers';
import { JwtStrategy } from './jwt.strategy';
import { MailSenderModule } from '../mail-sender/mail-sender.module';
import { Module } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { UserService } from '../user/user.service';

// import { join } from 'path';
// import { readFile } from 'fs/promises';

// let PRIVATE_KEY = '';
// (async () => {
//   try {
//     PRIVATE_KEY = await readFile(
//       join(__dirname, '../certs/private_key.pem'),
//       'utf8',
//     );
//   } catch (err) {
//     Logger.error(err.message);
//   }
// })();

// let PUBLIC_KEY = '';
// (async () => {
//   try {
//     PUBLIC_KEY = await readFile(
//       join(__dirname, '../certs/public_key.pem'),
//       'utf8',
//     );
//   } catch (err) {
//     Logger.error(err.message);
//   }
// })();

@Module({
  imports: [
    ConfigModule,
    MailSenderModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          privateKey: configService.getOrThrow('JWT_PRIVATE_KEY'),
          publicKey: configService.getOrThrow('JWT_PUBLIC_KEY'),
          signOptions: {
            expiresIn: '3h',
            algorithm: 'RS256',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    PrismaService,
    HelperClass,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
