import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import AccountsModule from 'src/accounts/accounts.module';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UsersModule,
    PassportModule,
    AccountsModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  providers: [AuthService],
})
export class AuthModule {}
