"use client";

import {
  ArrowRight,
  BadgeIndianRupee,
  Calculator,
  Gauge,
  Info,
  MessageCircle,
  Sun,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const PERFORMANCE_RATIO = 0.78;

function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SolarCalculator() {
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [tariff, setTariff] = useState(9);
  const [sunHours, setSunHours] = useState(4.5);

  const estimate = useMemo(() => {
    const safeBill = Math.max(monthlyBill, 0);
    const safeTariff = Math.max(tariff, 1);
    const safeSunHours = Math.max(sunHours, 1);
    const monthlyUnits = safeBill / safeTariff;
    const rawCapacity = monthlyUnits / (30 * safeSunHours * PERFORMANCE_RATIO);
    const capacity = Math.min(Math.max(Math.ceil(rawCapacity), 3), 10);
    const annualGeneration = capacity * safeSunHours * 365 * PERFORMANCE_RATIO;
    const annualConsumption = monthlyUnits * 12;
    const usableUnits = Math.min(annualGeneration, annualConsumption);
    const annualSavings = usableUnits * safeTariff;
    const billOffset = annualConsumption
      ? Math.min((annualGeneration / annualConsumption) * 100, 100)
      : 0;

    return {
      monthlyUnits,
      capacity,
      annualGeneration,
      annualSavings,
      billOffset,
    };
  }, [monthlyBill, tariff, sunHours]);

  const whatsappMessage = encodeURIComponent(
    `Hello Eisher Industries, I used your solar calculator.\nMonthly bill: ${formatCurrency(monthlyBill)}\nSuggested capacity: ${estimate.capacity.toFixed(0)} kW\nPlease help me with a free site visit and accurate quotation.`,
  );

  return (
    <section className="solar-calculator-section section-pad" aria-labelledby="calculator-title">
      <div className="calculator-glow" aria-hidden="true" />
      <div className="section-shell">
        <motion.div
          className="calculator-heading"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="calculator-kicker"><Calculator /> Solar potential estimator</span>
            <h2 id="calculator-title">Turn your electricity bill<br /><em>into a solar plan.</em></h2>
          </div>
          <p>
            Get a quick, indicative estimate based on your current monthly bill.
            Adjust the assumptions to match your electricity connection.
          </p>
        </motion.div>

        <div className="calculator-shell">
          <motion.div
            className="calculator-controls"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            <div className="calculator-control-heading">
              <div><Gauge /><span>Your energy details</span></div>
              <small>STEP 01</small>
            </div>

            <label className="bill-control">
              <span>Average monthly electricity bill</span>
              <div className="bill-value">
                <small>₹</small>
                <input
                  type="number"
                  min="500"
                  max="1000000"
                  step="100"
                  value={monthlyBill}
                  onChange={(event) => setMonthlyBill(Number(event.target.value))}
                  aria-label="Average monthly electricity bill in rupees"
                />
              </div>
              <input
                className="calculator-range"
                type="range"
                min="500"
                max="50000"
                step="100"
                value={Math.min(monthlyBill, 50000)}
                onChange={(event) => setMonthlyBill(Number(event.target.value))}
                aria-label="Adjust monthly electricity bill"
              />
              <div className="range-labels"><span>₹500</span><span>₹50,000+</span></div>
            </label>

            <div className="calculator-small-inputs">
              <label>
                <span>Electricity rate</span>
                <div><BadgeIndianRupee /><input type="number" min="1" max="30" step="0.5" value={tariff} onChange={(event) => setTariff(Number(event.target.value))} /><small>/ unit</small></div>
              </label>
              <label>
                <span>Peak sun hours</span>
                <div><Sun /><input type="number" min="2" max="7" step="0.1" value={sunHours} onChange={(event) => setSunHours(Number(event.target.value))} /><small>hours</small></div>
              </label>
            </div>

            <div className="calculator-assumption">
              <Info />
              <p>Estimate uses a 78% performance ratio. Your roof, shade, sanctioned load and local conditions will affect the final system design.</p>
            </div>
          </motion.div>

          <motion.div
            className="calculator-results"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
            aria-live="polite"
          >
            <div className="result-topline">
              <span><span className="pulse-dot" /> Your indicative solar plan</span>
              <small>3–10 kW RANGE</small>
            </div>

            <div className="capacity-result">
              <small>Suggested system capacity</small>
              <strong>{estimate.capacity.toFixed(0)}<span>kW</span></strong>
              <div className="offset-meter">
                <i style={{ width: `${estimate.billOffset}%` }} />
              </div>
              <p>Potentially offsets up to <b>{Math.round(estimate.billOffset)}%</b> of the estimated annual units used.</p>
            </div>

            <div className="result-grid">
              <div>
                <span><Zap /></span>
                <small>Current consumption</small>
                <strong>{formatNumber(estimate.monthlyUnits)} <i>units/month</i></strong>
              </div>
              <div>
                <span><Sun /></span>
                <small>Estimated generation</small>
                <strong>{formatNumber(estimate.annualGeneration)} <i>units/year</i></strong>
              </div>
              <div className="savings-result">
                <span><BadgeIndianRupee /></span>
                <small>Potential annual bill offset</small>
                <strong>{formatCurrency(estimate.annualSavings)}</strong>
              </div>
            </div>

            <a
              className="calculator-cta"
              href={`https://wa.me/919422095082?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle />
              <span><small>Get an accurate proposal</small>Book a free site visit</span>
              <ArrowRight />
            </a>
            <p className="calculator-disclaimer">
              This calculator provides an indicative estimate, not a quotation.
              Final capacity and savings are confirmed after site assessment and bill analysis.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
