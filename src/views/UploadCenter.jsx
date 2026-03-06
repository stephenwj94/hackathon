import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { companies } from '../data/companies';
import { benchmarks } from '../data/benchmarks';
import { usePortfolioData } from '../hooks/usePortfolioData';
import UploadZone from '../components/upload/UploadZone';
import CSVPreview from '../components/upload/CSVPreview';
import EmailWorkflowMockup from '../components/upload/EmailWorkflowMockup';

const csvFields = Object.keys(benchmarks);

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      const val = values[i];
      row[h] = h === 'month' ? val : (isNaN(Number(val)) ? val : Number(val));
    });
    return row;
  });
}

function generateTemplate() {
  const header = ['month', ...csvFields].join(',');
  const exampleRow = ['2024-01', ...csvFields.map(f => {
    if (f === 'arr') return '500';
    if (f.includes('Rate') || f.includes('retention') || f.includes('Utilization')) return '95';
    if (f.includes('Growth')) return '2.5';
    if (f === 'magicNumber') return '0.85';
    if (f === 'ltvCacRatio') return '3.5';
    return '100';
  })].join(',');
  return `${header}\n${exampleRow}`;
}

export default function UploadCenter() {
  const { updateData } = usePortfolioData();
  const [activeUpload, setActiveUpload] = useState(null); // { slug, data, fileName }

  const handleUpload = useCallback((slug) => (csvText, fileName) => {
    const parsed = parseCSV(csvText);
    if (parsed.length > 0) {
      setActiveUpload({ slug, data: parsed, fileName });
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (activeUpload) {
      updateData(activeUpload.slug, activeUpload.data);
      setActiveUpload(null);
    }
  }, [activeUpload, updateData]);

  const downloadTemplate = () => {
    const content = generateTemplate();
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kpi_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Section 1 — CSV Upload */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Data Upload Center</h2>
            <p className="text-sm text-permira-text-secondary mt-1">Upload monthly KPI data per portfolio company</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-permira-navy border border-permira-border rounded-lg text-sm hover:bg-permira-card-hover transition-colors"
          >
            ↓ Download CSV Template
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company, i) => (
            <motion.div
              key={company.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <UploadZone company={company} onUpload={handleUpload(company.slug)} />
            </motion.div>
          ))}
        </div>

        {/* Preview */}
        {activeUpload && (
          <div className="mt-4">
            <CSVPreview
              data={activeUpload.data}
              onConfirm={handleConfirm}
              onCancel={() => setActiveUpload(null)}
            />
          </div>
        )}
      </div>

      {/* Section 2 — Email workflow (Coming Soon) */}
      <EmailWorkflowMockup />
    </motion.div>
  );
}
