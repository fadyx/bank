import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';
import TransactionType from '../constants/transaction-type.constant';

@Entity()
export class Transaction extends BaseEntity {
  @Column({ nullable: true })
  public description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public amount: number;

  @Column({ type: 'text', nullable: false })
  public type: TransactionType;

  @Index('sender_account_id_index')
  @Column()
  public senderAccountId: number;

  @ManyToOne(() => Account, (account) => account.sentTransactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'senderAccountId' })
  senderAccount: Account;

  @Index('recipient_account_id_index')
  @Column()
  public recipientAccountId: number;

  @ManyToOne(() => Account, (account) => account.receivedTransactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'recipientAccountId' })
  recipientAccount: Account;
}

export default Transaction;
