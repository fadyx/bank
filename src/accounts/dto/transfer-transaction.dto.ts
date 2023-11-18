import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class TransferTransactionDto {
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive({ always: true })
  @IsNotEmpty()
  amount: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsNotEmpty()
  recipientAccountId: number;
}

export default TransferTransactionDto;
