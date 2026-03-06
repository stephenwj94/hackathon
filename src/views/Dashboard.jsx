import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { companies } from '../data/companies';
import { usePortfolioData } from '../hooks/usePortfolioData';
import CompanyCard from '../components/cards/CompanyCard';
import HealthMatrix from '../components/cards/HealthMatrix';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-tooltip rounded-lg p-3">
      <div className="text-xs text-permira-text-secondary mb-1 font-mono">{label}</div>
      {payload.map(entry => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs capitalize">{entry.dataKey}</span>
          </div>
          <span className="text-xs font-mono">{typeof entry.value === 'number' ? entry.value.toFixed(1) : '—'}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { getAllLatest, getMetricTimeSeries } = usePortfolioData();
  const companiesWithMetrics = getAllLatest();
  const arrData = getMetricTimeSeries('arr');
  const nrrData = useMemo(() => {
    return getMetricTimeSeries('netRevenueRetention').slice(-6);
  }, [getMetricTimeSeries]);

  return (
    <div className="space-y-6">
      {/* KPI Summary Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 className="text-xs uppercase tracking-[0.1em] text-permira-text-secondary mb-3">Portfolio Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {companiesWithMetrics.map((c, i) => (
            <CompanyCard key={c.slug} company={c} metrics={c.metrics} delay={0.3 + i * 0.05} />
          ))}
        </div>
      </motion.div>

      {/* Health Matrix */}
      <HealthMatrix />

      {/* Charts row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-4"
      >
        {/* ARR Trend */}
        <div className="bg-permira-card border border-permira-border rounded-xl p-4">
          <h4 className="text-sm font-bold mb-3">ARR Trend (18 Months)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={arrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="month"
                stroke="#4B5563"
                tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => v.replace('20', "'")}
              />
              <YAxis stroke="#4B5563" tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip content={<ChartTooltip />} />
              {companies.map((c, i) => (
                <Line
                  key={c.slug}
                  type="monotone"
                  dataKey={c.slug}
                  stroke={c.color}
                  strokeWidth={2}
                  dot={false}
                  animationBegin={i * 100}
                  animationDuration={1000}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NRR Comparison */}
        <div className="bg-permira-card border border-permira-border rounded-xl p-4">
          <h4 className="text-sm font-bold mb-3">NRR Comparison (Last 6 Months)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nrrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="month"
                stroke="#4B5563"
                tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => v.replace('20', "'")}
              />
              <YAxis
                stroke="#4B5563"
                tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                domain={[95, 125]}
              />
              <Tooltip content={<ChartTooltip />} />
              {companies.map((c, i) => (
                <Bar
                  key={c.slug}
                  dataKey={c.slug}
                  fill={c.color}
                  animationBegin={i * 80}
                  animationDuration={800}
                  radius={[3, 3, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
