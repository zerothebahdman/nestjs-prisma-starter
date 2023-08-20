import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

// import config from '../config';
import config from 'config/api-gateway.config';
import { EMAIL_VERIFICATION, PASSWORD_RESET } from './templates';

@Injectable()
export class EmailService {
  private transporter: Mail;
  private logger = new Logger('EmailService');

  constructor() {
    this.transporter = createTransport({
      host: config().mail.host,
      port: Number(config().mail.port),
      connectionTimeout: 300000,
      pool: true,
      logger: true,
      secure: false,
      auth: {
        user: config().mail.user,
        pass: config().mail.password,
      },
      ignoreTLS: false,
    });
  }

  private async sendMail(mailOptions: Mail.Options) {
    this.transporter.verify((error) => {
      if (error) this.logger.error(`Error sending email :::::: ${error}`);
      else this.logger.log('Server 🚀 is ready to send out mails');
    });

    return this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) Logger.error(`Error sending email :::::: ${error}`);
      else {
        this.logger.log(`Email sent: ${info.response}`);
        this.logger.log(`Email sent to: ${info.accepted}`);
        this.logger.log(`Email sent count: ${info.accepted?.length}`);
        this.logger.log(`Email failed Count: ${info.rejected?.length}`);
      }
    });
  }

  async sendVerifyEmailMail(name: string, email: string, token: string) {
    const mailOptions = {
      from: config().mail.from,
      to: email, // list of receivers (separated by ,)
      subject: 'Email Verification Requested',
      html: EMAIL_VERIFICATION(name, token),
    };
    this.logger.log(`Sending email to ${email}`);
    return this.sendMail(mailOptions);
  }

  async sendChangeEmailMail(name: string, email: string, token: string) {
    const mailOptions = {
      from: config().mail.from,
      to: email, // list of receivers (separated by ,)
      subject: 'Email Change Requested',
      html: PASSWORD_RESET(name, token),
    };
    this.logger.log(`Sending email to ${email}`);
    return this.sendMail(mailOptions);
  }

  async sendResetPasswordMail(name: string, email: string, token: string) {
    const mailOptions = {
      from: config().mail.from,
      to: email, // list of receivers (separated by ,)
      subject: 'Password Reset Requested',
      html: PASSWORD_RESET(name, token),
    };
    this.logger.log(`Sending email to ${email}`);
    return this.sendMail(mailOptions);
  }
}
