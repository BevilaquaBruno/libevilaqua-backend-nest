import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}