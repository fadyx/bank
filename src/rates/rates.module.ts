import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import RatesController from './rates.controller';
import RatesService from './rates.service';

@Module({
  controllers: [RatesController],
  exports: [RatesService],
  imports: [HttpModule],
  providers: [RatesService],
})
export class RatesModule {}
