import { IsNumber, IsOptional, Matches } from 'class-validator';
import PaginationParams from 'src/common/types/pagination-params.type';

export class AccountQuerySearchParams extends PaginationParams {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsOptional()
  @Matches(/^(updatedAt|createdAt|name|userId)_(ASC|DESC)$/, {
    message: 'orderBy parameter must be in the format [property]_[orderType]',
  })
  orderBy?: string;
}

export default AccountQuerySearchParams;
