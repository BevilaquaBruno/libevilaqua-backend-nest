import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { States } from '../../helpers/enum/States.enum';
import { Library } from '../../library/entities/library.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  document: string;

  @Column()
  zip_code: string;

  @Column()
  state: States;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  obs: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @ManyToOne(() => Library, { eager: false })
  @JoinColumn({ name: 'libraryId', foreignKeyConstraintName: 'FK_library_person' })
  library?: Library;

  @Column({ select: false })
  libraryId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', select: false })
  updatedAt: Date;
}
