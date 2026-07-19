"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SolarResult } from "./types";

type ChartKey = "generation" | "savings" | "roi" | "cashflow";

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const compactNumber = (value: number) => {
  const absolute = Math.abs(value);
  if (absolute >= 10_000_000) return `${(value / 10_000_000).toFixed(1)}Cr`;
  if (absolute >= 100_000) return `${(value / 100_000).toFixed(1)}L`;
  if (absolute >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(Math.round(value));
};

export default function CalculatorCharts({ result }: { result: SolarResult }) {
  const [active, setActive] = useState<ChartKey>("generation");
  const chartTitles: Record<ChartKey, { title: string; description: string }> = {
    generation: {
      title: "Monthly solar generation",
      description: "Season-adjusted energy output across a typical year",
    },
    savings: {
      title: "Monthly electricity savings",
      description: "Estimated bill reduction from generated solar energy",
    },
    roi: {
      title: "25-year net ROI growth",
      description: "Return after system cost, maintenance and replacements",
    },
    cashflow: {
      title: "25-year cumulative cash flow",
      description: "Initial investment, payback crossover and lifetime value",
    },
  };
  const roiData = result.cashFlow.map((point) => ({
    year: `Y${point.year}`,
    roi: Math.round((point.cumulativeCashFlow / Math.max(result.netCost, 1)) * 100),
  }));

  return (
    <section className="eish-calc-card eish-calc-charts" aria-labelledby="charts-title">
      <div className="eish-calc-card-head">
        <div>
          <p className="eish-calc-kicker">Performance analytics</p>
          <h3 id="charts-title">{chartTitles[active].title}</h3>
          <p className="eish-calc-muted">{chartTitles[active].description}</p>
        </div>
        <div className="eish-calc-tabs" role="tablist" aria-label="Chart type">
          {([
            ["generation", "Generation"],
            ["savings", "Savings"],
            ["roi", "ROI"],
            ["cashflow", "Cash flow"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active === key}
              className={active === key ? "is-active" : ""}
              onClick={() => setActive(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="eish-calc-chart-stage" role="tabpanel">
        <ResponsiveContainer width="100%" height={280} minWidth={0} debounce={50}>
          {active === "generation" ? (
            <BarChart data={result.monthlyProfile} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="rgba(255,255,255,.4)" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="rgba(255,255,255,.4)" tickFormatter={compactNumber} />
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString("en-IN")} kWh`, "Generation"]} />
              <Bar dataKey="generation" fill="#b9ff4f" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : active === "savings" ? (
            <AreaChart data={result.monthlyProfile} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="rgba(255,255,255,.4)" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="rgba(255,255,255,.4)" tickFormatter={compactNumber} />
              <Tooltip formatter={(value) => [currency(Number(value)), "Savings"]} />
              <Area type="monotone" dataKey="savings" stroke="#54a8ff" fill="rgba(84,168,255,.25)" />
            </AreaChart>
          ) : active === "roi" ? (
            <LineChart data={roiData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={11} stroke="rgba(255,255,255,.4)" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="rgba(255,255,255,.4)" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => [`${value}%`, "ROI"]} />
              <Line type="monotone" dataKey="roi" stroke="#b9ff4f" strokeWidth={2.5} dot={false} />
            </LineChart>
          ) : (
            <AreaChart data={result.cashFlow} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={11} stroke="rgba(255,255,255,.4)" />
              <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="rgba(255,255,255,.4)" tickFormatter={compactNumber} />
              <Tooltip formatter={(value) => [currency(Number(value)), "Cash flow"]} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,.25)" />
              <Area type="monotone" dataKey="cumulativeCashFlow" stroke="#36d56d" fill="rgba(54,213,109,.2)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
