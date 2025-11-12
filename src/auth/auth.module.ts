import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { ResetToken } from '../reset-token/entities/reset-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryService } from '../library/library.service';
import { Library } from '../library/entities/library.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MailService, LibraryService],
  exports: [AuthService],
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env['SECRET'],
      signOptions: { expiresIn: '21600s' },
    }),
    TypeOrmModule.forFeature([ResetToken, Library]),
  ],
})
export class AuthModule {}
