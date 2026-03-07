export async function fetchNewsForCompany(companyName) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 2,
        },
      ],
      system: `Search for recent news about ${companyName}. Return ONLY valid JSON: {"articles":[{"title":"...","summary":"1-2 sentences","category":"Company News|Competitor Activity|End Market Trends|M&A|Earnings","source":"...","date":"YYYY-MM-DD","sentiment":"positive|neutral|negative","url":"..."}]}. Return exactly 5 articles.`,
      messages: [
        {
          role: 'user',
          content: `Latest news about ${companyName}. Focus on business developments, partnerships, product launches, market trends, and competitive dynamics.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Claude API error: ${response.status}`);
  }

  const data = await response.json();
  let parsed = null;

  for (const block of data.content) {
    if (block.type === 'text' && block.text) {
      const jsonMatch = block.text.match(/\{[\s\S]*"articles"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          // continue looking
        }
      }
    }
  }

  if (!parsed?.articles) {
    throw new Error('Could not parse articles from Claude response');
  }

  return parsed.articles;
}
