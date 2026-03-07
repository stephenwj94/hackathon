import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { companies } from '../../data/companies';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const periods = ['YTD', 'Q1', 'Q2', 'Q3', 'Q4', 'Last FY', '2 Yrs Ago'];

const metricDefs = [
  { key: 'totalBookings', label: 'Bookings', unit: '$M', decimals: 1, format: (v) => `$${(v / 1000).toFixed(1)}M` },
  { key: 'grossRetentionRate', label: 'Gross Retention', unit: '%', decimals: 1, format: (v) => `${v.toFixed(1)}%` },
  { key: 'netRevenueRetention', label: 'Net Revenue Retention', unit: '%', decimals: 1, format: (v) => `${v.toFixed(1)}%` },
  { key: 'magicNumber', label: 'Sales & Marketing Efficiency', unit: '', decimals: 2, format: (v) => v.toFixed(2) },
  { key: 'salesCapacity', label: 'Sales Capacity', unit: '%', decimals: 0, format: (v) => `${Math.round(v)}%`, derive: (d) => d.totalAEs > 0 ? (d.rampedAEs / d.totalAEs * 100) : 0 },
  { key: 'pipelineCoverage', label: 'Pipeline Coverage', unit: 'x', decimals: 1, format: (v) => `${v.toFixed(1)}x` },
  { key: 'pipelineYoY', label: 'Pipeline YoY Growth', unit: '%', decimals: 0, format: (v) => `${v > 0 ? '+' : ''}${Math.round(v)}%` },
];

// Budget multipliers per company — some beat, some miss, some on track
const budgetMultipliers = {
  zendesk: { totalBookings: 1.02, grossRetentionRate: 1.00, netRevenueRetention: 0.99, magicNumber: 1.01, salesCapacity: 1.00, pipelineCoverage: 0.98, pipelineYoY: 1.03 },
  seismic: { totalBookings: 0.90, grossRetentionRate: 0.98, netRevenueRetention: 0.95, magicNumber: 0.92, salesCapacity: 0.96, pipelineCoverage: 0.88, pipelineYoY: 0.85 },
  mimecast: { totalBookings: 1.08, grossRetentionRate: 1.01, netRevenueRetention: 1.05, magicNumber: 1.12, salesCapacity: 1.03, pipelineCoverage: 1.10, pipelineYoY: 1.15 },
  lytx: { totalBookings: 0.88, grossRetentionRate: 0.97, netRevenueRetention: 0.93, magicNumber: 0.90, salesCapacity: 0.94, pipelineCoverage: 0.85, pipelineYoY: 0.82 },
  octus: { totalBookings: 1.03, grossRetentionRate: 1.01, netRevenueRetention: 1.02, magicNumber: 1.01, salesCapacity: 1.02, pipelineCoverage: 1.04, pipelineYoY: 0.98 },
  mcafee: { totalBookings: 1.10, grossRetentionRate: 1.02, netRevenueRetention: 1.06, magicNumber: 1.14, salesCapacity: 1.05, pipelineCoverage: 1.08, pipelineYoY: 1.12 },
};

function getDeltaColor(actual, budget) {
  if (budget === 0) return 'neutral';
  const pctDiff = ((actual - budget) / Math.abs(budget)) * 100;
  if (pctDiff >= 5) return 'green';
  if (pctDiff <= -5) return 'red';
  return 'yellow';
}

const colorClasses = {
  green: 'bg-permira-success/20 text-permira-success',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  red: 'bg-permira-danger/20 text-permira-danger',
  neutral: 'bg-permira-card text-permira-text-secondary',
};

export default function HealthMatrix() {
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  const { getLatestMetrics } = usePortfolioData();

  const matrixData = useMemo(() => {
    return companies.map(company => {
      const metrics = getLatestMetrics(company.slug);
      if (!metrics) return { company, cells: [] };

      const mults = budgetMultipliers[company.slug];
      const cells = metricDefs.map(def => {
        let actual;
        if (def.derive) {
          actual = def.derive(metrics);
        } else if (def.key === 'pipelineCoverage') {
          actual = 2.5 + (metrics.totalBookings / 1000) * 0.8 + (metrics.netRevenueRetention - 100) * 0.05;
        } else if (def.key === 'pipelineYoY') {
          actual = (metrics.netRevenueRetention - 100) * 1.8 + (metrics.arrGrowthMoM || 0) * 3;
        } else {
          actual = metrics[def.key] || 0;
        }

        const budget = actual * (mults[def.key] || 1);
        const delta = budget !== 0 ? ((actual - budget) / Math.abs(budget)) * 100 : 0;
        const health = getDeltaColor(actual, budget);

        return { actual, budget, delta, health, def };
      });

      return { company, cells };
    });
  }, [getLatestMetrics, selectedPeriod]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-permira-card border border-permira-border rounded-xl overflow-hidden"
    >
      <div className="stripe-motif h-1" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em]">Budget vs. Actual Performance</h3>
          <div className="flex gap-1 flex-wrap">
            {periods.map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-permira-orange text-white'
                    : 'bg-permira-dark/50 text-permira-text-secondary hover:text-permira-text hover:bg-permira-card-hover'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-permira-border">
                <th className="text-left py-2 pr-4 text-xs text-permira-text-secondary uppercase tracking-widest sticky left-0 bg-permira-card z-10">Company</th>
                {metricDefs.map(def => (
                  <th key={def.key} className="text-center px-2 py-2 text-[10px] text-permira-text-secondary uppercase tracking-widest whitespace-nowrap">
                    {def.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixData.map(({ company, cells }, ci) => (
                <tr key={company.slug} className="border-b border-permira-border/50">
                  <td className="py-2.5 pr-4 sticky left-0 bg-permira-card z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: company.color }} />
                      <span className="font-medium text-sm whitespace-nowrap">{company.name}</span>
                    </div>
                  </td>
                  {cells.map(({ actual, budget, delta, health, def }, mi) => (
                    <td key={def.key} className="text-center px-2 py-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + ci * 0.06 + mi * 0.03, duration: 0.3 }}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <span className="text-xs font-mono font-semibold text-permira-text">
                          {def.format(actual)}
                        </span>
                        <span className="text-[10px] font-mono text-permira-text-secondary">
                          Bgt: {def.format(budget)}
                        </span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${colorClasses[health]}`}>
                          {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                        </span>
                      </motion.div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
