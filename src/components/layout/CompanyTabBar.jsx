import { useNavigate, useLocation } from 'react-router-dom';
import { companies } from '../../data/companies';

export default function CompanyTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeSlug = location.pathname.match(/\/company\/([^/]+)/)?.[1] || null;

  return (
    <div className="bg-permira-card border-b border-permira-border px-4 flex gap-0 overflow-x-auto">
      {companies.map((c) => {
        const isActive = c.slug === activeSlug;
        return (
          <button
            key={c.slug}
            onClick={() => navigate(`/company/${c.slug}`)}
            className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap"
            style={{
              color: isActive ? '#fff' : '#9CA3AF',
              backgroundColor: isActive ? `${c.color}14` : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#9CA3AF';
              }
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: c.color }}
            />
            {c.name}
            {/* Bottom border indicator */}
            <div
              className="absolute bottom-0 left-0 right-0 transition-all"
              style={{
                height: isActive ? 3 : 0,
                backgroundColor: c.color,
                opacity: isActive ? 1 : 0,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
