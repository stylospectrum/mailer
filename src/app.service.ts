import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';

enum EmailTemplates {
  FORGOT_PASSWORD = 'forgot-password',
}

@Injectable()
export class AppService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com ',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.getOrThrow('USERNAME'),
        pass: this.configService.getOrThrow('PASSWORD'),
      },
    });
  }

  async sendEmail(sendEmailDto: SendEmailDto): Promise<{ sent: boolean }> {
    const { template, otp, subject, to } = sendEmailDto;
    const templatePath = join(
      __dirname,
      './templates/',
      `${EmailTemplates[template]}.html`,
    );
    let content = readFileSync(templatePath, 'utf-8');

    if (EmailTemplates[template] === 'forgot-password') {
      content = content.replace('$OTP', otp);
    }

    try {
      const info = await this.transporter.sendMail({
        from: {
          name: 'Stylospectrum.com',
          address: this.configService.getOrThrow('USERNAME'),
        },
        to,
        subject: subject,
        html: content,
      });

      this.logger.log(`Message sent: ${info.messageId}`);

      return {
        sent: true,
      };
    } catch (err) {
      this.logger.error(err);
      return {
        sent: false,
      };
    }
  }
}
