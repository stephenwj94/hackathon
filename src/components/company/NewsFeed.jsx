import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CACHE_DURATION = 15 * 60 * 1000;
const newsCache = {};

function SkeletonCard() {
  return (
    <div className="bg-permira-card border border-permira-border rounded-xl p-4 animate-pulse min-w-[280px] max-w-[320px] shrink-0">
      <div className="h-4 w-3/4 bg-permira-border rounded mb-2" />
      <div className="h-3 w-full bg-permira-border rounded mb-1" />
      <div className="h-3 w-2/3 bg-permira-border rounded mb-3" />
      <div className="h-3 w-1/3 bg-permira-border rounded" />
    </div>
  );
}

function IntelCard({ article }) {
  const sentimentColors = {
    positive: 'bg-permira-success',
    neutral: 'bg-gray-400',
    negative: 'bg-permira-danger',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-permira-card border border-permira-border rounded-xl p-4 min-w-[280px] max-w-[320px] shrink-0 hover:bg-permira-card-hover transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] px-2 py-0.5 rounded bg-permira-dark/50 text-permira-text-secondary font-medium">
          {article.category}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${sentimentColors[article.sentiment] || sentimentColors.neutral}`} />
      </div>
      <h4 className="text-sm font-bold text-permira-text leading-snug mb-2 group-hover:text-permira-orange transition-colors line-clamp-2">
        {article.title}
      </h4>
      <p className="text-xs text-permira-text-secondary leading-relaxed line-clamp-3 mb-2">
        {article.summary}
      </p>
      <div className="flex items-center justify-between text-[10px] text-permira-text-secondary/60">
        <span>{article.source} · {article.date}</span>
        {article.url && (
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-permira-orange hover:underline font-medium"
          >Read →</a>
        )}
      </div>
    </motion.div>
  );
}

export default function NewsFeed({ companyName, companySlug }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchNews = useCallback(async () => {
    // Check client-side cache
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

  // Reset fetched ref when company changes
  useEffect(() => {
    fetchedRef.current = false;
  }, [companySlug]);

  return (
    <div className="bg-permira-card border border-permira-border rounded-xl overflow-hidden">
      <div className="stripe-motif h-1" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
            <span className="text-permira-orange">◈</span> Latest Intel
          </h3>
          <button
            onClick={() => { fetchedRef.current = false; fetchNews(); }}
            disabled={loading}
            className="text-[10px] text-permira-text-secondary hover:text-permira-orange transition-colors disabled:opacity-50"
          >
            {loading ? '↻ Loading...' : '↻ Refresh'}
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {loading && !articles.length && (
            Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)
          )}

          {!loading && error && !articles.length && (
            <div className="bg-permira-card border border-permira-border/50 rounded-xl p-6 min-w-[320px] text-center">
              <div className="text-permira-text-secondary text-sm mb-1">Intel unavailable</div>
              <div className="text-permira-text-secondary/60 text-xs">{error}</div>
            </div>
          )}

          {articles.map((article, i) => (
            <IntelCard key={`${article.title}-${i}`} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
