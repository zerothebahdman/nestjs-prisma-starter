import { Module } from '@nestjs/common';
import { EmailService } from './mail-sender.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class MailSenderModule {}
