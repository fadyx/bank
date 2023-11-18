import {
  Column,
  Entity,
  ManyToOne,
  Index,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
@Index(['userId', 'id'])
export class Account extends BaseEntity {
  @Column({ type: 'text' })
  public name: string;

  @Index('account_user_id_index')
  @Column()
  public userId: number;

  @ManyToOne(() => User, (user: User) => user.accounts, { nullable: false })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.recipientAccount)
  receivedTransactions: Transaction[];
}

export default Account;
