import { ServiceUnavailableException } from '@nestjs/common';

export class RatesServiceUnavailableException extends ServiceUnavailableException {
  constructor() {
    super(
      `The Rates service is currently unavailable. Please try again later.`,
    );
  }
}

export default RatesServiceUnavailableException;
