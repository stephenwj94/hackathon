import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const quarterlyBudgets = {
  zendesk: [93.0, 93.5, 93.2, 93.8, 94.0, 94.2],
  seismic: [90.0, 90.5, 89.8, 90.2, 90.5, 91.0],
  mimecast: [95.0, 95.5, 95.2, 95.8, 95.5, 96.0],
  lytx: [88.0, 88.5, 87.5, 88.0, 88.5, 89.0],
  octus: [91.0, 91.5, 91.2, 91.8, 91.5, 92.0],
  mcafee: [94.0, 94.5, 94.2, 94.8, 94.5, 95.0],
};

function getQuarterIndex(monthStr) {
  const year = parseInt(monthStr.slice(0, 4));
  const month = parseInt(monthStr.slice(5));
  const base = year === 2023 ? 0 : 4;
  return base + Math.floor((month - 1) / 3);
}

function getQuarterLabel(idx) {
  const labels = ['Q1\'23', 'Q2\'23', 'Q3\'23', 'Q4\'23', 'Q1\'24', 'Q2\'24'];
  return labels[idx] || '';
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-permira-card border border-permira-border rounded-lg p-3 shadow-xl text-xs">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-permira-text-secondary">{p.name}:</span>
          <span className="font-mono font-medium">{p.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function RetentionChart({ data, companySlug, companyColor }) {
  const [showChurn, setShowChurn] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);

  const budgets = quarterlyBudgets[companySlug] || quarterlyBudgets.zendesk;

  const chartData = useMemo(() => {
    return data.map(d => {
      const qIdx = getQuarterIndex(d.month);
      return {
        month: d.month.slice(5),
        fullMonth: d.month,
        grossRetention: d.grossRetentionRate,
        churn: d.churnRate,
        downsell: d.downSellRate,
        quarterBudget: budgets[Math.min(qIdx, budgets.length - 1)],
      };
    });
  }, [data, budgets]);

  const yDomain = (showChurn || showDownsell) ? [0, 100] : [80, 100];

  const qtgInfo = useMemo(() => {
    if (!data.length) return null;
    const lastMonth = data[data.length - 1].month;
    const qIdx = getQuarterIndex(lastMonth);
    const target = budgets[Math.min(qIdx, budgets.length - 1)];

    const qMonths = data.filter(d => getQuarterIndex(d.month) === qIdx);
    const completedMonths = qMonths.length;
    const totalMonths = 3;
    const remaining = totalMonths - completedMonths;

    const sumGRR = qMonths.reduce((s, d) => s + d.grossRetentionRate, 0);
    const avgGRR = sumGRR / completedMonths;

    let impliedGRR;
    if (remaining > 0) {
      impliedGRR = ((target * totalMonths) - sumGRR) / remaining;
    } else {
      impliedGRR = avgGRR;
    }

    let color = 'text-permira-success';
    let bgColor = 'bg-permira-success/15';
    if (impliedGRR > avgGRR + 2) {
      color = 'text-permira-danger';
      bgColor = 'bg-permira-danger/15';
    } else if (impliedGRR > avgGRR) {
      color = 'text-amber-400';
      bgColor = 'bg-amber-400/15';
    }

    return { impliedGRR, color, bgColor, target, avgGRR, qLabel: getQuarterLabel(qIdx) };
  }, [data, budgets]);

  return (
    <div className="bg-permira-card border border-permira-border rounded-xl overflow-hidden">
      <div className="stripe-motif h-1" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em]">Gross Retention Over Time</h3>
          <div className="flex gap-3">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showChurn} onChange={(e) => setShowChurn(e.target.checked)}
                className="accent-red-400 w-3 h-3" />
              <span className="text-permira-text-secondary">Show Churn</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showDownsell} onChange={(e) => setShowDownsell(e.target.checked)}
                className="accent-yellow-400 w-3 h-3" />
              <span className="text-permira-text-secondary">Show Downsell</span>
            </label>
          </div>
        </div>

        {qtgInfo && (
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${qtgInfo.bgColor} ${qtgInfo.color}`}>
              Q-to-Go Implied GRR: {qtgInfo.impliedGRR.toFixed(1)}%
            </span>
            <span className="text-[10px] text-permira-text-secondary">
              {qtgInfo.qLabel} Target: {qtgInfo.target.toFixed(1)}%
            </span>
          </div>
        )}

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis domain={yDomain} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip content={<ChartTooltip />} />

              <Line type="stepAfter" dataKey="quarterBudget" name="Quarter Target"
                stroke="#F5620F" strokeWidth={1} strokeDasharray="6 3"
                strokeOpacity={0.5} dot={false} />

              <Line type="monotone" dataKey="grossRetention" name="YTD Gross Retention"
                stroke={companyColor || '#10B981'} strokeWidth={2} dot={false} />

              {showChurn && (
                <Line type="monotone" dataKey="churn" name="Churn Rate"
                  stroke="#EF4444" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              )}

              {showDownsell && (
                <Line type="monotone" dataKey="downsell" name="Downsell Rate"
                  stroke="#F59E0B" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
