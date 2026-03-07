import { companies, getCompanyBySlug } from './_lib/companies.js';
import { getCachedNews, setCachedNews, getAllCachedNews } from './_lib/cache.js';
import { fetchNewsForCompany } from './_lib/claude.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');

  try {
    // Single company
    if (company) {
      const companyInfo = getCompanyBySlug(company);
      if (!companyInfo) {
        return Response.json({ error: `Unknown company: ${company}` }, { status: 404 });
      }

      // Try cache first
      const cached = getCachedNews(company);
      if (cached) {
        return Response.json({
          company,
          articles: cached.articles,
          cached: true,
          timestamp: cached.timestamp,
        });
      }

      // Cache miss — fetch live
      const articles = await fetchNewsForCompany(companyInfo.name);
      const saved = setCachedNews(company, articles);
      return Response.json({
        company,
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

    return Response.json(results);
  } catch (err) {
    console.error('News API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
