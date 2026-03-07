import { useState } from 'react';
import { motion } from 'framer-motion';
import { pipelineData } from '../../data/pipelineData';

function CoverageGauge({ ratio, yoyGrowth }) {
  const color = ratio >= 3 ? '#10B981' : ratio >= 2 ? '#F59E0B' : '#EF4444';
  const pct = Math.min((ratio / 5) * 100, 100);

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold font-mono" style={{ color }}>
        {ratio.toFixed(1)}x
      </div>
      <div className="text-xs text-permira-text-secondary uppercase tracking-wider mb-2">Coverage</div>
      <div className="w-full h-3 bg-permira-dark rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs">
        <span className={yoyGrowth >= 0 ? 'text-permira-success' : 'text-permira-danger'}>
          {yoyGrowth >= 0 ? '↑' : '↓'} {Math.abs(yoyGrowth)}% YoY
        </span>
      </div>
    </div>
  );
}

function StageFunnel({ stages }) {
  const stageLabels = [
    { key: 'earlyStage', label: 'Early Stage' },
    { key: 'lateStage', label: 'Late Stage' },
    { key: 'commit', label: 'Commit' },
    { key: 'closedWon', label: 'Closed Won' },
  ];

  const maxValue = Math.max(...stageLabels.map(s => stages[s.key]?.value || 0));

  return (
    <div className="space-y-2">
      {stageLabels.map((stage, i) => {
        const data = stages[stage.key];
        if (!data) return null;
        const pct = maxValue > 0 ? (data.value / maxValue) * 100 : 0;

        return (
          <motion.div key={stage.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-permira-text-secondary">{stage.label}</span>
              <span className="font-mono">
                <span className="text-permira-text">{data.deals} deals</span>
                <span className="text-permira-text-secondary ml-2">${(data.value / 1000).toFixed(1)}M</span>
              </span>
            </div>
            <div className="h-2 bg-permira-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #F5620F, #FF8844)' }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function DealCard({ deal, type }) {
  const isWin = type === 'win';
  return (
    <div className={`bg-permira-dark/50 rounded-lg p-3 border ${
      isWin ? 'border-permira-success/20' : 'border-permira-danger/20'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-permira-text">{deal.customer}</span>
        <span className="text-xs font-mono font-bold" style={{ color: isWin ? '#10B981' : '#EF4444' }}>
          {deal.value}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-permira-card text-permira-text-secondary">
          {deal.type}
        </span>
      </div>
      <p className="text-xs text-permira-text-secondary leading-relaxed">
        {isWin ? deal.description : deal.reason}
      </p>
    </div>
  );
}

export default function PipelineIntelligence({ companySlug }) {
  const [pipelineFilter, setPipelineFilter] = useState('both');
  const pipeline = pipelineData[companySlug];

  if (!pipeline) return null;

  // Merge stages based on filter
  const getStages = () => {
    if (pipelineFilter === 'newLogo') return pipeline.stages.newLogo;
    if (pipelineFilter === 'expansion') return pipeline.stages.expansion;
    // Both: combine
    const nl = pipeline.stages.newLogo;
    const ex = pipeline.stages.expansion;
    return {
      earlyStage: { deals: nl.earlyStage.deals + ex.earlyStage.deals, value: nl.earlyStage.value + ex.earlyStage.value },
      lateStage: { deals: nl.lateStage.deals + ex.lateStage.deals, value: nl.lateStage.value + ex.lateStage.value },
      commit: { deals: nl.commit.deals + ex.commit.deals, value: nl.commit.value + ex.commit.value },
      closedWon: { deals: nl.closedWon.deals + ex.closedWon.deals, value: nl.closedWon.value + ex.closedWon.value },
    };
  };

  const filters = [
    { key: 'both', label: 'Both' },
    { key: 'newLogo', label: 'New Logo' },
    { key: 'expansion', label: 'Expansion' },
  ];

  return (
    <div className="bg-permira-card border border-permira-border rounded-xl overflow-hidden">
      <div className="stripe-motif h-1" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
            <span className="text-permira-orange">◈</span> Pipeline Intelligence
          </h3>
          <div className="flex gap-1 bg-permira-dark rounded-lg p-0.5">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setPipelineFilter(f.key)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                  pipelineFilter === f.key
                    ? 'bg-permira-orange text-white'
                    : 'text-permira-text-secondary hover:text-permira-text'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Coverage + Funnel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center justify-center">
            <CoverageGauge ratio={pipeline.coverage.ratio} yoyGrowth={pipeline.coverage.yoyGrowth} />
          </div>
          <div className="md:col-span-2">
            <StageFunnel stages={getStages()} />
          </div>
        </div>

        {/* Key Wins */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-permira-success mb-3 flex items-center gap-1.5">
            <span>▲</span> Key Wins
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pipeline.wins.map((deal, i) => (
              <motion.div key={deal.customer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <DealCard deal={deal} type="win" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Losses */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-permira-danger mb-3 flex items-center gap-1.5">
            <span>▼</span> Key Losses
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pipeline.losses.map((deal, i) => (
              <motion.div key={deal.customer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
              >
                <DealCard deal={deal} type="loss" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
