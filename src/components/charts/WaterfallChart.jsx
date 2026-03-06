import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-tooltip rounded-lg p-3">
      <div className="text-xs text-permira-text-secondary mb-1 font-mono">{label}</div>
      {payload.map(entry => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="text-xs">{entry.name}</span>
          <span className="text-xs font-mono font-medium">${entry.value?.toLocaleString()}K</span>
        </div>
      ))}
    </div>
  );
}

export default function WaterfallChart({ data }) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      month: d.month.replace('20', "'"),
      newLogo: d.newLogoBookings,
      expansion: d.expansionBookings,
    }));
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-permira-card border border-permira-border rounded-xl p-4"
    >
      <h4 className="text-sm font-bold mb-3">Bookings Breakdown</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="month"
            stroke="#4B5563"
            tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis
            stroke="#4B5563"
            tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => <span className="text-permira-text-secondary text-xs">{value}</span>}
          />
          <Bar dataKey="newLogo" name="New Logo" stackId="a" fill="#0D1F3C" radius={[0, 0, 0, 0]} animationBegin={200} animationDuration={800} />
          <Bar dataKey="expansion" name="Expansion" stackId="a" fill="#F5620F" radius={[3, 3, 0, 0]} animationBegin={400} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
