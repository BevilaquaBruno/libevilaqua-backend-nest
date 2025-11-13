import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library])],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
