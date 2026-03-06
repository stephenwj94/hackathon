import { useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { companies } from '../../data/companies';

const statuses = {
  zendesk: { status: 'Submitted', icon: '✓', color: 'text-permira-success' },
  seismic: { status: 'Pending', icon: '⏳', color: 'text-yellow-400' },
  mimecast: { status: 'Submitted', icon: '✓', color: 'text-permira-success' },
  lytix: { status: 'Overdue', icon: '!', color: 'text-permira-danger' },
  octus: { status: 'Pending', icon: '⏳', color: 'text-yellow-400' },
  mcafee: { status: 'Submitted', icon: '✓', color: 'text-permira-success' },
};

export default function EmailWorkflowMockup() {
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-permira-card border border-permira-border rounded-xl overflow-hidden"
    >
      <div className="stripe-motif h-1" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-bold">Automated Monthly Data Request</h3>
          <Badge variant="orange">COMING SOON</Badge>
        </div>

        {/* Email template preview */}
        <div className="bg-permira-dark/50 rounded-lg p-4 mb-6 border border-permira-border/50">
          <div className="text-xs text-permira-text-secondary mb-2 uppercase tracking-widest">Email Preview</div>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-permira-text-secondary">From:</span>
              <span>data@permira.com</span>
            </div>
            <div className="flex gap-2">
              <span className="text-permira-text-secondary">Subject:</span>
              <span>Monthly KPI Data Request — {"{{company_name}}"} — {"{{month}}"}</span>
            </div>
            <div className="border-t border-permira-border/50 pt-2 mt-2 text-permira-text-secondary text-xs leading-relaxed">
              <p>Dear {"{{contact_name}}"},</p>
              <p className="mt-2">Please submit your monthly KPI data for {"{{month}}"} using the secure link below. The submission deadline is {"{{deadline}}"}.</p>
              <p className="mt-2 text-permira-orange">[Submit Data →]</p>
              <p className="mt-2">Thank you,<br/>Permira Technology Portfolio Team</p>
            </div>
          </div>
        </div>

        {/* Status table */}
        <div className="mb-4">
          <div className="text-xs text-permira-text-secondary uppercase tracking-widest mb-3">Collection Status — June 2024</div>
          <div className="space-y-2">
            {companies.map((company, i) => {
              const s = statuses[company.slug];
              return (
                <motion.div
                  key={company.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center justify-between bg-permira-dark/30 rounded-lg px-4 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: company.color }} />
                    <span className="text-sm font-medium">{company.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${s.color}`}>
                    {s.status} {s.icon}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full mt-2 py-2.5 bg-permira-navy hover:bg-permira-navy/80 border border-permira-border rounded-lg text-sm font-medium transition-colors"
        >
          Configure Email Schedule
        </button>
      </div>

      {/* Config modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Email Schedule Configuration">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-permira-text-secondary uppercase tracking-widest mb-1">Send Day of Month</label>
            <select className="w-full bg-permira-dark border border-permira-border rounded-lg px-3 py-2 text-sm" defaultValue="5">
              {Array.from({ length: 28 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-permira-text-secondary uppercase tracking-widest mb-1">Reminder Cadence</label>
            <select className="w-full bg-permira-dark border border-permira-border rounded-lg px-3 py-2 text-sm" defaultValue="3">
              <option value="1">Every day</option>
              <option value="3">Every 3 days</option>
              <option value="7">Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-permira-text-secondary uppercase tracking-widest mb-1">Contact Emails</label>
            <div className="space-y-2">
              {companies.map(c => (
                <div key={c.slug} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <input
                    className="flex-1 bg-permira-dark border border-permira-border rounded-lg px-3 py-1.5 text-xs font-mono"
                    placeholder={`cfo@${c.slug}.com`}
                    defaultValue={`cfo@${c.slug}.com`}
                  />
                </div>
              ))}
            </div>
          </div>
          <button className="w-full py-2.5 bg-permira-orange/30 text-permira-orange rounded-lg text-sm font-medium cursor-not-allowed">
            Save Configuration (Coming Soon)
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
