import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account } from './entities/account.entity';
import { UsersModule } from '../users/users.module';
import TransactionsModule from 'src/transactions/transactions.module';

@Module({
  exports: [AccountsService],
  imports: [
    TypeOrmModule.forFeature([Account]),
    TransactionsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}

export default AccountsModule;
