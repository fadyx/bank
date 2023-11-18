import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entities/base.entity';
import { RoleType } from 'src/common/constants/role-type.constant';
import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'text' })
  public firstName: string;

  @Column({ type: 'text' })
  public lastName: string;

  @Column({ type: 'text', unique: true })
  public email: string;

  @Column({ type: 'text', unique: true })
  public phone: string;

  @Column({ type: 'text', nullable: true })
  public address: string;

  @Column({ type: 'bytea' })
  @Exclude()
  public password: Blob;

  @Column({ type: 'text', default: RoleType.USER })
  @Exclude()
  public role: RoleType;

  @OneToMany(() => Account, (account: Account) => account.user)
  public accounts: Account[];

  @Column({ nullable: true, type: 'text' })
  @Exclude()
  public hashedRefreshToken: string | null;
}

export default User;
