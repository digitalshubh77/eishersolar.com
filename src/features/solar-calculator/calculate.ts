import { LOCATION_CONFIG, MONTH_FACTORS, MONTHS, SOLAR_CONFIG } from "./config";
import type { CalculatorInputs, SolarResult, SystemComparison, ValidationErrors } from "./types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export function calculateResidentialSubsidy(sizeKw: number, propertyType: CalculatorInputs["propertyType"]) {
  if (propertyType !== "residential" || sizeKw <= 0) return 0;
  const { firstTwoKwRate, thirdKwRate, cap } = SOLAR_CONFIG.subsidy;
  const firstTwo = Math.min(sizeKw, 2) * firstTwoKwRate;
  const third = Math.min(Math.max(sizeKw - 2, 0), 1) * thirdKwRate;
  return Math.min(cap, Math.round(firstTwo + third));
}

export function validateInputs(inputs: CalculatorInputs): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!Number.isFinite(inputs.monthlyBill) || inputs.monthlyBill < 500 || inputs.monthlyBill > 2_000_000) {
    errors.monthlyBill = "Enter a monthly bill between ₹500 and ₹20,00,000.";
  }
  if (inputs.monthlyUnits !== undefined && (inputs.monthlyUnits < 0 || inputs.monthlyUnits > 250_000)) {
    errors.monthlyUnits = "Monthly units must be between 0 and 2,50,000.";
  }
  if (inputs.roofLength !== undefined && (inputs.roofLength < 5 || inputs.roofLength > 2000)) {
    errors.roofLength = "Roof length must be between 5 and 2,000 ft.";
  }
  if (inputs.roofWidth !== undefined && (inputs.roofWidth < 5 || inputs.roofWidth > 2000)) {
    errors.roofWidth = "Roof width must be between 5 and 2,000 ft.";
  }
  return errors;
}

function getPeakSunHours(state: string, city: string) {
  const stateData = LOCATION_CONFIG[state] ?? LOCATION_CONFIG.Maharashtra;
  return stateData.cities[city] ?? stateData.peakSunHours;
}

