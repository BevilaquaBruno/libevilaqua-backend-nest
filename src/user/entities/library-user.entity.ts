import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Library } from '../../library/entities/library.entity';

@Entity('library_user')
export class LibraryUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.libraries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Library, library => library.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'libraryId' })
  library: Library;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at: Date | null;
}
