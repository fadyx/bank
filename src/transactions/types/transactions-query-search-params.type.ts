import { IsOptional, Matches } from 'class-validator';
import PaginationParams from 'src/common/types/pagination-params.type';

export class TransactionsQuerySearchParams extends PaginationParams {
  @IsOptional()
  @Matches(
    /^(id|type|amount|createdAt|senderAccountId|recipientAccountId)_(ASC|DESC)$/,
    {
      message: 'orderBy parameter must be in the format [property]_[orderType]',
    },
  )
  orderBy?: string;
}

export default TransactionsQuerySearchParams;