function calculateAtSize(inputs: CalculatorInputs, requestedSizeKw?: number): SolarResult {
  const property = SOLAR_CONFIG.property[inputs.propertyType];
  const panel = SOLAR_CONFIG.panel[inputs.panelType];
  const roof = SOLAR_CONFIG.roof[inputs.roofType];
  const peakSunHours = getPeakSunHours(inputs.state, inputs.city);
  const monthlyUnits = inputs.monthlyUnits && inputs.monthlyUnits > 0
    ? inputs.monthlyUnits
    : inputs.monthlyBill / property.tariff;
  const generationPerKwMonth = peakSunHours * 30.42 * SOLAR_CONFIG.performanceRatio * roof.yieldMultiplier;
  const demandSize = (monthlyUnits * SOLAR_CONFIG.targetOffset) / generationPerKwMonth;
  const availableRoofArea = inputs.roofLength && inputs.roofWidth
    ? inputs.roofLength * inputs.roofWidth * SOLAR_CONFIG.usableRoofRatio
    : undefined;
  const maxRoofPanels = availableRoofArea ? Math.floor(availableRoofArea / panel.areaSqFt) : Number.POSITIVE_INFINITY;
  const maxRoofKw = Number.isFinite(maxRoofPanels) ? (maxRoofPanels * panel.wattage) / 1000 : Number.POSITIVE_INFINITY;
  const targetSize = requestedSizeKw ?? demandSize;
  const cappedSize = Math.min(targetSize, property.maxKw, maxRoofKw);
  const requestedPanels = Math.max(1, Math.ceil((Math.max(cappedSize, 0.5) * 1000) / panel.wattage));
  const panelCount = Number.isFinite(maxRoofPanels) ? Math.min(requestedPanels, Math.max(1, maxRoofPanels)) : requestedPanels;
  const systemSizeKw = round((panelCount * panel.wattage) / 1000, 2);
  const roofLimited = availableRoofArea !== undefined && maxRoofKw + 0.05 < targetSize;
  const requiredRoofAreaSqFt = Math.ceil(panelCount * panel.areaSqFt);

  const dailyGenerationKwh = systemSizeKw * peakSunHours * SOLAR_CONFIG.performanceRatio * roof.yieldMultiplier;
  const annualGenerationKwh = dailyGenerationKwh * 365;
  const monthlyGenerationKwh = annualGenerationKwh / 12;
  const batteryBoost = inputs.battery === "yes" ? 0.12 : 0;
  const selfConsumption = clamp(property.selfConsumption + batteryBoost, 0, 0.97);
  const effectiveSelfConsumed = selfConsumption * (inputs.battery === "yes" ? SOLAR_CONFIG.battery.roundTripEfficiency : 1);
  const firstYearEnergyValue =
    annualGenerationKwh * effectiveSelfConsumed * property.tariff +
    annualGenerationKwh * (1 - selfConsumption) * SOLAR_CONFIG.exportTariff;
  const annualSavings = Math.min(inputs.monthlyBill * 12 * 0.96, firstYearEnergyValue);
  const monthlySavings = annualSavings / 12;

  const baseSystemCost =
    systemSizeKw *
    property.costPerKw *
    panel.costMultiplier *
    roof.costMultiplier;
  const batteryCost = inputs.battery === "yes"
    ? systemSizeKw * SOLAR_CONFIG.battery.capacityHours * SOLAR_CONFIG.battery.costPerKwh
    : 0;
  const grossCost = Math.round(baseSystemCost + batteryCost);
  const subsidy = calculateResidentialSubsidy(systemSizeKw, inputs.propertyType);
  const netCost = Math.max(0, grossCost - subsidy);

  let cumulativeCashFlow = -netCost;
  let previousCumulative = cumulativeCashFlow;
  let paybackYears = 25;
  let paidBack = false;
  const cashFlow = Array.from({ length: 25 }, (_, index) => {
    const year = index + 1;
    const degradation = (1 - SOLAR_CONFIG.annualDegradation) ** index;
    const tariffGrowth = (1 + SOLAR_CONFIG.tariffEscalation) ** index;
    const generation = annualGenerationKwh * degradation;
    const yearlySaving = Math.min(
      inputs.monthlyBill * 12 * 0.96 * tariffGrowth,
      annualSavings * degradation * tariffGrowth,
    );
    let annualExpense = baseSystemCost * SOLAR_CONFIG.annualMaintenanceRate;
    if (year === SOLAR_CONFIG.inverterReplacementYear) {
      annualExpense += systemSizeKw * SOLAR_CONFIG.inverterReplacementCostPerKw;
    }
    if (inputs.battery === "yes" && year === SOLAR_CONFIG.batteryReplacementYear) {
      annualExpense += batteryCost * SOLAR_CONFIG.battery.replacementCostRatio;
    }
    const netCashFlow = yearlySaving - annualExpense;
    previousCumulative = cumulativeCashFlow;
    cumulativeCashFlow += netCashFlow;
    if (!paidBack && cumulativeCashFlow >= 0) {
      const fraction = netCashFlow > 0 ? Math.abs(previousCumulative) / netCashFlow : 0;
      paybackYears = round(index + fraction, 1);
      paidBack = true;
    }
    return {
      year,
      generation: Math.round(generation),
      annualSavings: Math.round(yearlySaving),
      annualExpense: Math.round(annualExpense),
      netCashFlow: Math.round(netCashFlow),
      cumulativeCashFlow: Math.round(cumulativeCashFlow),
    };
  });

  const factorAverage = MONTH_FACTORS.reduce((sum, factor) => sum + factor, 0) / MONTH_FACTORS.length;
  const monthlyProfile = MONTHS.map((month, index) => {
    const generation = monthlyGenerationKwh * (MONTH_FACTORS[index] / factorAverage);
    return {
      month,
      generation: Math.round(generation),
      savings: Math.round(monthlySavings * (MONTH_FACTORS[index] / factorAverage)),
    };
  });
  const savings25Years = Math.max(0, Math.round(cumulativeCashFlow));
  const roiPercent = netCost > 0 ? (savings25Years / netCost) * 100 : 0;

  return {
    systemSizeKw,
    panelCount,
    panelWattage: panel.wattage,
    requiredRoofAreaSqFt,
    availableRoofAreaSqFt: availableRoofArea ? Math.round(availableRoofArea) : undefined,
    roofLimited,
    dailyGenerationKwh: round(dailyGenerationKwh, 1),
    monthlyGenerationKwh: Math.round(monthlyGenerationKwh),
    annualGenerationKwh: Math.round(annualGenerationKwh),
    grossCost,
    batteryCost: Math.round(batteryCost),
    subsidy,
    netCost,
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(monthlySavings) * 12,
    savings25Years,
    roiPercent: round(roiPercent, 0),
    paybackYears,
    co2ReductionKgAnnual: Math.round(annualGenerationKwh * SOLAR_CONFIG.gridEmissionKgPerKwh),
    treesEquivalent: Math.round((annualGenerationKwh * SOLAR_CONFIG.gridEmissionKgPerKwh) / SOLAR_CONFIG.kgCo2PerTreePerYear),
    offsetPercent: round(clamp((monthlyGenerationKwh / monthlyUnits) * 100, 0, 100), 0),
    tariff: property.tariff,
    monthlyUnits: Math.round(monthlyUnits),
    cashFlow,
    monthlyProfile,
  };
}

export function calculateSolar(inputs: CalculatorInputs) {
  return calculateAtSize(inputs);
}

export function calculateComparisons(inputs: CalculatorInputs, recommendedKw: number): SystemComparison[] {
  const sizes = [3, 5, 8, 10];
  const closestSize = sizes.reduce((closest, size) =>
    Math.abs(size - recommendedKw) < Math.abs(closest - recommendedKw) ? size : closest
  );

  return sizes.map((sizeKw) => {
    const result = calculateAtSize({ ...inputs, roofLength: undefined, roofWidth: undefined }, sizeKw);
    return {
      sizeKw,
      panels: result.panelCount,
      annualGeneration: result.annualGenerationKwh,
      grossCost: result.grossCost,
      subsidy: result.subsidy,
      netCost: result.netCost,
      annualSavings: result.annualSavings,
      paybackYears: result.paybackYears,
      recommended: sizeKw === closestSize,
    };
  });
}
