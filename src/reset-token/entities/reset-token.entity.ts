import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reset_tokens')
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  // E significa que o token é de confirmação de e-mail, S é para reset de senha
  @Column()
  type: 'E' | 'S';
}
