import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedNumber from '../ui/AnimatedNumber';

export default function CompanyCard({ company, metrics, delay = 0 }) {
  const navigate = useNavigate();

  if (!metrics) return null;

  const isGrowthPositive = metrics.arrGrowthMoM > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      onClick={() => navigate(`/company/${company.slug}`)}
      className="bg-permira-card border border-permira-border rounded-xl p-4 cursor-pointer hover:bg-permira-card-hover transition-all hover:border-permira-border/80 group"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: company.color }} />
        <span className="text-sm font-semibold group-hover:text-permira-orange transition-colors">{company.name}</span>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-xs text-permira-text-secondary uppercase tracking-widest">ARR</div>
          <div className="flex items-center gap-2">
            <AnimatedNumber value={metrics.arr} prefix="$" suffix="M" decimals={1} className="text-xl font-bold" />
            <span className={`text-xs font-mono ${isGrowthPositive ? 'text-permira-success' : 'text-permira-danger'}`}>
              {isGrowthPositive ? '↑' : '↓'} {Math.abs(metrics.arrGrowthMoM).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-permira-border">
          <div>
            <div className="text-[10px] text-permira-text-secondary uppercase tracking-widest">NRR</div>
            <AnimatedNumber value={metrics.netRevenueRetention} suffix="%" decimals={1} className="text-sm font-semibold" />
          </div>
          <div>
            <div className="text-[10px] text-permira-text-secondary uppercase tracking-widest">GRR</div>
            <AnimatedNumber value={metrics.grossRetentionRate} suffix="%" decimals={1} className="text-sm font-semibold" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
