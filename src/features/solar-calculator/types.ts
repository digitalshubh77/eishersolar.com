export type PropertyType = "residential" | "commercial" | "industrial";
export type RoofType = "rcc" | "metal" | "tile" | "ground";
export type PanelType = "mono-perc" | "topcon" | "bifacial";
export type BatteryOption = "no" | "yes";

export interface CalculatorInputs {
  monthlyBill: number;
  monthlyUnits?: number;
  state: string;
  city: string;
  propertyType: PropertyType;
  roofLength?: number;
  roofWidth?: number;
  roofType: RoofType;
  panelType: PanelType;
  battery: BatteryOption;
}

export interface CashFlowPoint {
  year: number;
  generation: number;
  annualSavings: number;
  annualExpense: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export interface MonthlyPoint {
  month: string;
  generation: number;
  savings: number;
}

export interface SolarResult {
  systemSizeKw: number;
  panelCount: number;
  panelWattage: number;
  requiredRoofAreaSqFt: number;
  availableRoofAreaSqFt?: number;
  roofLimited: boolean;
  dailyGenerationKwh: number;
  monthlyGenerationKwh: number;
  annualGenerationKwh: number;
  grossCost: number;
  batteryCost: number;
  subsidy: number;
  netCost: number;
  monthlySavings: number;
  annualSavings: number;
  savings25Years: number;
  roiPercent: number;
  paybackYears: number;
  co2ReductionKgAnnual: number;
  treesEquivalent: number;
  offsetPercent: number;
  tariff: number;
  monthlyUnits: number;
  cashFlow: CashFlowPoint[];
  monthlyProfile: MonthlyPoint[];
}

export interface SystemComparison {
  sizeKw: number;
  panels: number;
  annualGeneration: number;
  grossCost: number;
  subsidy: number;
  netCost: number;
  annualSavings: number;
  paybackYears: number;
  recommended: boolean;
}

export interface ValidationErrors {
  monthlyBill?: string;
  monthlyUnits?: string;
  roofLength?: string;
  roofWidth?: string;
}
