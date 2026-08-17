import { Module } from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { CalculatorModule } from '../calculator/calculator.module';

@Module({
  imports: [CalculatorModule],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
