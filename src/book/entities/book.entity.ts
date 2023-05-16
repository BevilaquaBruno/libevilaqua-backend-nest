import { Type } from 'src/type/entities/type.entity';
import { Author } from 'src/author/entities/author.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { Publisher } from 'src/publisher/entities/publisher.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  edition: number;

  @Column()
  isbn: string;

  @Column()
  number_pages: number;

  @Column()
  release_year: number;

  @Column()
  obs: string;

  @ManyToOne(() => Genre, { eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'FK_genre_book' })
  genre: Genre | null;

  @ManyToOne(() => Publisher, { eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'FK_publisher_book' })
  publisher: Publisher | null;

  @ManyToOne(() => Type, { eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'FK_type_book' })
  type: Type | null;

  @ManyToMany(() => Tag, '', {
    eager: true,
    cascade: ['insert', 'update', 'soft-remove'],
  })
  @JoinTable({
    name: 'book_tag',
    joinColumn: { foreignKeyConstraintName: 'FK_book_tag' },
  })
  tags: Tag[];

  @ManyToMany(() => Author, '', {
    eager: true,
    cascade: ['insert', 'update', 'soft-remove'],
  })
  @JoinTable({
    name: 'book_author',
    joinColumn: { foreignKeyConstraintName: 'FK_book_author' },
  })
  authors: Author[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', select: false })
  updatedAt: Date;
}
