import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { ResetToken } from '../reset-token/entities/reset-token.entity';
import { Library } from '../library/entities/library.entity';
import { LibraryUser } from './entities/library-user.entity';
import { LibraryService } from '../library/library.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([User, ResetToken, LibraryUser, Library])],
  controllers: [UserController],
  providers: [UserService, MailService, AuthService, LibraryService],
  exports: [UserService],
})
export class UserModule { }
