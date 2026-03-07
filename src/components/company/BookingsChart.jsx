import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-permira-card border border-permira-border rounded-lg p-3 shadow-xl text-xs">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-permira-text-secondary">{p.name}:</span>
          <span className="font-mono font-medium">${p.value.toLocaleString()}K</span>
        </div>
      ))}
    </div>
  );
}

export default function BookingsChart({ data }) {
  const [showNewLogo, setShowNewLogo] = useState(true);
  const [showExpansion, setShowExpansion] = useState(true);

  const chartData = data.map(d => ({
    month: d.month.slice(5),
    newLogo: d.newLogoBookings,
    expansion: d.expansionBookings,
  }));

  return (
    <div className="bg-permira-card border border-permira-border rounded-xl overflow-hidden">
      <div className="stripe-motif h-1" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em]">Total Bookings Over Time</h3>
          <div className="flex gap-3">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showNewLogo} onChange={(e) => setShowNewLogo(e.target.checked)}
                className="w-3 h-3" style={{ accentColor: '#1e3a5f' }} />
              <span className="text-permira-text-secondary">New Logo</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showExpansion} onChange={(e) => setShowExpansion(e.target.checked)}
                className="w-3 h-3" style={{ accentColor: '#F5620F' }} />
              <span className="text-permira-text-secondary">Expansion</span>
            </label>
          </div>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip content={<ChartTooltip />} />
              {showNewLogo && (
                <Bar dataKey="newLogo" name="New Logo" stackId="a" fill="#1e3a5f" radius={[0, 0, 0, 0]} />
              )}
              {showExpansion && (
                <Bar dataKey="expansion" name="Expansion" stackId="a" fill="#F5620F" radius={showNewLogo ? [4, 4, 0, 0] : [4, 4, 4, 4]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
