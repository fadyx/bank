import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { UsersModule } from '../users/users.module';

@Module({
  exports: [TransactionsService, TypeOrmModule.forFeature([Transaction])],
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => UsersModule),
  ],
  controllers: [],
  providers: [TransactionsService],
})
export class TransactionsModule {}

export default TransactionsModule;
