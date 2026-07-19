"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BatteryCharging,
  Building2,
  Calculator,
  CheckCircle2,
  Download,
  Factory,
  Home,
  Info,
  Leaf,
  Loader2,
  MapPin,
  MessageCircle,
  PanelsTopLeft,
  RotateCcw,
  Ruler,
  Sun,
  TrendingUp,
  WalletCards,
  Zap,
} from "lucide-react";
import { LOCATION_CONFIG, PANEL_LABELS, PROPERTY_LABELS, ROOF_LABELS } from "@/features/solar-calculator/config";
import { downloadSolarReport } from "@/features/solar-calculator/report";
import type { CalculatorInputs, PropertyType } from "@/features/solar-calculator/types";
import { useSolarCalculator } from "@/features/solar-calculator/useSolarCalculator";

const CalculatorCharts = dynamic(() => import("@/features/solar-calculator/CalculatorCharts"), {
  ssr: false,
  loading: () => <div className="eish-calc-card eish-calc-chart-loading" aria-label="Loading charts" />,
});

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const propertyIcons = { residential: Home, commercial: Building2, industrial: Factory };

function CircularProgress({
  value,
  label,
  display,
  tone = "lime",
}: {
  value: number;
  label: string;
  display: string;
  tone?: "lime" | "blue" | "orange";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`eish-calc-ring eish-calc-ring--${tone}`} style={{ "--ring": `${clamped * 3.6}deg` } as CSSProperties}>
      <div>
        <strong>{display}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function SolarCalculator({ compact = false }: { compact?: boolean }) {
  const { inputs, result, comparisons, errors, isValid, setInput, setProperty, reset } =
    useSolarCalculator("residential");
  const [downloading, setDownloading] = useState(false);

  const cities = Object.keys(LOCATION_CONFIG[inputs.state]?.cities ?? {});
  const billMax = inputs.propertyType === "residential" ? 100000 : inputs.propertyType === "commercial" ? 500000 : 2000000;
  const remainingMonthlyBill = Math.max(0, inputs.monthlyBill - result.monthlySavings);
  const monthlySavingPercent = Math.min(100, Math.round((result.monthlySavings / Math.max(inputs.monthlyBill, 1)) * 100));

  const recommendationMessage = useMemo(
    () =>
      `Hi Eisher Industries! I used your solar calculator for a ${PROPERTY_LABELS[inputs.propertyType].toLowerCase()} property in ${inputs.city}. My bill is ${currency(inputs.monthlyBill)}. Recommendation: ${result.systemSizeKw} kW, ${result.panelCount} panels, estimated saving ${currency(result.monthlySavings)}/month and ${result.paybackYears}-year payback. Please verify with a free site survey.`,
    [inputs, result],
  );

  const whatsappHref = `https://wa.me/919422095082?text=${encodeURIComponent(recommendationMessage)}`;

  const handleDownload = async () => {
    if (!isValid || downloading) return;
    setDownloading(true);
    try {
      await downloadSolarReport(inputs, result, comparisons);
    } finally {
      setDownloading(false);
    }
  };

  if (compact) {
    return (
      <section className="eish-calc-teaser section-pad" aria-labelledby="calc-teaser-title">
        <div className="section-shell eish-calc-teaser-inner">
          <div>
            <span className="calculator-kicker"><Calculator /> Solar calculator</span>
            <h2 id="calc-teaser-title">Know your solar size<br /><em>before the site visit.</em></h2>
            <p>Estimate capacity, subsidy, payback and 25-year savings with{" "}
              <span className="brand-name inline-brand">
                <span className="brand-eisher">EISHER</span>
                <span className="brand-industries">INDUSTRIES LLP</span>
              </span>
              ’s live solar planner.
            </p>
          </div>
          <Link href="/solar-calculator" className="magnetic-button primary">
            <span>Open calculator</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="eish-calc" aria-labelledby="calculator-workspace-title">
      <div className="eish-calc-intro section-shell">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="eish-calc-kicker"><Calculator size={14} /> Live solar intelligence</p>
          <h2 id="calculator-workspace-title">Turn your power bill into a <em>25-year asset</em></h2>
          <p>Size the system, estimate PM Surya Ghar subsidy, model savings and compare 3–10 kW options.</p>
        </motion.div>
        <div className="eish-calc-live"><i className="pulse-dot" /> Live calculation</div>
      </div>

      <div className="section-shell eish-calc-workspace">
        <aside className="eish-calc-inputs" aria-labelledby="calculator-inputs">
          <div className="eish-calc-card-head">
            <div>
              <p className="eish-calc-kicker">Project details</p>
              <h3 id="calculator-inputs">Build your solar plan</h3>
            </div>
            <button type="button" className="eish-calc-icon-btn" onClick={reset} aria-label="Reset calculator">
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="eish-calc-field">
            <div className="eish-calc-label-row">
              <label htmlFor="monthly-bill">Monthly electricity bill</label>
              <strong>{currency(inputs.monthlyBill)}</strong>
            </div>
            <input
              id="monthly-bill"
              className="eish-calc-range"
              type="range"
              min={500}
              max={billMax}
              step={inputs.propertyType === "industrial" ? 5000 : inputs.propertyType === "commercial" ? 1000 : 500}
              value={Math.min(inputs.monthlyBill, billMax)}
              onChange={(event) => setInput("monthlyBill", Number(event.target.value))}
              aria-label="Monthly electricity bill"
            />
            <div className="eish-calc-range-labels"><span>₹500</span><span>{currency(billMax)}</span></div>
            {errors.monthlyBill ? <p className="eish-calc-error">{errors.monthlyBill}</p> : null}
          </div>

          <label className="eish-calc-input">
            <span>Monthly units (optional)</span>
            <div>
              <input
                type="number"
                inputMode="decimal"
                value={inputs.monthlyUnits ?? ""}
                placeholder={`Estimated: ${result.monthlyUnits}`}
                onChange={(event) =>
                  setInput("monthlyUnits", event.target.value === "" ? undefined : Number(event.target.value))
                }
              />
              <small>kWh</small>
            </div>
            {errors.monthlyUnits ? <em>{errors.monthlyUnits}</em> : null}
          </label>

          <fieldset className="eish-calc-fieldset">
            <legend>Property type</legend>
            <div className="eish-calc-property">
              {(Object.keys(PROPERTY_LABELS) as PropertyType[]).map((type) => {
                const Icon = propertyIcons[type];
                return (
                  <button
                    key={type}
                    type="button"
                    className={inputs.propertyType === type ? "is-active" : ""}
                    onClick={() => setProperty(type)}
                    aria-pressed={inputs.propertyType === type}
                  >
                    <Icon size={18} />
                    <span>{PROPERTY_LABELS[type]}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="eish-calc-two">
            <label className="eish-calc-input">
              <span><MapPin size={14} /> State</span>
              <select
                value={inputs.state}
                onChange={(event) => {
                  const state = event.target.value;
                  setInput("state", state);
                  setInput("city", Object.keys(LOCATION_CONFIG[state].cities)[0]);
                }}
              >
                {Object.keys(LOCATION_CONFIG).map((state) => <option key={state}>{state}</option>)}
              </select>
            </label>
            <label className="eish-calc-input">
              <span>City / area</span>
              <select value={inputs.city} onChange={(event) => setInput("city", event.target.value)}>
                {cities.map((city) => <option key={city}>{city}</option>)}
              </select>
            </label>
          </div>

          <div className="eish-calc-two">
            <label className="eish-calc-input">
              <span>Roof length</span>
              <div>
                <input
                  type="number"
                  value={inputs.roofLength ?? ""}
                  placeholder="e.g. 40"
                  onChange={(event) =>
                    setInput("roofLength", event.target.value === "" ? undefined : Number(event.target.value))
                  }
                />
                <small>ft</small>
              </div>
            </label>
            <label className="eish-calc-input">
              <span>Roof width</span>
              <div>
                <input
                  type="number"
                  value={inputs.roofWidth ?? ""}
                  placeholder="e.g. 30"
                  onChange={(event) =>
                    setInput("roofWidth", event.target.value === "" ? undefined : Number(event.target.value))
                  }
                />
                <small>ft</small>
              </div>
            </label>
          </div>

          <label className="eish-calc-input">
            <span><Ruler size={14} /> Roof type</span>
            <select
              value={inputs.roofType}
              onChange={(event) => setInput("roofType", event.target.value as CalculatorInputs["roofType"])}
            >
              {Object.entries(ROOF_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="eish-calc-input">
            <span><PanelsTopLeft size={14} /> Panel technology</span>
            <select
              value={inputs.panelType}
              onChange={(event) => setInput("panelType", event.target.value as CalculatorInputs["panelType"])}
            >
              {Object.entries(PANEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <fieldset className="eish-calc-fieldset">
            <legend><BatteryCharging size={14} /> Battery storage</legend>
            <div className="eish-calc-binary">
              <button type="button" className={inputs.battery === "no" ? "is-active" : ""} onClick={() => setInput("battery", "no")}>No battery</button>
              <button type="button" className={inputs.battery === "yes" ? "is-active" : ""} onClick={() => setInput("battery", "yes")}>Add battery</button>
            </div>
          </fieldset>
        </aside>

        <div className="eish-calc-results" aria-live="polite">
          <motion.section className="eish-calc-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="eish-calc-card-head">
              <div>
                <p className="eish-calc-kicker">Recommended configuration</p>
                <h3>{PROPERTY_LABELS[inputs.propertyType]} solar system</h3>
              </div>
              <span className="eish-calc-badge"><CheckCircle2 size={14} /> Best fit</span>
            </div>
            <div className="eish-calc-recommend">
              <div className="eish-calc-size">
                <span>System size</span>
                <strong>{result.systemSizeKw.toFixed(2)} <small>kW</small></strong>
                <p>{result.panelCount} × {result.panelWattage}W panels</p>
              </div>
              <CircularProgress value={result.offsetPercent} display={`${result.offsetPercent}%`} label="Bill offset" />
              <CircularProgress value={Math.min(result.roiPercent / 8, 100)} display={`${result.roiPercent}%`} label="25Y ROI" tone="blue" />
              <CircularProgress value={Math.max(0, 100 - result.paybackYears * 10)} display={`${result.paybackYears} yr`} label="Payback" tone="orange" />
            </div>
            {result.roofLimited ? (
              <div className="eish-calc-warning">Your entered roof area limits the recommended system. A site survey can optimize the layout.</div>
            ) : null}
          </motion.section>

          <section className="eish-calc-card">
            <div className="eish-calc-card-head">
              <div>
                <p className="eish-calc-kicker">Bill comparison</p>
                <h3>Before vs after solar</h3>
              </div>
              <span className="eish-calc-badge is-soft">{monthlySavingPercent}% lower</span>
            </div>
            <div className="eish-calc-bill-grid">
              <div>
                <span>Current bill</span>
                <strong>{currency(inputs.monthlyBill)}/mo</strong>
                <div className="eish-calc-track"><i style={{ width: "100%" }} /></div>
              </div>
              <div className="is-after">
                <span>Estimated after solar</span>
                <strong>{currency(remainingMonthlyBill)}/mo</strong>
                <div className="eish-calc-track">
                  <i className="after" style={{ width: `${Math.max(3, 100 - monthlySavingPercent)}%` }} />
                </div>
              </div>
              <div className="eish-calc-save-chip">
                <TrendingUp size={18} />
                <div>
                  <span>You save</span>
                  <strong>{currency(result.monthlySavings)}/month</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="eish-calc-metrics" aria-label="Solar estimate results">
            {[
              { label: "Panels", value: result.panelCount.toLocaleString("en-IN"), sub: `${result.panelWattage}W each`, icon: PanelsTopLeft },
              { label: "Roof area", value: `${result.requiredRoofAreaSqFt.toLocaleString("en-IN")} ft²`, sub: "Required usable area", icon: Ruler },
              { label: "Daily generation", value: `${result.dailyGenerationKwh} kWh`, sub: "Location adjusted", icon: Sun },
              { label: "Annual generation", value: `${result.annualGenerationKwh.toLocaleString("en-IN")} kWh`, sub: `${result.monthlyGenerationKwh.toLocaleString("en-IN")} kWh/month`, icon: Zap },
              { label: "System cost", value: currency(result.grossCost), sub: result.batteryCost ? `Includes ${currency(result.batteryCost)} battery` : "Before subsidy", icon: WalletCards },
              { label: "Subsidy", value: currency(result.subsidy), sub: inputs.propertyType === "residential" ? "PM Surya Ghar estimate" : "Not applicable", icon: CheckCircle2 },
              { label: "Net cost", value: currency(result.netCost), sub: "After eligible subsidy", icon: Calculator },
              { label: "Monthly savings", value: currency(result.monthlySavings), sub: `${currency(result.annualSavings)}/year`, icon: TrendingUp },
              { label: "25-year savings", value: currency(result.savings25Years), sub: "After modelled expenses", icon: WalletCards },
              { label: "CO₂ reduction", value: `${result.co2ReductionKgAnnual.toLocaleString("en-IN")} kg`, sub: "Avoided every year", icon: Leaf },
              { label: "Trees equivalent", value: result.treesEquivalent.toLocaleString("en-IN"), sub: "CO₂ absorption / year", icon: Leaf },
              { label: "Consumption", value: `${result.monthlyUnits.toLocaleString("en-IN")} units`, sub: `Tariff: ${currency(result.tariff)}/unit`, icon: Zap },
            ].map((metric) => (
              <article key={metric.label} className="eish-calc-metric">
                <metric.icon size={17} />
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.sub}</small>
              </article>
            ))}
          </section>
        </div>
      </div>

      <div className="section-shell eish-calc-lower">
        <div className="eish-calc-split">
          <CalculatorCharts result={result} />

          <section className="eish-calc-card eish-calc-compare">
            <div className="eish-calc-card-head">
              <div>
                <p className="eish-calc-kicker">Compare capacity</p>
                <h3>3, 5, 8 and 10 kW systems</h3>
              </div>
            </div>
            <div className="eish-calc-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>System</th>
                    <th>Panels</th>
                    <th>Annual generation</th>
                    <th>Net cost</th>
                    <th>Annual savings</th>
                    <th>Payback</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item) => (
                    <tr key={item.sizeKw} className={item.recommended ? "is-recommended" : ""}>
                      <th>{item.sizeKw} kW {item.recommended ? <span>Closest fit</span> : null}</th>
                      <td>{item.panels}</td>
                      <td>{item.annualGeneration.toLocaleString("en-IN")} kWh</td>
                      <td>{currency(item.netCost)}</td>
                      <td>{currency(item.annualSavings)}</td>
                      <td>{item.paybackYears} yr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="eish-calc-cta">
          <div>
            <p className="eish-calc-kicker">Next step</p>
            <h3>Save this estimate or let our engineer verify it.</h3>
            <p>Final pricing and generation are confirmed after a free shade and roof assessment.</p>
          </div>
          <div className="eish-calc-cta-actions">
            <button type="button" className="magnetic-button primary" onClick={handleDownload} disabled={!isValid || downloading}>
              {downloading ? <Loader2 className="eish-spin" size={16} /> : <Download size={16} />}
              <span>Download PDF</span>
            </button>
            <Link href="/contact" className="magnetic-button secondary">Get free quote <ArrowRight size={16} /></Link>
            <a className="magnetic-button secondary" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> WhatsApp expert
            </a>
          </div>
        </section>

        <p className="eish-calc-disclaimer">
          <Info size={15} />
          <span>
            <strong>Transparent assumptions:</strong> Results use location irradiation, selected equipment, property tariff,
            0.5% annual panel degradation, 5% tariff escalation and standard O&amp;M. This is an indicative model—not a final engineering proposal.
            Subsidy applies to eligible residential consumers only, as per prevailing government scheme rules.
          </span>
        </p>
      </div>
    </section>
  );
}
