import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthenticationGuard } from '../common/guards/jwt-authentication.guard';
import { RequestWithUser } from '../common/types/request-with-user.type';
import { AccountsService } from '../accounts/accounts.service';

@Controller('v1/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Get('profile/accounts')
  @UseGuards(JwtAuthenticationGuard)
  profileAccounts(@Req() request: RequestWithUser) {
    return this.accountsService.findForUser(request.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthenticationGuard)
  updateOne(
    @Req() request: RequestWithUser,
    @Body() updatedUserData: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(request.user.id, updatedUserData);
  }
}
