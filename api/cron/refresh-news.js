import { companies } from '../_lib/companies.js';
import { setCachedNews } from '../_lib/cache.js';
import { fetchNewsForCompany } from '../_lib/claude.js';

export async function GET(request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Starting news refresh for all companies...');

  const results = await Promise.allSettled(
    companies.map(async (company) => {
      const articles = await fetchNewsForCompany(company.name);
      setCachedNews(company.slug, articles);
      return { slug: company.slug, count: articles.length };
    })
  );

  const summary = results.map((r, i) => ({
    company: companies[i].slug,
    status: r.status,
    ...(r.status === 'fulfilled' ? r.value : { error: r.reason?.message }),
  }));

  console.log('News refresh complete:', JSON.stringify(summary));

  return Response.json({ refreshed: summary });
}
