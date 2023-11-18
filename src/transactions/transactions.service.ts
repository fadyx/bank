import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from './entities/transaction.entity';
import TransactionsQuerySearchParams from './types/transactions-query-search-params.type';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async listTransactions(
    userId: number,
    accountId: number,
    query: TransactionsQuerySearchParams,
  ) {
    const [orderByColumn, order] = (query.orderBy ?? 'id_ASC').split('_');

    const transactions = await this.transactionsRepository.query(
      `
        select t.*
        from account a 
        left join "transaction" t on a.id = t."senderAccountId" or a.id = t."recipientAccountId" 
        where a."userId" = $1 and a.id = $2
        order by t."${orderByColumn}" ${order}
        offset $3
        limit $4;
    `,
      [userId, accountId, query.offset, query.limit],
    );

    return transactions as Transaction[];
  }
}

export default TransactionsService;
