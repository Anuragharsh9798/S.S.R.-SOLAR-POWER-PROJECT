import { Injectable, BadRequestException } from '@nestjs/common';
import { CalculateSolarDto } from './dto/calculate-solar.dto';

export interface SolarCalculationResult {
  recommendedPlantSizeKw: number;
  panelSpecs: {
    wattageW: number;
    kwPerPanel: number;
    dimensionsFt: string;
    areaPerPanelSqFt: number;
    requiredPanels: number;
    requiredRoofAreaSqFt: number;
  };
  generation: {
    dailyKwh: number;
    monthlyKwh: number;
    annualKwh: number;
    lifetimeKwh25Yrs: number;
  };
  financials: {
    monthlySavingsRs: number;
    annualSavingsRs: number;
    lifetimeSavingsRs25Yrs: number;
    grossCostRs: number;
    centralSubsidyRs: number;
    stateSubsidyRs: number;
    totalSubsidyRs: number;
    netCostRs: number;
    paybackPeriodYears: number;
  };
  environmental: {
    co2ReductionTonnesPerYear: number;
    treesEquivalentPlanted: number;
  };
}

@Injectable()
export class CalculatorService {
  private readonly PANEL_WATTAGE_KW = 0.53; // 530W = 0.53 kW
  private readonly PANEL_DIMENSIONS_FT = '7.48 × 3.72 ft';
  private readonly PANEL_AREA_SQFT = 27.83; // 7.48 * 3.72 = 27.8256 ~= 27.83 sq.ft.
  private readonly BENCHMARK_COST_PER_KW = 55000; // Rs 55,000 per kW benchmark cost

  calculate(dto: CalculateSolarDto): SolarCalculationResult {
    let bill = dto.monthlyBillAmount;
    let units = dto.monthlyUnits;
    const rate = dto.electricityRate || 8.0;

    if (!bill && !units) {
      // Default fallback if neither bill nor units provided
      bill = 6000;
      units = Math.round(bill / rate);
    } else if (bill && !units) {
      units = Math.round(bill / rate);
    } else if (!bill && units) {
      bill = Math.round(units * rate);
    }

    if (units <= 0 || bill <= 0) {
      throw new BadRequestException('Monthly bill or consumption units must be greater than 0');
    }

    // 1. Calculate Recommended Plant Size (kW) based on 4.5 Peak Sun Hours/day
    const dailyKwhNeeded = units / 30;
    const rawPlantSizeKw = dailyKwhNeeded / 4.5;
    const recommendedPlantSizeKw = Math.max(1, Math.ceil(rawPlantSizeKw));

    // 2. Approved 530W Panel Sizing (User Specification)
    // Required Panels = CEILING(Plant Size / 0.53)
    const requiredPanels = Math.ceil(recommendedPlantSizeKw / this.PANEL_WATTAGE_KW);
    // Required Roof Area = Panels × 27.83 sq.ft.
    const requiredRoofAreaSqFt = Number((requiredPanels * this.PANEL_AREA_SQFT).toFixed(2));

    // 3. Generation Output Metrics
    const dailyGenerationKwh = Number((recommendedPlantSizeKw * 4.5).toFixed(2));
    const monthlyGenerationKwh = Math.round(dailyGenerationKwh * 30);
    const annualGenerationKwh = Math.round(monthlyGenerationKwh * 12);
    const lifetimeGenerationKwh = Math.round(annualGenerationKwh * 25);

    // 4. Financial Savings Calculation
    const monthlySavingsRs = Math.round(monthlyGenerationKwh * rate);
    const annualSavingsRs = Math.round(monthlySavingsRs * 12);
    const lifetimeSavingsRs = Math.round(annualSavingsRs * 25);

    // 5. Subsidy Structure (PM Surya Ghar Central + UP State)
    let centralSubsidyRs = 0;
    if (recommendedPlantSizeKw === 1) {
      centralSubsidyRs = 30000;
    } else if (recommendedPlantSizeKw === 2) {
      centralSubsidyRs = 60000;
    } else if (recommendedPlantSizeKw >= 3) {
      centralSubsidyRs = 78000;
    }

    // UP State Subsidy: Rs 15,000 per kW up to max Rs 30,000
    const stateSubsidyRs = Math.min(30000, recommendedPlantSizeKw * 15000);
    const totalSubsidyRs = centralSubsidyRs + stateSubsidyRs;

    // 6. Gross & Net Investment Cost
    const grossCostRs = recommendedPlantSizeKw * this.BENCHMARK_COST_PER_KW;
    const netCostRs = Math.max(0, grossCostRs - totalSubsidyRs);
    const paybackPeriodYears = Number((netCostRs / (annualSavingsRs || 1)).toFixed(1));

    // 7. Environmental Impact
    // 0.82 kg CO2 saved per kWh generated
    const co2ReductionTonnes = Number(((annualGenerationKwh * 0.82) / 1000).toFixed(2));
    const treesPlanted = Math.round(co2ReductionTonnes * 45); // ~45 trees per tonne of CO2

    return {
      recommendedPlantSizeKw,
      panelSpecs: {
        wattageW: 530,
        kwPerPanel: this.PANEL_WATTAGE_KW,
        dimensionsFt: this.PANEL_DIMENSIONS_FT,
        areaPerPanelSqFt: this.PANEL_AREA_SQFT,
        requiredPanels,
        requiredRoofAreaSqFt,
      },
      generation: {
        dailyKwh: dailyGenerationKwh,
        monthlyKwh: monthlyGenerationKwh,
        annualKwh: annualGenerationKwh,
        lifetimeKwh25Yrs: lifetimeGenerationKwh,
      },
      financials: {
        monthlySavingsRs,
        annualSavingsRs,
        lifetimeSavingsRs25Yrs: lifetimeSavingsRs,
        grossCostRs,
        centralSubsidyRs,
        stateSubsidyRs,
        totalSubsidyRs,
        netCostRs,
        paybackPeriodYears,
      },
      environmental: {
        co2ReductionTonnesPerYear: co2ReductionTonnes,
        treesEquivalentPlanted: treesPlanted,
      },
    };
  }
}
