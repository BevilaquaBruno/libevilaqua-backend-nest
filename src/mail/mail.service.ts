import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendUserConfirmation(email: string, token: string) {
    const url = `https://meuapp.com/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirme seu cadastro',
      text: `Por favor, confirme seu cadastro acessando: ${url}`,
      html: `<p>Por favor, confirme seu cadastro acessando o link abaixo:</p>
             <a href="${url}">${url}</a>`,
    });
  }
}
