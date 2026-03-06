import { motion } from 'framer-motion';

export default function CSVPreview({ data, onConfirm, onCancel }) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-permira-card border border-permira-border rounded-xl overflow-hidden"
    >
      <div className="stripe-motif h-1" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold">Preview ({data.length} rows)</h4>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-xs border border-permira-border rounded-lg hover:bg-permira-card-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-1.5 text-xs bg-permira-orange text-white rounded-lg hover:bg-permira-orange/90 transition-colors"
            >
              Confirm Upload
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-permira-card">
              <tr>
                {headers.map(h => (
                  <th key={h} className="text-left px-2 py-1.5 text-permira-text-secondary uppercase tracking-widest text-[10px] whitespace-nowrap border-b border-permira-border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-b border-permira-border/30">
                  {headers.map(h => (
                    <td key={h} className="px-2 py-1.5 font-mono whitespace-nowrap">
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length > 5 && (
                <tr>
                  <td colSpan={headers.length} className="px-2 py-1.5 text-permira-text-secondary text-center">
                    ... and {data.length - 5} more rows
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
