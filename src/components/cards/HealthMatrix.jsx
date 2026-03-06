import { motion } from 'framer-motion';
import { companies } from '../../data/companies';
import { benchmarks, healthMatrixMetrics, getHealthColor } from '../../data/benchmarks';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const colorClasses = {
  green: 'bg-permira-success/20 text-permira-success',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  red: 'bg-permira-danger/20 text-permira-danger',
  neutral: 'bg-permira-card text-permira-text-secondary',
};

export default function HealthMatrix() {
  const { getLatestMetrics } = usePortfolioData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-permira-card border border-permira-border rounded-xl overflow-hidden"
    >
      <div className="stripe-motif h-1" />
      <div className="p-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4">Portfolio Health Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-permira-border">
                <th className="text-left py-2 pr-4 text-xs text-permira-text-secondary uppercase tracking-widest">Company</th>
                {healthMatrixMetrics.map(key => (
                  <th key={key} className="text-center px-2 py-2 text-[10px] text-permira-text-secondary uppercase tracking-widest whitespace-nowrap">
                    {benchmarks[key].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.map((company, ci) => {
                const metrics = getLatestMetrics(company.slug);
                if (!metrics) return null;
                return (
                  <tr key={company.slug} className="border-b border-permira-border/50">
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: company.color }} />
                        <span className="font-medium text-sm">{company.name}</span>
                      </div>
                    </td>
                    {healthMatrixMetrics.map((key, mi) => {
                      const val = metrics[key];
                      const health = getHealthColor(key, val);
                      return (
                        <td key={key} className="text-center px-2 py-2">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + ci * 0.08 + mi * 0.04, duration: 0.3 }}
                            className={`inline-block px-2 py-1 rounded-md text-xs font-mono font-medium ${colorClasses[health]}`}
                          >
                            {typeof val === 'number' ? val.toFixed(key === 'magicNumber' ? 2 : 1) : '—'}
                            {benchmarks[key].unit === '%' ? '%' : benchmarks[key].unit === 'x' ? 'x' : ''}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
