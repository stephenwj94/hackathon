import { companies, getCompanyBySlug } from './_lib/companies.js';
import { getCachedNews, setCachedNews, getAllCachedNews } from './_lib/cache.js';
import { fetchNewsForCompany } from './_lib/claude.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { company } = req.query;

  try {
    // Single company
    if (company) {
      const companyInfo = getCompanyBySlug(company);
      if (!companyInfo) {
        return res.status(404).json({ error: `Unknown company: ${company}` });
      }

      // Try cache first
      const cached = getCachedNews(company);
      if (cached) {
        return res.status(200).json({
          company: company,
          articles: cached.articles,
          cached: true,
          timestamp: cached.timestamp,
        });
      }

      // Cache miss — fetch live
      const articles = await fetchNewsForCompany(companyInfo.name);
      const saved = setCachedNews(company, articles);
      return res.status(200).json({
        company: company,
        articles: saved.articles,
        cached: false,
        timestamp: saved.timestamp,
      });
    }

    // All companies
    const allCached = getAllCachedNews();
    const results = {};
    for (const c of companies) {
      if (allCached[c.slug]) {
        results[c.slug] = {
          articles: allCached[c.slug].articles,
          timestamp: allCached[c.slug].timestamp,
          cached: true,
        };
      }
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error('News API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
