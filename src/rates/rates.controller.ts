import { Controller, Get, Param } from '@nestjs/common';
import RatesService from './rates.service';

@Controller('v1/rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get(':currency')
  async getRates(@Param('currency') currency: string): Promise<any> {
    return this.ratesService.getExchangeRates(currency);
  }
}

export default RatesController;
