import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { User } from '../user/entities/user.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly i18nService: I18nService,
  ) {}

  async sendUserConfirmation(user: User, token: string, libraryName: string) {
    const url =
      process.env['FRONT_END_URL'] + `/confirmar-acesso?token=${token}`;
    const template = readFileSync(
      this.getTemplatePath(
        user.language + '/sendUserConfirmation.template.html',
      ),
      'utf-8',
    );

    const sendUserConfirmationHTML = template
      .replace(/{{APP_NAME}}/g, process.env['APP_NAME'])
      .replace(/{{URL}}/g, url)
      .replace(/{{LIBRARY_NAME}}/g, libraryName);

    this.mailerService.sendMail({
      to: user.email,
      subject:
        process.env['APP_NAME'] +
        ' - ' +
        this.i18nService.translate('mail.user_confirmation.confirm_email', {
          lang: user.language,
        }),
      text: `${this.i18nService.translate('mail.user_confirmation.please_confirm_your_registration', { lang: user.language })} ${libraryName} ${this.i18nService.translate('mail.user_confirmation.in_app', { lang: user.language })} ${process.env['APP_NAME']}: ${url}`,
      html: sendUserConfirmationHTML,
    });
  }

  async sendResetPasswordRequest(user: User, token: string) {
    const url = process.env['FRONT_END_URL'] + `/resetar-senha?token=${token}`;
    const template = readFileSync(
      this.getTemplatePath(
        user.language + '/sendResetPasswordRequest.template.html',
      ),
      'utf-8',
    );

    const sendResetPasswordRequestHTML = template
      .replace(/{{APP_NAME}}/g, process.env['APP_NAME'])
      .replace(/{{URL}}/g, url);

    this.mailerService.sendMail({
      to: user.email,
      subject:
        process.env['APP_NAME'] +
        ' - ' +
        this.i18nService.translate('mail.reset_password.reset_your_password', {
          lang: user.language,
        }),
      text: `${this.i18nService.translate('mail.general.hi', { lang: user.language })} ${user.name}. ${this.i18nService.translate('mail.reset_password.access_this_link', { lang: user.language })}: ${url}`,
      html: sendResetPasswordRequestHTML,
    });
  }

  private getTemplatePath(filename: string): string {
    const distPath = join(__dirname, 'templates', filename);
    const srcPath = join(process.cwd(), 'src', 'mail', 'templates', filename);
    const basePath = join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'en',
      filename,
    );

    if (existsSync(distPath)) {
      return distPath;
    }

    if (existsSync(srcPath)) {
      return srcPath;
    }

    return basePath;
  }
}
