import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Rate } from './types/rate.type';
import RatesServiceUnavailableException from './exceptions/rates-unavailable.exception';

@Injectable()
export class RatesService {
  private readonly baseUrl = 'https://www.floatrates.com/daily/';
  private readonly logger = new Logger(RatesService.name);

  constructor(private readonly httpService: HttpService) {}

  async getExchangeRates(currency: string): Promise<Rate[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Rate[]>(`${this.baseUrl}/${currency}.json`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error?.response?.data);
          throw new RatesServiceUnavailableException();
        }),
      ),
    );
    return data;
  }
}

export default RatesService;
