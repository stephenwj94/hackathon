import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-permira-card border border-permira-border rounded-lg p-3 shadow-xl text-xs">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-permira-text-secondary">{p.name}:</span>
          <span className="font-mono font-medium">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function RetentionChart({ data }) {
  const [showGross, setShowGross] = useState(true);
  const [showChurn, setShowChurn] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);

  const chartData = data.map(d => ({
    month: d.month.slice(5), // "01", "02", etc
    grossRetention: d.grossRetentionRate,
    churn: d.churnRate,
    downsell: d.downSellRate,
  }));

  return (
    <div className="bg-permira-card border border-permira-border rounded-xl overflow-hidden">
      <div className="stripe-motif h-1" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em]">Gross Retention Over Time</h3>
          <div className="flex gap-3">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showGross} onChange={(e) => setShowGross(e.target.checked)}
                className="accent-permira-success w-3 h-3" />
              <span className="text-permira-text-secondary">Gross Retention</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showChurn} onChange={(e) => setShowChurn(e.target.checked)}
                className="accent-red-400 w-3 h-3" />
              <span className="text-permira-text-secondary">Churn</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={showDownsell} onChange={(e) => setShowDownsell(e.target.checked)}
                className="accent-yellow-400 w-3 h-3" />
              <span className="text-permira-text-secondary">Downsell</span>
            </label>
          </div>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip content={<ChartTooltip />} />
              <AnimatePresence>
                {showGross && (
                  <Line type="monotone" dataKey="grossRetention" name="Gross Retention"
                    stroke="#10B981" strokeWidth={2} dot={false} />
                )}
                {showChurn && (
                  <Line type="monotone" dataKey="churn" name="Churn Rate"
                    stroke="#EF4444" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                )}
                {showDownsell && (
                  <Line type="monotone" dataKey="downsell" name="Downsell Rate"
                    stroke="#F59E0B" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                )}
              </AnimatePresence>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
