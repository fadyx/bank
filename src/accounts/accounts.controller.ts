import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthenticationGuard } from '../common/guards/jwt-authentication.guard';
import { RequestWithUser } from '../common/types/request-with-user.type';
import CreateAccountDto from './dto/create-account.dto';
import AccountsService from './accounts.service';
import RoleType from 'src/common/constants/role-type.constant';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AccountQuerySearchParams } from './types/account-query-search-params.type';
import DepositAccountDto from './dto/deposit-account.dto';
import WithdrawAccountDto from './dto/withdraw-account.dto';
import TransferTransactionDto from './dto/transfer-transaction.dto';
import TransactionsService from 'src/transactions/transactions.service';
import TransactionsQuerySearchParams from 'src/transactions/types/transactions-query-search-params.type';
import UpdateAccountDto from './dto/update-account.dto';

@Controller('v1/accounts')
@ApiTags('accounts')
@ApiBearerAuth('access-token')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'List all accounts' })
  async findAll(@Query() query: AccountQuerySearchParams) {
    return this.accountsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Get account details by ID' })
  async findAccount(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.accountsService.findById(request.user.id, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update account details by ID' })
  async updateAccount(
    @Param('id') accountId: number,
    @Req() request: RequestWithUser,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(
      request.user.id,
      accountId,
      updateAccountDto,
    );
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Body() createAccountDto: CreateAccountDto,
    @Req() request: RequestWithUser,
  ) {
    return this.accountsService.create(createAccountDto, request.user);
  }

  @Post('/:id/deposit')
  @UseGuards(JwtAuthenticationGuard)
  deposit(
    @Param('id') id: number,
    @Body() depositAccountDto: DepositAccountDto,
    @Req() request: RequestWithUser,
  ) {
    return this.accountsService.deposit(
      request.user.id,
      id,
      depositAccountDto.amount,
    );
  }

  @Post(':id/withdraw')
  @UseGuards(JwtAuthenticationGuard)
  withdraw(
    @Param('id') id: number,
    @Body() withdrawAccountDto: WithdrawAccountDto,
    @Req() request: RequestWithUser,
  ) {
    return this.accountsService.withdraw(
      request.user.id,
      id,
      withdrawAccountDto.amount,
    );
  }

  @Post(':id/transfer')
  @UseGuards(JwtAuthenticationGuard)
  transfer(
    @Param('id') senderAccountId: number,
    @Body() transferTransactionDto: TransferTransactionDto,
    @Req() request: RequestWithUser,
  ) {
    return this.accountsService.transfer(
      request.user.id,
      senderAccountId,
      transferTransactionDto,
    );
  }

  @Get(':id/transactions')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Get transactions history for an account' })
  async listTransactions(
    @Param('id') accountId: number,
    @Req() request: RequestWithUser,
    @Query() query: TransactionsQuerySearchParams,
  ) {
    return this.transactionsService.listTransactions(
      request.user.id,
      accountId,
      query,
    );
  }
}

export default AccountsController;
