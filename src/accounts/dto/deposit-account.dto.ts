import { IsNumber, IsPositive } from 'class-validator';

export class DepositAccountDto {
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive({ always: true })
  amount: number;
}

export default DepositAccountDto;
