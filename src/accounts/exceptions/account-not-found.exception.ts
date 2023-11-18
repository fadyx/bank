import { NotFoundException } from '@nestjs/common';

export class AccountNotFoundException extends NotFoundException {
  constructor(accountId: number) {
    super(`Could not find account with id: ${accountId}.`);
  }
}

export default AccountNotFoundException;
