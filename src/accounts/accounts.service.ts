import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';
import { AccountQuerySearchParams } from './types/account-query-search-params.type';
import { Transaction } from '../transactions/entities/transaction.entity';
import AccountNotFoundException from './exceptions/account-not-found.exception';
import TransactionType from 'src/transactions/constants/transaction-type.constant';
import { AccountWithBalance } from './types/account-with-balance.type';
import InsufficientFundsException from './exceptions/withdraw-insuffcient.exception';
import TransferTransactionDto from './dto/transfer-transaction.dto';
import UpdateAccountDto from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private ds: DataSource,
  ) {}

  async findAll(query: AccountQuerySearchParams) {
    const { limit, offset } = query;

    const order: Record<string, { direction: string }> = {};

    if (query.orderBy) {
      const orders = query.orderBy.split('_');
      const column = orders[0];
      const direction = orders[1];
      order[column] = { direction };
    }

    const where: FindOneOptions<Account>['where'] = {};

    if (query.userId) where.userId = query.userId;

    const [items, count] = await this.accountsRepository.findAndCount({
      order,
      where,
      skip: offset,
      take: limit,
    });

    return { count, items };
  }

  async findById(
    userId: number,
    accountId: number,
  ): Promise<AccountWithBalance | null> {
    const queryResults = await this.accountsRepository.query(
      `
        select
          a.*,
          (coalesce(sum(t.amount) filter(where t."type" = 'DEPOSIT'), 0) -
          coalesce(sum(t.amount) filter(where t."type" = 'WITHDRAW'), 0) +
          coalesce(sum(t.amount) filter(where t."type" = 'TRANSFER' and T."recipientAccountId" = a.id), 0) -
          coalesce(sum(t.amount) filter(where t."type" = 'TRANSFER' and T."senderAccountId" = a.id), 0))
        as balance
        from account a
        left join transaction t on a.id = t."senderAccountId" OR a.id = t."recipientAccountId"
        where a.id = $1 and a."userId" = $2
        group by a.id;
      `,
      [accountId, userId],
    );

    const account = queryResults.pop();

    return account;
  }

  async create(createAccountDto: CreateAccountDto, user: User) {
    const account = this.accountsRepository.create({
      ...createAccountDto,
      userId: user.id,
    });
    await this.accountsRepository.save(account);
    return account;
  }

  async updateAccount(
    userId: number,
    accountId: number,
    updateAccountDto: UpdateAccountDto,
  ) {
    const updatedRows = await this.accountsRepository.update(
      {
        userId,
        id: accountId,
      },
      { ...updateAccountDto },
    );
    if (!updatedRows.affected) throw new AccountNotFoundException(accountId);
  }

  async findForUser(userId: number): Promise<Account[]> {
    const accounts = this.accountsRepository.findBy({ userId });
    return accounts;
  }

  async deposit(
    userId: number,
    accountId: number,
    amount: number,
  ): Promise<boolean> {
    const ownsAccount = await this.accountsRepository.exist({
      where: { userId, id: accountId },
    });

    if (!ownsAccount) throw new AccountNotFoundException(accountId);

    await this.transactionsRepository.insert({
      type: TransactionType.DEPOSIT,
      amount,
      recipientAccountId: accountId,
      senderAccountId: accountId,
    });

    return true;
  }

  async withdraw(userId: number, accountId: number, amount: number) {
    const uow = async () => {
      const tx = this.ds.createQueryRunner();
      await tx.connect();
      await tx.startTransaction();

      try {
        const accounts = await tx.query(
          `
            select *
            from public."user" u
            join public."account" a on u."id" = a."userId" 
            where u."id" = $1 and a."id" = $2
            for update;
          `,
          [userId, accountId],
        );

        const account = await this.findById(userId, accountId);

        if (!accounts.length || !account)
          throw new AccountNotFoundException(accountId);

        const { balance } = account;

        if (amount > Number(balance)) throw new InsufficientFundsException();

        await tx.manager.save(Transaction, [
          {
            recipientAccountId: accountId,
            senderAccountId: accountId,
            amount,
            type: TransactionType.WITHDRAW,
          },
        ]);

        await tx.commitTransaction();
      } catch (error) {
        this.logger.error(error);
        await tx.rollbackTransaction();
        throw error;
      } finally {
        await tx.release();
      }
    };
    await uow();
  }

  async transfer(
    userId: number,
    senderAccountId: number,
    transferTransactionDto: TransferTransactionDto,
  ) {
    const uow = async () => {
      const tx = this.ds.createQueryRunner();
      await tx.connect();
      await tx.startTransaction();

      try {
        const accounts = await tx.query(
          `
            select *
            from public."user" u
            join public."account" a on u."id" = a."userId" 
            where u."id" = $1 and a."id" = $2
            for update;
          `,
          [userId, senderAccountId],
        );

        const account = await this.findById(userId, senderAccountId);

        if (!accounts.length || !account)
          throw new AccountNotFoundException(senderAccountId);

        const { balance } = account;

        if (transferTransactionDto.amount > Number(balance))
          throw new InsufficientFundsException();

        await tx.manager.save(Transaction, [
          {
            recipientAccountId: transferTransactionDto.recipientAccountId,
            senderAccountId,
            amount: transferTransactionDto.amount,
            type: TransactionType.TRANSFER,
          },
        ]);

        await tx.commitTransaction();
      } catch (error) {
        this.logger.error(error);
        await tx.rollbackTransaction();
        throw error;
      } finally {
        await tx.release();
      }
    };
    await uow();
  }
}

export default AccountsService;
