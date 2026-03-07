import { useState, useCallback, useRef, useEffect } from 'react';

const CACHE_DURATION = 15 * 60 * 1000;
const newsCache = {};

const CATEGORIES = ['All', 'Company News', 'Earnings', 'M&A', 'Competitor Activity', 'End Market Trends'];

const categoryColors = {
  'Company News': 'bg-blue-500/20 text-blue-400',
  'Earnings': 'bg-emerald-500/20 text-emerald-400',
  'M&A': 'bg-purple-500/20 text-purple-400',
  'Competitor Activity': 'bg-amber-500/20 text-amber-400',
  'End Market Trends': 'bg-cyan-500/20 text-cyan-400',
};

const sentimentColors = {
  positive: 'bg-permira-success',
  neutral: 'bg-gray-400',
  negative: 'bg-permira-danger',
};

function relativeDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function SkeletonRow() {
  return (
    <div className="p-3 border-b border-permira-border/50 animate-pulse">
      <div className="h-3 w-20 bg-permira-border rounded mb-2" />
      <div className="h-4 w-full bg-permira-border rounded mb-1" />
      <div className="h-4 w-3/4 bg-permira-border rounded mb-2" />
      <div className="h-3 w-1/3 bg-permira-border rounded" />
    </div>
  );
}

export default function NewsFeed({ companyName, companySlug }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState(['All']);
  const fetchedRef = useRef(false);

  const fetchNews = useCallback(async () => {
    const cached = newsCache[companySlug];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setArticles(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/news?company=${companySlug}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `API error: ${response.status}`);
      }
      const data = await response.json();
      if (data.articles?.length) {
        setArticles(data.articles);
        newsCache[companySlug] = { data: data.articles, timestamp: Date.now() };
      } else {
        throw new Error('No articles available');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [companySlug]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchNews();
    }
  }, [fetchNews]);

  useEffect(() => {
    fetchedRef.current = false;
  }, [companySlug]);

  const toggleFilter = (cat) => {
    if (cat === 'All') {
      setActiveFilters(['All']);
    } else {
      const newFilters = activeFilters.filter(f => f !== 'All');
      if (newFilters.includes(cat)) {
        const remaining = newFilters.filter(f => f !== cat);
        setActiveFilters(remaining.length ? remaining : ['All']);
      } else {
        setActiveFilters([...newFilters, cat]);
      }
    }
  };

  const filteredArticles = articles
    .filter(a => activeFilters.includes('All') || activeFilters.includes(a.category))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bg-permira-card border border-permira-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="stripe-motif h-1" />
      <div className="p-3 border-b border-permira-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-permira-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-permira-success" />
            </span>
            Latest Intel
          </h3>
          <button
            onClick={() => { fetchedRef.current = false; fetchNews(); }}
            disabled={loading}
            className="text-[10px] text-permira-text-secondary hover:text-permira-orange transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {loading ? '↻ Loading...' : '↻ Refresh'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleFilter(cat)}
              className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all min-h-[28px] ${
                activeFilters.includes(cat)
                  ? 'bg-permira-orange text-white'
                  : 'bg-permira-dark/50 text-permira-text-secondary hover:text-permira-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto intel-scroll min-h-0">
        {loading && !articles.length && (
          Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)
        )}

        {!loading && error && !articles.length && (
          <div className="p-6 text-center">
            <div className="text-permira-text-secondary text-sm mb-1">Intel unavailable</div>
            <div className="text-permira-text-secondary/60 text-xs">{error}</div>
          </div>
        )}

        {filteredArticles.map((article, i) => (
          <a
            key={`${article.title}-${i}`}
            href={article.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 border-b border-permira-border/30 hover:bg-permira-card-hover hover:border-l-2 hover:border-l-permira-orange hover:brightness-110 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${categoryColors[article.category] || 'bg-gray-500/20 text-gray-400'}`}>
                {article.category}
              </span>
              <div className={`w-2 h-2 rounded-full shrink-0 ${sentimentColors[article.sentiment] || sentimentColors.neutral}`} />
            </div>
            <h4 className="text-xs font-bold text-permira-text leading-snug mb-1 group-hover:text-permira-orange transition-colors line-clamp-2">
              {article.title}
            </h4>
            <div className="text-[10px] text-permira-text-secondary/60">
              {article.source} · {relativeDate(article.date)}
            </div>
          </a>
        ))}

        {!loading && !error && filteredArticles.length === 0 && articles.length > 0 && (
          <div className="p-6 text-center text-permira-text-secondary text-xs">
            No articles match selected filters
          </div>
        )}
      </div>
    </div>
  );
}
