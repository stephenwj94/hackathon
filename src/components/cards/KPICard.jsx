import { motion } from 'framer-motion';
import AnimatedNumber from '../ui/AnimatedNumber';

export default function KPICard({ label, value, prefix = '', suffix = '', decimals = 1, trend, trendYoY, delay = 0, color }) {
  const isPositive = trend > 0;
  const trendColor = isPositive ? 'text-permira-success' : 'text-permira-danger';
  const trendArrow = isPositive ? '↑' : '↓';

  const isYoYPositive = trendYoY > 0;
  const yoyColor = isYoYPositive ? 'text-permira-success' : 'text-permira-danger';
  const yoyArrow = isYoYPositive ? '↑' : '↓';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="bg-permira-card border border-permira-border rounded-xl p-4 stripe-border-left hover:bg-permira-card-hover transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        {color && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
        <span className="text-xs uppercase tracking-[0.1em] text-permira-text-secondary">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <AnimatedNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className="text-2xl font-bold text-permira-text"
        />
        {trend !== undefined && trend !== null && (
          <span className={`text-sm font-mono font-medium ${trendColor} mb-0.5`}>
            {trendArrow} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {trendYoY !== undefined && trendYoY !== null && (
        <div className={`text-xs font-mono mt-1 ${yoyColor}`} style={{ color: '#9CA3AF' }}>
          <span className={yoyColor}>{yoyArrow} {Math.abs(trendYoY).toFixed(1)}% YoY</span>
        </div>
      )}
    </motion.div>
  );
}
