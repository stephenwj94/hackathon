import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const annualBudgets = {
  zendesk: 24000,
  seismic: 26000,
  mimecast: 16000,
  lytx: 18000,
  octus: 13000,
  mcafee: 32000,
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-permira-card border border-permira-border rounded-lg p-3 shadow-xl text-xs">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-permira-text-secondary">{p.name}:</span>
          <span className="font-mono font-medium">${p.value?.toLocaleString()}K</span>
        </div>
      ))}
    </div>
  );
}

export default function BookingsChart({ data, companySlug, companyColor }) {
  const [showNewLogo, setShowNewLogo] = useState(true);
  const [showExpansion, setShowExpansion] = useState(true);

  const chartData = data.map(d => ({
    month: d.month.slice(5),
    newLogo: d.newLogoBookings,
    expansion: d.expansionBookings,
    total: d.totalBookings,
  }));

  const budget = annualBudgets[companySlug] || 20000;

  const stats = useMemo(() => {
    const ytdData = data.filter(d => d.month.startsWith('2024'));
    const ytdBookings = ytdData.reduce((sum, d) => sum + d.totalBookings, 0);
    const monthsElapsed = ytdData.length;
    const proRata = monthsElapsed / 12;
    const pctOfBudget = (ytdBookings / budget) * 100;

    const lastMonth = ytdData.length ? parseInt(ytdData[ytdData.length - 1].month.slice(5)) : 1;
    const currentQ = Math.ceil(lastMonth / 3);
    const currentQData = ytdData.filter(d => Math.ceil(parseInt(d.month.slice(5)) / 3) === currentQ);
    const qtdBookings = currentQData.reduce((sum, d) => sum + d.totalBookings, 0);
    const qBudget = budget / 4;
    const qToGo = Math.max(0, qBudget - qtdBookings);

    return { ytdBookings, proRata, pctOfBudget, qToGo, budget };
  }, [data, budget]);

  const aheadOfPace = stats.pctOfBudget >= stats.proRata * 100;

  return (
    <div className="bg-permira-card border border-permira-border rounded-xl overflow-hidden">
      <div className="stripe-motif h-1" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em]">Total Bookings Over Time</h3>
          <div className="flex gap-3">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showNewLogo} onChange={(e) => setShowNewLogo(e.target.checked)}
                className="w-3 h-3" style={{ accentColor: companyColor || '#1e3a5f' }} />
              <span className="text-permira-text-secondary">New Logo</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showExpansion} onChange={(e) => setShowExpansion(e.target.checked)}
                className="w-3 h-3" style={{ accentColor: '#F5620F' }} />
              <span className="text-permira-text-secondary">Expansion</span>
            </label>
          </div>
        </div>

        {/* Stat strip */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-permira-dark/50 text-[10px]">
            <span className="text-permira-text-secondary">YTD:</span>
            <span className="font-mono font-bold text-permira-text">${(stats.ytdBookings / 1000).toFixed(1)}M</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-permira-orange/10 text-[10px]">
            <span className="text-permira-text-secondary">Q-to-Go:</span>
            <span className="font-mono font-bold text-permira-orange">${(stats.qToGo / 1000).toFixed(1)}M</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-permira-dark/50 text-[10px]">
            <span className="text-permira-text-secondary">Budget:</span>
            <span className="font-mono font-bold text-permira-text-secondary">${(stats.budget / 1000).toFixed(0)}M</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] ${
            aheadOfPace ? 'bg-permira-success/15 text-permira-success' : 'bg-permira-danger/15 text-permira-danger'
          }`}>
            <span className="opacity-60">% Budget:</span>
            <span className="font-mono font-bold">{stats.pctOfBudget.toFixed(1)}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-permira-dark/50 rounded-full mb-3 mt-5">
          <div
            className="absolute left-0 top-0 h-full bg-permira-success rounded-full transition-all"
            style={{ width: `${Math.min(stats.pctOfBudget, 100)}%` }}
          />
          <div
            className="absolute top-0 h-full w-px border-l border-dashed border-permira-text-secondary"
            style={{ left: `${Math.min(stats.proRata * 100, 100)}%` }}
          />
          <div
            className="absolute -top-4 text-[8px] text-permira-text-secondary whitespace-nowrap"
            style={{ left: `${Math.min(stats.proRata * 100, 100)}%`, transform: 'translateX(-50%)' }}
          >
            Expected Pace
          </div>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip content={<ChartTooltip />} />

              <Line type="monotone" dataKey="total" name="Total"
                stroke="#E5E7EB" strokeWidth={2.5} dot={false} />

              {showNewLogo && (
                <Line type="monotone" dataKey="newLogo" name="New Logo"
                  stroke={companyColor || '#1e3a5f'} strokeWidth={2} dot={false} />
              )}

              {showExpansion && (
                <Line type="monotone" dataKey="expansion" name="Expansion"
                  stroke="#F5620F" strokeWidth={2} dot={false} strokeDasharray="6 3" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
