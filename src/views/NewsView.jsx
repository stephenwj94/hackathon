import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { companies } from '../data/companies';

const categories = ['All', 'Company News', 'Competitor Activity', 'End Market Trends', 'M&A', 'Earnings'];
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const sentimentDots = {
  positive: 'bg-permira-success',
  neutral: 'bg-gray-400',
  negative: 'bg-permira-danger',
};

function SkeletonCard() {
  return (
    <div className="bg-permira-card border border-permira-border rounded-xl p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="shrink-0 space-y-2">
          <div className="h-5 w-16 bg-permira-border rounded-full" />
          <div className="h-4 w-20 bg-permira-border rounded" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-permira-border rounded" />
          <div className="h-3 w-full bg-permira-border rounded" />
          <div className="h-3 w-2/3 bg-permira-border rounded" />
          <div className="h-3 w-1/3 bg-permira-border rounded mt-2" />
        </div>
        <div className="shrink-0">
          <div className="w-3 h-3 rounded-full bg-permira-border" />
        </div>
      </div>
    </div>
  );
}

function NewsCard({ article }) {
  const [expanded, setExpanded] = useState(false);
  const company = companies.find(c =>
    c.name.toLowerCase() === (article.company || '').toLowerCase()
  );
  const companyColor = company?.color || '#F5620F';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-permira-card border border-permira-border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:shadow-permira-orange/5 group ${
        expanded ? 'border-l-permira-orange' : ''
      }`}
      style={{
        borderLeftWidth: expanded ? 3 : 1,
        borderLeftColor: expanded ? '#F5620F' : undefined,
      }}
      onClick={() => setExpanded(!expanded)}
      whileHover={{
        y: -2,
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        borderLeftColor: '#F5620F',
        borderLeftWidth: 3,
      }}
    >
      <div className="p-4 flex gap-4">
        {/* Left: company tag + category */}
        <div className="shrink-0 flex flex-col gap-2">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white"
            style={{ backgroundColor: companyColor }}
          >
            {article.company}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-permira-dark/50 text-permira-text-secondary font-medium">
            {article.category}
          </span>
        </div>

        {/* Center: headline + summary */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-permira-text leading-snug mb-1 group-hover:text-permira-orange transition-colors">
            {article.title}
          </h4>
          <p className={`text-xs text-permira-text-secondary leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {article.summary}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-permira-text-secondary/60">
            <span>{article.source}</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>
        </div>

        {/* Right: sentiment dot */}
        <div className="shrink-0 pt-1">
          <div
            className={`w-3 h-3 rounded-full ${sentimentDots[article.sentiment] || sentimentDots.neutral}`}
            title={article.sentiment}
          />
        </div>
      </div>

      {/* Expanded section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 border-t border-permira-border/50"
          >
            <div className="pt-3">
              <p className="text-xs text-permira-text-secondary leading-relaxed mb-3">
                {article.summary}
              </p>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-permira-orange hover:underline font-medium"
                >
                  Read More →
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ErrorCard({ error, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-permira-card border border-permira-danger/30 rounded-xl p-6 text-center"
    >
      <div className="text-permira-danger text-lg mb-2">⚠</div>
      <h4 className="text-sm font-bold text-permira-text mb-2">Failed to fetch news</h4>
      <p className="text-xs text-permira-text-secondary mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-permira-orange/20 text-permira-orange rounded-lg text-xs font-medium hover:bg-permira-orange/30 transition-colors"
      >
        Retry
      </button>
    </motion.div>
  );
}

function getStoredApiKey() {
  return localStorage.getItem('anthropic_api_key') || '';
}

export default function NewsView() {
  const [selectedCompanies, setSelectedCompanies] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const cacheRef = useRef({ data: null, timestamp: 0, key: '' });
  const [now, setNow] = useState(Date.now());
  const [apiKey, setApiKey] = useState(getStoredApiKey);
  const [showKeyInput, setShowKeyInput] = useState(!getStoredApiKey());

  // Update "X minutes ago" display
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return null;
    const mins = Math.floor((now - lastUpdated) / 60000);
    if (mins < 1) return 'just now';
    if (mins === 1) return '1 minute ago';
    return `${mins} minutes ago`;
  };

  const toggleCompany = (name) => {
    if (name === 'All') {
      setSelectedCompanies(['All']);
    } else {
      setSelectedCompanies(prev => {
        const filtered = prev.filter(c => c !== 'All');
        if (filtered.includes(name)) {
          const next = filtered.filter(c => c !== name);
          return next.length === 0 ? ['All'] : next;
        }
        return [...filtered, name];
      });
    }
  };

  const saveApiKey = (key) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    localStorage.setItem('anthropic_api_key', trimmed);
    setShowKeyInput(false);
    setError(null);
  };

  const fetchNews = useCallback(async () => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    const companyNames = selectedCompanies.includes('All')
      ? companies.map(c => c.name)
      : selectedCompanies;
    const categoryFilter = selectedCategory === 'All' ? categories.slice(1) : [selectedCategory];

    const cacheKey = `${companyNames.join(',')}_${categoryFilter.join(',')}`;

    // Check cache
    if (
      cacheRef.current.key === cacheKey &&
      cacheRef.current.data &&
      Date.now() - cacheRef.current.timestamp < CACHE_DURATION
    ) {
      setArticles(cacheRef.current.data);
      setLastUpdated(cacheRef.current.timestamp);
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
          max_tokens: 4096,
          tools: [{
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 10,
          }],
          system: `You are a financial research assistant for Permira, a global private equity firm.
Search for recent news (last 30 days) about the selected portfolio companies and their competitive landscapes. Return results as JSON only, no prose.
Format: { "articles": [ { "title": "...", "summary": "...", "company": "...", "category": "...", "source": "...", "date": "YYYY-MM-DD", "sentiment": "...", "url": "..." } ] }
Sentiment must be one of: "positive", "neutral", "negative"
Category must be one of: "Company News", "Competitor Activity", "End Market Trends", "M&A", "Earnings"
Return 15-20 articles. Prioritize high-signal financial and strategic news.`,
          messages: [{
            role: 'user',
            content: `Search for recent news about: ${companyNames.join(', ')}. Focus on: ${categoryFilter.join(', ')}. Include competitive dynamics and end market context.`,
          }],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract JSON from response content
      let parsed = null;
      for (const block of data.content) {
        if (block.type === 'text' && block.text) {
          // Try to parse the text as JSON, or extract JSON from it
          const jsonMatch = block.text.match(/\{[\s\S]*"articles"[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsed = JSON.parse(jsonMatch[0]);
            } catch (e) {
              // continue
            }
          }
        }
      }

      if (parsed?.articles) {
        setArticles(parsed.articles);
        setLastUpdated(Date.now());
        cacheRef.current = { data: parsed.articles, timestamp: Date.now(), key: cacheKey };
      } else {
        throw new Error('Could not parse articles from API response');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCompanies, selectedCategory, apiKey]);

  // Fetch on mount and when filters change (only if key is set)
  useEffect(() => {
    if (apiKey) fetchNews();
  }, [fetchNews]);

  const filteredArticles = articles.filter(a => {
    if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
    if (!selectedCompanies.includes('All')) {
      if (!selectedCompanies.some(c => c.toLowerCase() === (a.company || '').toLowerCase())) return false;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Live News</h2>
          <p className="text-sm text-permira-text-secondary mt-1">
            Real-time portfolio and market intelligence powered by Claude
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[10px] text-permira-text-secondary/60 uppercase tracking-wider">
              Last updated {getTimeSinceUpdate()}
            </span>
          )}
          <button
            onClick={fetchNews}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-permira-orange/20 text-permira-orange rounded-lg text-xs font-medium hover:bg-permira-orange/30 transition-colors disabled:opacity-50"
          >
            <motion.span
              animate={loading ? { rotate: 360 } : {}}
              transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              className="inline-block"
            >
              ↻
            </motion.span>
            Refresh News
          </button>
        </div>
      </div>

      {/* API Key input */}
      {showKeyInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-permira-card border border-permira-border rounded-xl p-4 mb-4"
        >
          <div className="text-xs uppercase tracking-widest text-permira-text-secondary mb-2">Anthropic API Key</div>
          <p className="text-xs text-permira-text-secondary/60 mb-3">Enter your API key to fetch live news. It's stored in your browser only.</p>
          <form onSubmit={(e) => { e.preventDefault(); saveApiKey(e.target.elements.key.value); }} className="flex gap-2">
            <input
              name="key"
              type="password"
              defaultValue={apiKey}
              placeholder="sk-ant-api03-..."
              className="flex-1 px-3 py-2 bg-permira-dark border border-permira-border rounded-lg text-xs font-mono text-permira-text focus:outline-none focus:ring-1 focus:ring-permira-orange/50"
            />
            <button type="submit" className="px-4 py-2 bg-permira-orange text-white rounded-lg text-xs font-medium hover:bg-permira-orange/90 transition-colors">
              Save
            </button>
          </form>
        </motion.div>
      )}

      {/* Change key button (when key is set but hidden) */}
      {!showKeyInput && apiKey && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setShowKeyInput(true)}
            className="text-[10px] text-permira-text-secondary/40 hover:text-permira-text-secondary transition-colors"
          >
            Change API Key
          </button>
        </div>
      )}

      {/* Company filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <button
          onClick={() => toggleCompany('All')}
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
            selectedCompanies.includes('All')
              ? 'bg-permira-orange text-white'
              : 'bg-permira-card border border-permira-border text-permira-text-secondary hover:text-permira-text'
          }`}
        >
          All
        </button>
        {companies.map(c => (
          <button
            key={c.slug}
            onClick={() => toggleCompany(c.name)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              selectedCompanies.includes(c.name)
                ? 'text-white'
                : 'bg-permira-card border border-permira-border text-permira-text-secondary hover:text-permira-text'
            }`}
            style={selectedCompanies.includes(c.name) ? { backgroundColor: c.color } : {}}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: selectedCompanies.includes(c.name) ? 'white' : c.color }}
            />
            {c.name}
          </button>
        ))}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-permira-orange text-white'
                : 'bg-permira-card border border-permira-border text-permira-text-secondary hover:text-permira-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <ErrorCard error={error} onRetry={fetchNews} />
      )}

      {!loading && !error && filteredArticles.length === 0 && articles.length > 0 && (
        <div className="text-center py-12 text-permira-text-secondary text-sm">
          No articles match the current filters.
        </div>
      )}

      {!loading && !error && articles.length === 0 && !lastUpdated && (
        <div className="text-center py-12 text-permira-text-secondary text-sm">
          Click "Refresh News" to fetch the latest articles.
        </div>
      )}

      {!loading && !error && filteredArticles.length > 0 && (
        <div className="space-y-3">
          {filteredArticles.map((article, i) => (
            <NewsCard key={`${article.title}-${i}`} article={article} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
