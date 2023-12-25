import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'mailer.service',
      protoPath: join(process.cwd(), 'src/proto/mailer.proto'),
      url: configService.getOrThrow('SERVICE_URL'),
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
