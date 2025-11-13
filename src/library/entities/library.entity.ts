import { LibraryUser } from '../../user/entities/library-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Library {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToMany(() => LibraryUser, (libraryUser) => libraryUser.library)
  users: LibraryUser[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', select: false })
  updatedAt: Date;
}
