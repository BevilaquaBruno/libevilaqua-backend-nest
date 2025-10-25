export class PayloadAuthDto {
  username: string;
  sub: number;

  // Quando for true, significa que o token é de login, quando false, é um token de alteração de senha ou de e-mail
  logged: boolean;
}
