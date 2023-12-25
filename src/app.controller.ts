import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('mailer')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('MailerService')
  sendEmail(sendEmailDto: SendEmailDto) {
    return this.appService.sendEmail(sendEmailDto);
  }
}
