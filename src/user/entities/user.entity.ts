import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  toJson() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}
