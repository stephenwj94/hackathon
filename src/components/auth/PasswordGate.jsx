import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PasswordGate({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-permira-dark flex items-center justify-center z-50"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-permira-card border border-permira-border rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          {/* Header with stripe motif */}
          <div className="stripe-motif p-8 flex flex-col items-center">
            {/* Permira Logo */}
            <div className="mb-4">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                {/* Orange flame/arrow */}
                <path d="M30 8 L36 22 L30 18 L24 22 Z" fill="#F5620F" />
                <path d="M30 4 L38 24 L30 19 L22 24 Z" fill="#F5620F" opacity="0.7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-[0.15em] text-white">PERMIRA</h1>
            <p className="text-permira-text-secondary text-sm mt-1 tracking-wider">PORTFOLIO INTELLIGENCE</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <label className="block text-xs uppercase tracking-[0.1em] text-permira-text-secondary mb-2">
                Enter Password
              </label>
              <motion.div
                animate={error ? {
                  x: [0, -10, 10, -10, 10, -5, 5, 0],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 bg-permira-dark border rounded-lg text-permira-text font-mono focus:outline-none focus:ring-2 transition-all ${
                    error
                      ? 'border-permira-danger focus:ring-permira-danger'
                      : 'border-permira-border focus:ring-permira-orange'
                  }`}
                  placeholder="••••••••"
                  autoFocus
                />
              </motion.div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-permira-danger text-sm mt-2"
                >
                  Incorrect password. Try again.
                </motion.p>
              )}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-permira-orange hover:bg-permira-orange/90 text-white font-semibold rounded-lg transition-colors"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
