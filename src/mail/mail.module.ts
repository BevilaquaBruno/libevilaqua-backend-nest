import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env['SMTP_HOST'],
        port: 587,
        secure: false,
        auth: {
          user: process.env['SMTP_USER'],
          pass: process.env['SMTP_PASS'],
        },
      },
      defaults: {
        from: '"Libevilaqua" <'+process.env['SMTP_USER']+'>',
      },
      preview: false, // mostra no navegador (opcional)
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
