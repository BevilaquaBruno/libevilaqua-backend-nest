import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendUserConfirmation(email: string, token: string, libraryName: string) {
    const url = process.env['FRONT_END_URL'] + `/confirmar-acesso?token=${token}`;
    const template = readFileSync(this.getTemplatePath('sendUserConfirmation.template.html'), 'utf-8');

    const sendUserConfirmationHTML = template
      .replace(/{{APP_NAME}}/g, process.env['APP_NAME'])
      .replace(/{{URL}}/g, url)
      .replace(/{{LIBRARY_NAME}}/g, libraryName);

    this.mailerService.sendMail({
      to: email,
      subject: process.env['APP_NAME'] + ' - Confirme seu cadastro',
      text: `Por favor, confirme seu cadastro a biblioteca ${libraryName} no app ${process.env['APP_NAME']} acessando a URL: ${url}`,
      html: sendUserConfirmationHTML,
    });
  }

  async sendResetPasswordRequest(name: string, email: string, token: string) {
    const url = process.env['FRONT_END_URL'] + `/resetar-senha?token=${token}`;
    const template = readFileSync(this.getTemplatePath('sendResetPasswordRequest.template.html'), 'utf-8');

    const sendResetPasswordRequestHTML = template
      .replace(/{{APP_NAME}}/g, process.env['APP_NAME'])
      .replace(/{{URL}}/g, url);

    this.mailerService.sendMail({
      to: email,
      subject: process.env['APP_NAME'] + ' - Resete sua senha',
      text: `Olá ${name}. Acesse o link abaixo para resetar sua senha: ${url}`,
      html: sendResetPasswordRequestHTML,
    });
  }

  private getTemplatePath(filename: string): string {
    const distPath = join(__dirname, 'templates', filename);
    const srcPath = join(process.cwd(), 'src', 'mail', 'templates', filename);

    if (existsSync(distPath)) {
      return distPath;
    }

    return srcPath;
  }
}
