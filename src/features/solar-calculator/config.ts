import type { PanelType, PropertyType, RoofType } from "./types";

export const SOLAR_CONFIG = {
  performanceRatio: 0.78,
  targetOffset: 0.9,
  annualDegradation: 0.005,
  tariffEscalation: 0.05,
  annualMaintenanceRate: 0.01,
  inverterReplacementYear: 12,
  inverterReplacementCostPerKw: 7000,
  batteryReplacementYear: 11,
  gridEmissionKgPerKwh: 0.82,
  kgCo2PerTreePerYear: 21,
  exportTariff: 3.2,
  usableRoofRatio: 0.82,
  subsidy: {
    firstTwoKwRate: 30000,
    thirdKwRate: 18000,
    cap: 78000,
  },
  property: {
    residential: {
      tariff: 8.5,
      costPerKw: 62000,
      maxKw: 10,
      selfConsumption: 0.72,
    },
    commercial: {
      tariff: 10.5,
      costPerKw: 55500,
      maxKw: 100,
      selfConsumption: 0.88,
    },
    industrial: {
      tariff: 9.4,
      costPerKw: 51000,
      maxKw: 500,
      selfConsumption: 0.94,
    },
  } satisfies Record<PropertyType, {
    tariff: number;
    costPerKw: number;
    maxKw: number;
    selfConsumption: number;
  }>,
  panel: {
    "mono-perc": { wattage: 550, areaSqFt: 27, costMultiplier: 1 },
    topcon: { wattage: 585, areaSqFt: 27, costMultiplier: 1.08 },
    bifacial: { wattage: 600, areaSqFt: 29, costMultiplier: 1.14 },
  } satisfies Record<PanelType, {
    wattage: number;
    areaSqFt: number;
    costMultiplier: number;
  }>,
  roof: {
    rcc: { yieldMultiplier: 1, costMultiplier: 1 },
    metal: { yieldMultiplier: 0.98, costMultiplier: 0.94 },
    tile: { yieldMultiplier: 0.95, costMultiplier: 1.12 },
    ground: { yieldMultiplier: 1.04, costMultiplier: 1.16 },
  } satisfies Record<RoofType, {
    yieldMultiplier: number;
    costMultiplier: number;
  }>,
  battery: {
    capacityHours: 2,
    costPerKwh: 22000,
    roundTripEfficiency: 0.9,
    replacementCostRatio: 0.62,
  },
} as const;

export const LOCATION_CONFIG: Record<string, {
  peakSunHours: number;
  cities: Record<string, number>;
}> = {
  Maharashtra: {
    peakSunHours: 5.15,
    cities: {
      Poladpur: 5.2,
      Raigad: 5.15,
      Ratnagiri: 5.1,
      Thane: 4.95,
      Pune: 5.1,
      Satara: 5.2,
      Palghar: 5.0,
      Mumbai: 4.8,
      Sangli: 5.25,
    },
  },
};

export const MONTH_FACTORS = [
  0.92, 0.98, 1.08, 1.1, 1.05, 0.78, 0.72, 0.74, 0.88, 1.02, 1.06, 1.04,
];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const PROPERTY_LABELS: Record<PropertyType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
};

export const ROOF_LABELS: Record<RoofType, string> = {
  rcc: "RCC / Concrete",
  metal: "Metal Sheet",
  tile: "Tile Roof",
  ground: "Ground Mount",
};

export const PANEL_LABELS: Record<PanelType, string> = {
  "mono-perc": "Mono PERC 550W",
  topcon: "N-Type TOPCon 585W",
  bifacial: "Bifacial 600W",
};
