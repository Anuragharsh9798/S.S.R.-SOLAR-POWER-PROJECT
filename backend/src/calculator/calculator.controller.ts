import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CalculateSolarDto } from './dto/calculate-solar.dto';

@Controller('api/v1/calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  calculate(@Body() dto: CalculateSolarDto) {
    return {
      status: 'success',
      data: this.calculatorService.calculate(dto),
    };
  }
}
