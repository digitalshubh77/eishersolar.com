"use client";

import { useCallback, useMemo, useReducer } from "react";
import { calculateComparisons, calculateSolar, validateInputs } from "./calculate";
import type { CalculatorInputs } from "./types";

const DEFAULT_INPUTS: CalculatorInputs = {
  monthlyBill: 3000,
  state: "Maharashtra",
  city: "Poladpur",
  propertyType: "residential",
  roofType: "rcc",
  panelType: "topcon",
  battery: "no",
};

type Action =
  | { type: "set"; key: keyof CalculatorInputs; value: CalculatorInputs[keyof CalculatorInputs] }
  | { type: "property"; value: CalculatorInputs["propertyType"] }
  | { type: "reset" };

function reducer(state: CalculatorInputs, action: Action): CalculatorInputs {
  if (action.type === "reset") return DEFAULT_INPUTS;
  if (action.type === "property") {
    const defaultBill = action.value === "residential" ? 3000 : action.value === "commercial" ? 25000 : 100000;
    return { ...state, propertyType: action.value, monthlyBill: defaultBill, monthlyUnits: undefined };
  }
  return { ...state, [action.key]: action.value };
}

export function useSolarCalculator(initialProperty?: CalculatorInputs["propertyType"]) {
  const [inputs, dispatch] = useReducer(reducer, {
    ...DEFAULT_INPUTS,
    propertyType: initialProperty ?? DEFAULT_INPUTS.propertyType,
    monthlyBill: initialProperty === "commercial" ? 25000 : initialProperty === "industrial" ? 100000 : 3000,
  });

  const result = useMemo(() => calculateSolar(inputs), [inputs]);
  const comparisons = useMemo(
    () => calculateComparisons(inputs, result.systemSizeKw),
    [inputs, result.systemSizeKw],
  );
  const errors = useMemo(() => validateInputs(inputs), [inputs]);
  const isValid = Object.keys(errors).length === 0;

  const setInput = useCallback(
    <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
      dispatch({ type: "set", key, value });
    },
    [],
  );

  const setProperty = useCallback((value: CalculatorInputs["propertyType"]) => {
    dispatch({ type: "property", value });
  }, []);

  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return { inputs, result, comparisons, errors, isValid, setInput, setProperty, reset };
}
