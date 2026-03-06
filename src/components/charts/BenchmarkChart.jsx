import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ReferenceArea,
} from 'recharts';
import { companies } from '../../data/companies';
import { benchmarks, metricCategories } from '../../data/benchmarks';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import Modal from '../ui/Modal';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-tooltip rounded-lg p-3 min-w-[200px]"
    >
      <div className="text-xs text-permira-text-secondary mb-2 font-mono">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs capitalize">{entry.dataKey}</span>
          </div>
          <span className="text-xs font-mono font-medium">
            {typeof entry.value === 'number' ? entry.value.toFixed(1) : '—'}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export default function BenchmarkChart({ singleCompany, initialMetric = 'arr' }) {
  const [selectedMetric, setSelectedMetric] = useState(initialMetric);
  const [visibleCompanies, setVisibleCompanies] = useState(
    Object.fromEntries(companies.map(c => [c.slug, true]))
  );
  const [zoomStart, setZoomStart] = useState(null);
  const [zoomEnd, setZoomEnd] = useState(null);
  const [zoomArea, setZoomArea] = useState(null);
  const [deepDive, setDeepDive] = useState(null);
  const { getMetricTimeSeries, getCompanyData } = usePortfolioData();

  const chartData = useMemo(() => {
    const series = getMetricTimeSeries(selectedMetric);
    if (zoomArea) {
      return series.slice(zoomArea[0], zoomArea[1] + 1);
    }
    return series;
  }, [selectedMetric, getMetricTimeSeries, zoomArea]);

  const toggleCompany = (slug) => {
    setVisibleCompanies(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleChartClick = (data) => {
    if (!data?.activePayload?.[0]) return;
    const month = data.activeLabel;
    if (singleCompany) {
      const companyData = getCompanyData(singleCompany);
      const snapshot = companyData.find(d => d.month === month);
      if (snapshot) setDeepDive({ company: singleCompany, month, data: snapshot });
    }
  };

  const handleMouseDown = (e) => {
    if (e?.activeLabel) setZoomStart(e.activeLabel);
  };
  const handleMouseMove = (e) => {
    if (zoomStart && e?.activeLabel) setZoomEnd(e.activeLabel);
  };
  const handleMouseUp = () => {
    if (zoomStart && zoomEnd) {
      const allMonths = getMetricTimeSeries(selectedMetric).map(d => d.month);
      const startIdx = allMonths.indexOf(zoomStart);
      const endIdx = allMonths.indexOf(zoomEnd);
      if (startIdx >= 0 && endIdx >= 0 && startIdx !== endIdx) {
        setZoomArea([Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)]);
      }
    }
    setZoomStart(null);
    setZoomEnd(null);
  };

  const resetZoom = () => setZoomArea(null);

  const benchmark = benchmarks[selectedMetric];
  const displayCompanies = singleCompany
    ? companies.filter(c => c.slug === singleCompany)
    : companies.filter(c => visibleCompanies[c.slug]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Metric selector sidebar */}
      {!singleCompany && (
        <div className="lg:w-56 shrink-0 space-y-4">
          {Object.entries(metricCategories).map(([category, metrics]) => (
            <div key={category}>
              <div className="text-[10px] uppercase tracking-[0.1em] text-permira-text-secondary mb-1.5 font-semibold">
                {category}
              </div>
              <div className="space-y-0.5">
                {metrics.map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key)}
                    className={`block w-full text-left px-3 py-1.5 rounded-md text-xs transition-all ${
                      selectedMetric === key
                        ? 'bg-permira-orange/15 text-permira-orange font-medium'
                        : 'text-permira-text-secondary hover:text-permira-text hover:bg-permira-card-hover'
                    }`}
                  >
                    {benchmarks[key].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold">{benchmark?.label || selectedMetric}</h3>
            {benchmark?.unit && (
              <span className="text-xs text-permira-text-secondary">Unit: {benchmark.unit}</span>
            )}
          </div>
          {zoomArea && (
            <button
              onClick={resetZoom}
              className="text-xs text-permira-orange hover:underline"
            >
              Reset Zoom
            </button>
          )}
        </div>

        <div className="bg-permira-card border border-permira-border rounded-xl p-4">
          <ResponsiveContainer width="100%" height={380}>
            <LineChart
              data={chartData}
              onClick={handleChartClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="month"
                stroke="#4B5563"
                tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(v) => {
                  const [y, m] = v.split('-');
                  return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m)-1]} '${y.slice(2)}`;
                }}
              />
              <YAxis
                stroke="#4B5563"
                tick={{ fill: '#9CA3AF', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Best-in-class reference lines */}
              {benchmark?.bestInClass && (
                <ReferenceLine
                  y={benchmark.bestInClass}
                  stroke="#F5620F"
                  strokeDasharray="6 4"
                  label={{ value: `Best-in-class: ${benchmark.bestInClass}${benchmark.unit}`, position: 'right', fill: '#F5620F', fontSize: 10 }}
                />
              )}

              {/* Zoom selection area */}
              {zoomStart && zoomEnd && (
                <ReferenceArea x1={zoomStart} x2={zoomEnd} strokeOpacity={0.3} fill="#F5620F" fillOpacity={0.1} />
              )}

              {displayCompanies.map((company, i) => (
                <Line
                  key={company.slug}
                  type="monotone"
                  dataKey={company.slug}
                  stroke={company.color}
                  strokeWidth={singleCompany ? 3 : 2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, fill: company.color }}
                  opacity={singleCompany ? 1 : 0.9}
                  animationBegin={i * 100}
                  animationDuration={1000}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* Custom legend */}
          {!singleCompany && (
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-permira-border">
              {companies.map(company => (
                <button
                  key={company.slug}
                  onClick={() => toggleCompany(company.slug)}
                  className={`flex items-center gap-1.5 text-xs transition-all ${
                    visibleCompanies[company.slug] ? 'text-permira-text' : 'text-permira-text-secondary/40'
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-opacity"
                    style={{
                      backgroundColor: company.color,
                      opacity: visibleCompanies[company.slug] ? 1 : 0.3,
                    }}
                  />
                  {company.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deep dive modal */}
      <Modal
        isOpen={!!deepDive}
        onClose={() => setDeepDive(null)}
        title={deepDive ? `${deepDive.company} — ${deepDive.month}` : ''}
      >
        {deepDive && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(deepDive.data).filter(([k]) => k !== 'month').map(([key, val]) => (
              <div key={key} className="bg-permira-dark/50 rounded-lg p-3">
                <div className="text-[10px] text-permira-text-secondary uppercase tracking-widest">
                  {benchmarks[key]?.label || key}
                </div>
                <div className="text-sm font-mono font-semibold mt-0.5">
                  {val !== null && val !== undefined ? (typeof val === 'number' ? val.toFixed(1) : val) : '—'}
                  {benchmarks[key]?.unit === '%' ? '%' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
