import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { companies, getCompany } from '../data/companies';
import { benchmarks, metricCategories } from '../data/benchmarks';
import { usePortfolioData } from '../hooks/usePortfolioData';
import KPICard from '../components/cards/KPICard';
import BenchmarkChart from '../components/charts/BenchmarkChart';
import WaterfallChart from '../components/charts/WaterfallChart';
import RetentionHeatmap from '../components/charts/RetentionHeatmap';
import Badge from '../components/ui/Badge';

const trendSignals = {
  zendesk: [
    'Consistent ARR growth driven by strong gross retention above 93%. Steady expansion revenue indicates healthy land-and-expand motion.',
    'Sales capacity utilization improved in H2 2023, correlating with increased ramped AE count. Consider accelerating hiring to capture demand.',
    'NRR stabilized around 108%, suggesting room for upsell optimization — particularly in the enterprise segment.',
  ],
  seismic: [
    'High-growth trajectory with ARR nearly doubling. NRR volatility (112-118%) suggests expansion potential but requires churn monitoring.',
    'Aggressive new logo acquisition driving bookings growth, but sales capacity utilization indicates the team is still ramping — watch for productivity gains in H2 2024.',
    'Sales & marketing efficiency trending upward as S&M spend scales. CAC payback declining — positive unit economics trajectory.',
  ],
  mimecast: [
    'Mature profile with industry-leading gross retention (95-97%). Stable but low growth — opportunity to accelerate through product-led expansion.',
    'Low expansion rate constraining NRR to ~103%. Cross-sell and upsell initiatives should be prioritized to unlock value.',
    'High ACV and excellent retention create strong LTV/CAC ratios. Efficient but needs growth catalysts.',
  ],
  lytx: [
    'Hyper-growth phase with NRR consistently above 115% — strongest expansion metrics in the portfolio.',
    'Rapid AE headcount growth (doubling over 18 months) with improving capacity utilization. Unit economics improving as team ramps.',
    'Lower ACV offset by high logo velocity. Consider moving upmarket to improve LTV and reduce CAC payback period.',
  ],
  octus: [
    'Consistent mid-market compounding with S&M efficiency above 0.8 throughout. Best-in-class sales efficiency in the portfolio.',
    'Balanced growth between new logos and expansion. NRR ~111% indicates healthy platform stickiness and expansion motion.',
    'Revenue per AE strong and improving — evidence of operating leverage as the business scales.',
  ],
  mcafee: [
    'Large-scale enterprise with high ACV driving strong LTV. Gross retention 94-96% is solid for the security segment.',
    'Flat new logo growth typical for enterprise scale. NRR ~105% driven primarily by price increases and cross-sell.',
    'S&M spend efficiency could improve — S&M efficiency ratio below portfolio average, but absolute ARR contribution is the largest.',
  ],
};

export default function CompanyProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getCompanyData, getLatestMetrics } = usePortfolioData();

  const company = getCompany(slug) || companies[0];
  const data = getCompanyData(company.slug);
  const latest = getLatestMetrics(company.slug);
  const [selectedMetric, setSelectedMetric] = useState('arr');

  const topMetrics = useMemo(() => {
    if (!latest) return [];
    return [
      { label: 'ARR', value: latest.arr, prefix: '$', suffix: 'M', trend: latest.arrGrowthMoM },
      { label: 'NRR', value: latest.netRevenueRetention, suffix: '%', trend: null },
      { label: 'Gross Retention', value: latest.grossRetentionRate, suffix: '%', trend: null },
      { label: 'Sales & Marketing Efficiency', value: latest.magicNumber, decimals: 2, trend: null },
      { label: 'LTV/CAC', value: latest.ltvCacRatio, suffix: 'x', trend: null },
      { label: 'Total AEs', value: latest.totalAEs, decimals: 0, trend: null },
    ];
  }, [latest]);

  const allMetrics = Object.keys(metricCategories).flatMap(cat => metricCategories[cat]);

  return (
    <div>
      {/* Company selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {companies.map(c => (
          <button
            key={c.slug}
            onClick={() => navigate(`/company/${c.slug}`)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              c.slug === slug
                ? 'text-white'
                : 'bg-permira-card border border-permira-border text-permira-text-secondary hover:text-permira-text'
            }`}
            style={c.slug === slug ? { backgroundColor: c.color } : {}}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.slug === slug ? 'white' : c.color }} />
            {c.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slug}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="bg-permira-card border border-permira-border rounded-xl overflow-hidden mb-6">
            <div className="stripe-motif h-1.5" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold">{company.name}</h2>
                <Badge variant="default">{company.sector}</Badge>
                <Badge variant="orange">Vintage {company.vintage}</Badge>
              </div>
              {latest && (
                <div className="flex items-center gap-2 text-sm text-permira-text-secondary">
                  <span>Latest ARR:</span>
                  <span className="font-mono font-bold text-permira-text">${latest.arr}M</span>
                  <span className={latest.arrGrowthMoM >= 0 ? 'text-permira-success' : 'text-permira-danger'}>
                    {latest.arrGrowthMoM >= 0 ? '↑' : '↓'} {Math.abs(latest.arrGrowthMoM).toFixed(1)}% MoM
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            {topMetrics.map((m, i) => (
              <KPICard
                key={m.label}
                label={m.label}
                value={m.value}
                prefix={m.prefix}
                suffix={m.suffix}
                decimals={m.decimals ?? 1}
                trend={m.trend}
                delay={i * 0.05}
                color={company.color}
              />
            ))}
          </div>

          {/* Main chart with metric tabs */}
          <div className="bg-permira-card border border-permira-border rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-1 mb-4">
              {allMetrics.map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key)}
                  className={`px-2 py-1 rounded text-[11px] transition-all ${
                    selectedMetric === key
                      ? 'bg-permira-orange/15 text-permira-orange font-medium'
                      : 'text-permira-text-secondary hover:text-permira-text hover:bg-permira-card-hover'
                  }`}
                >
                  {benchmarks[key]?.label || key}
                </button>
              ))}
            </div>
            <BenchmarkChart singleCompany={company.slug} initialMetric={selectedMetric} />
          </div>

          {/* Secondary charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
            <WaterfallChart data={data} />
            <RetentionHeatmap data={data} />
          </div>

          {/* Trend Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-permira-card border border-permira-border rounded-xl overflow-hidden"
          >
            <div className="stripe-motif h-1" />
            <div className="p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
                <span className="text-permira-orange">◈</span> Trend Signals
              </h3>
              <div className="space-y-3">
                {(trendSignals[company.slug] || []).map((signal, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex gap-3 text-sm text-permira-text-secondary leading-relaxed"
                  >
                    <span className="text-permira-orange mt-0.5 shrink-0">▸</span>
                    {signal}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
