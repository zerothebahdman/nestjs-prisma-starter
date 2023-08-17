import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

// import config from '../config';
import config from 'config/api-gateway.config';
import { EMAIL_VERIFICATION } from './templates';

@Injectable()
export class MailSenderService {
  private transporter: Mail;

  private socials: string;

  private logger = new Logger('MailSenderService');

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
      if (error) Logger.error(`Error sending email :::::: ${error}`);
      else Logger.log('Server 🚀 is ready to send out mails');
    });

    return this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) Logger.error(`Error sending email :::::: ${error}`);
      else {
        console.log(`Email sent: ${info.response}`);
        console.log(`Email sent to: ${info.accepted}`);
        console.log(`Email sent count: ${info.accepted?.length}`);
        console.log(`Email failed Count: ${info.rejected?.length}`);
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
    Logger.log(`Sending email to ${email}`);
    return this.sendMail(mailOptions);
  }

  async sendChangeEmailMail(name: string, email: string, token: string) {
    // const buttonLink = `${config.project.mailChangeUrl}?token=${token}`;
    // const mail = changeMail
    //   .replace(new RegExp('--PersonName--', 'g'), name)
    //   .replace(new RegExp('--ProjectName--', 'g'), config.project.name)
    //   .replace(new RegExp('--ProjectAddress--', 'g'), config.project.address)
    //   .replace(new RegExp('--ProjectLogo--', 'g'), config.project.logoUrl)
    //   .replace(new RegExp('--ProjectSlogan--', 'g'), config.project.slogan)
    //   .replace(new RegExp('--ProjectColor--', 'g'), config.project.color)
    //   .replace(new RegExp('--ProjectLink--', 'g'), config.project.url)
    //   .replace(new RegExp('--Socials--', 'g'), this.socials)
    //   .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);
    // const mailOptions = {
    //   from: `"${config.mail.senderCredentials.name}" <${config.mail.senderCredentials.email}>`,
    //   to: email, // list of receivers (separated by ,)
    //   subject: `Change Your ${config.project.name} Account's Email`,
    //   html: mail,
    // };
    // return new Promise<boolean>((resolve) =>
    //   this.transporter.sendMail(mailOptions, async (error) => {
    //     if (error) {
    //       this.logger.warn(
    //         'Mail sending failed, check your service credentials.',
    //       );
    //       resolve(false);
    //     }
    //     resolve(true);
    //   }),
    // );
  }

  async sendResetPasswordMail(name: string, email: string, token: string) {
    // const buttonLink = `${config.project.resetPasswordUrl}?token=${token}`;
    // const mail = resetPassword
    //   .replace(new RegExp('--PersonName--', 'g'), name)
    //   .replace(new RegExp('--ProjectName--', 'g'), config.project.name)
    //   .replace(new RegExp('--ProjectAddress--', 'g'), config.project.address)
    //   .replace(new RegExp('--ProjectLogo--', 'g'), config.project.logoUrl)
    //   .replace(new RegExp('--ProjectSlogan--', 'g'), config.project.slogan)
    //   .replace(new RegExp('--ProjectColor--', 'g'), config.project.color)
    //   .replace(new RegExp('--ProjectLink--', 'g'), config.project.url)
    //   .replace(new RegExp('--Socials--', 'g'), this.socials)
    //   .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);
    // const mailOptions = {
    //   from: `"${config.mail.senderCredentials.name}" <${config.mail.senderCredentials.email}>`,
    //   to: email, // list of receivers (separated by ,)
    //   subject: `Reset Your ${config.project.name} Account's Password`,
    //   html: mail,
    // };
    // return new Promise<boolean>((resolve) =>
    //   this.transporter.sendMail(mailOptions, async (error) => {
    //     if (error) {
    //       this.logger.warn(
    //         'Mail sending failed, check your service credentials.',
    //       );
    //       resolve(false);
    //     }
    //     resolve(true);
    //   }),
    // );
  }

  async sendPasswordChangeInfoMail(name: string, email: string) {
    // const buttonLink = config.project.url;
    // const mail = changePasswordInfo
    //   .replace(new RegExp('--PersonName--', 'g'), name)
    //   .replace(new RegExp('--ProjectName--', 'g'), config.project.name)
    //   .replace(new RegExp('--ProjectAddress--', 'g'), config.project.address)
    //   .replace(new RegExp('--ProjectLogo--', 'g'), config.project.logoUrl)
    //   .replace(new RegExp('--ProjectSlogan--', 'g'), config.project.slogan)
    //   .replace(new RegExp('--ProjectColor--', 'g'), config.project.color)
    //   .replace(new RegExp('--ProjectLink--', 'g'), config.project.url)
    //   .replace(new RegExp('--Socials--', 'g'), this.socials)
    //   .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);
    // const mailOptions = {
    //   from: `"${config.mail.senderCredentials.name}" <${config.mail.senderCredentials.email}>`,
    //   to: email, // list of receivers (separated by ,)
    //   subject: `Your ${config.project.name} Account's Password is Changed`,
    //   html: mail,
    // };
    // return new Promise<boolean>((resolve) =>
    //   this.transporter.sendMail(mailOptions, async (error) => {
    //     if (error) {
    //       this.logger.warn(
    //         'Mail sending failed, check your service credentials.',
    //       );
    //       resolve(false);
    //     }
    //     resolve(true);
    //   }),
    // );
  }
}
