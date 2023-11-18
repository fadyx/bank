import Account from '../entities/account.entity';

export type AccountWithBalance = Account & { balance: number };
