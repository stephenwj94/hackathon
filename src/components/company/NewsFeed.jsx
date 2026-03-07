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

  const getApiKey = () => {
    return import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem('anthropic_api_key') || '';
  };

  const fetchNews = useCallback(async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('No API key configured');
      return;
    }

    // Check cache
    const cached = newsCache[companySlug];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setArticles(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          tools: [{
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 2,
          }],
          system: `Search for recent news about ${companyName}. Return ONLY valid JSON: {"articles":[{"title":"...","summary":"1-2 sentences","category":"Company News|Competitor Activity|End Market Trends|M&A|Earnings","source":"...","date":"YYYY-MM-DD","sentiment":"positive|neutral|negative","url":"..."}]}. Return exactly 5 articles.`,
          messages: [{
            role: 'user',
            content: `Latest news about ${companyName}. Focus on business developments, partnerships, product launches, market trends, and competitive dynamics.`,
          }],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      let parsed = null;
      for (const block of data.content) {
        if (block.type === 'text' && block.text) {
          const jsonMatch = block.text.match(/\{[\s\S]*"articles"[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsed = JSON.parse(jsonMatch[0]);
            } catch (e) { /* continue */ }
          }
        }
      }

      if (parsed?.articles) {
        setArticles(parsed.articles);
        newsCache[companySlug] = { data: parsed.articles, timestamp: Date.now() };
      } else {
        throw new Error('Could not parse articles');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [companyName, companySlug]);

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
              <div className="text-permira-text-secondary/60 text-xs mb-3">{error}</div>
              {!getApiKey() && (
                <div className="text-xs text-permira-text-secondary/80">
                  <p className="mb-2">Enter your API key in the browser console:</p>
                  <code className="bg-permira-dark/80 px-2 py-1 rounded text-permira-orange text-[10px] font-mono">
                    localStorage.setItem('anthropic_api_key', 'sk-...')
                  </code>
                  <p className="mt-2">Then refresh the page.</p>
                </div>
              )}
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
