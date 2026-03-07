import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: '◈', label: 'Dashboard' },
  { to: '/benchmark', icon: '◉', label: 'Benchmark' },
  { to: '/company/zendesk', icon: '◎', label: 'Companies' },
  { to: '/upload', icon: '◇', label: 'Upload' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <nav
      className={`
        shrink-0 bg-permira-card border-r border-permira-border p-4 flex flex-col
        fixed z-40 top-0 left-0 h-full w-64 shadow-2xl
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0 md:transform-none md:shadow-none md:min-h-screen
        md:w-14 lg:w-56 xl:w-64
        md:items-center lg:items-start
      `}
    >
      {/* Close button — mobile only */}
      <button
        className="md:hidden self-end mb-2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-permira-text-secondary hover:text-permira-text"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="text-xs uppercase tracking-[0.1em] text-permira-text-secondary mb-4 hidden lg:block">
        Navigation
      </div>
      <div className="flex flex-col gap-1 w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px]
              md:justify-center md:px-2 lg:justify-start lg:px-3 ${
                isActive
                  ? 'bg-permira-orange/15 text-permira-orange'
                  : 'text-permira-text-secondary hover:text-permira-text hover:bg-permira-card-hover'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="md:hidden lg:inline">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
