import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function RetentionHeatmap({ data }) {
  const cohorts = useMemo(() => {
    // Generate 6 cohorts from the last 12 months of data
    const recentData = data.slice(-12);
    const result = [];
    for (let c = 0; c < 6; c++) {
      const baseMonth = recentData[c]?.month || `Cohort ${c + 1}`;
      const row = { label: baseMonth.replace('20', "'") };
      const retention = [];
      for (let m = 0; m < 6; m++) {
        const idx = c + m;
        if (idx < recentData.length) {
          // Use gross retention compounded
          const baseGrr = recentData[c]?.grossRetentionRate || 95;
          const val = Math.round(Math.pow(baseGrr / 100, m + 1) * 1000) / 10;
          retention.push(val);
        } else {
          retention.push(null);
        }
      }
      row.values = retention;
      result.push(row);
    }
    return result;
  }, [data]);

  const getColor = (val) => {
    if (val === null) return 'bg-permira-dark/30';
    if (val >= 90) return 'bg-permira-success/30 text-permira-success';
    if (val >= 80) return 'bg-yellow-500/20 text-yellow-400';
    if (val >= 70) return 'bg-permira-orange/20 text-permira-orange';
    return 'bg-permira-danger/20 text-permira-danger';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="bg-permira-card border border-permira-border rounded-xl p-4"
    >
      <h4 className="text-sm font-bold mb-3">Retention Cohorts</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left py-1 pr-3 text-permira-text-secondary uppercase tracking-widest text-[10px]">Cohort</th>
              {[1, 2, 3, 4, 5, 6].map(m => (
                <th key={m} className="text-center px-2 py-1 text-permira-text-secondary uppercase tracking-widest text-[10px]">M{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort, ci) => (
              <tr key={ci}>
                <td className="py-1 pr-3 font-mono text-permira-text-secondary">{cohort.label}</td>
                {cohort.values.map((val, mi) => (
                  <td key={mi} className="text-center px-1 py-1">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + ci * 0.05 + mi * 0.03, duration: 0.25 }}
                      className={`inline-block px-2 py-1 rounded font-mono font-medium ${getColor(val)}`}
                    >
                      {val !== null ? `${val}%` : '—'}
                    </motion.div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
