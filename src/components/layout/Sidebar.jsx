import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: '◈', label: 'Dashboard' },
  { to: '/benchmark', icon: '◉', label: 'Benchmark' },
  { to: '/company/zendesk', icon: '◎', label: 'Companies' },
  { to: '/upload', icon: '◇', label: 'Upload' },
];

export default function Sidebar() {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="w-56 xl:w-64 shrink-0 bg-permira-card border-r border-permira-border min-h-screen p-4 flex flex-col max-lg:w-14 max-lg:items-center"
    >
      <div className="text-xs uppercase tracking-[0.1em] text-permira-text-secondary mb-4 max-lg:hidden">
        Navigation
      </div>
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-permira-orange/15 text-permira-orange'
                  : 'text-permira-text-secondary hover:text-permira-text hover:bg-permira-card-hover'
              } max-lg:justify-center max-lg:px-2`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="max-lg:hidden">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
