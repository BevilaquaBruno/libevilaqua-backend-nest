import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { AuthService } from 'src/auth/auth.service';
import { ResetToken } from 'src/reset-token/entities/reset-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ResetToken])],
  controllers: [UserController],
  providers: [UserService, MailService, AuthService],
  exports: [UserService],
})
export class UserModule { }
