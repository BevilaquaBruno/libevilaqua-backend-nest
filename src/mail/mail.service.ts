import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendUserConfirmation(email: string, token: string) {
    const url = `https://meuapp.com/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Libevilaqua: Confirme seu cadastro',
      text: `Por favor, confirme seu cadastro acessando: ${url}`,
      html: `<p>Por favor, confirme seu cadastro acessando o link abaixo:</p>
             <a href="${url}">${url}</a>`,
    });
  }

  async sendResetPasswordRequest(name: string, email: string, token: string) {
    const url = `google.com?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Libevilaqua: Resete sua senha',
      text: `Olá ${name}. Acesse o link abaixo para resetar sua senha: ${url}`,
      html: `<p>Olá ${name}</p><p>Acesse o link abaixo para resetar sua senha:</p>
        <a href="${url}">${url}</a>`,
    });
  }
}
