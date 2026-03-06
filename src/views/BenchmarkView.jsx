import { motion } from 'framer-motion';
import BenchmarkChart from '../components/charts/BenchmarkChart';

export default function BenchmarkView() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold">Cross-Company Benchmark</h2>
        <p className="text-sm text-permira-text-secondary mt-1">
          Compare portfolio companies across key SaaS metrics. Drag on chart to zoom. Click data points for deep dive.
        </p>
      </div>
      <BenchmarkChart />
    </motion.div>
  );
}
