import { Book } from '../../book/entities/book.entity';
import { Person } from '../../person/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'date' })
  return_date: Date;

  @Column({ type: 'date' })
  must_return_date: Date;

  @Column({ type: 'date' })
  loan_date: Date;

  @ManyToOne(() => Book, { eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'FK_book_loan' })
  book: Book;

  @ManyToOne(() => Person, { eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'FK_person_loan' })
  person: Person;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', select: false })
  updatedAt: Date;
}
