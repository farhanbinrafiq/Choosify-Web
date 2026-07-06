const { GoogleGenAI } = require('@google/genai');

const CATALOG_API = (
  process.env.CATALOG_API_BASE_URL || 'https://dashboard.choosify.bd/api/v1'
).replace(/\/$/, '');

const CACHE_TTL_MS = 5 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 40;

/** @type {{ products: object[]; brands: object[]; deals: object[]; fetchedAt: number }} */
let catalogCache = { products: [], brands: [], deals: [], fetchedAt: 0 };

/** @type {Map<string, { count: number; resetAt: number }>} */
const rateLimit = new Map();

async function fetchCatalog(path) {
  try {
    const response = await fetch(`${CATALOG_API}${path}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function getCatalog() {
  if (Date.now() - catalogCache.fetchedAt < CACHE_TTL_MS) {
    return catalogCache;
  }
  const [products, brands, deals] = await Promise.all([
    fetchCatalog('/catalog/products'),
    fetchCatalog('/catalog/brands'),
    fetchCatalog('/catalog/deals?status=live'),
  ]);
  catalogCache = {
    products: Array.isArray(products) ? products : [],
    brands: Array.isArray(brands) ? brands : [],
    deals: Array.isArray(deals) ? deals : [],
    fetchedAt: Date.now(),
  };
  return catalogCache;
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s৳]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreText(text, terms) {
  const hay = String(text || '').toLowerCase();
  return terms.reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0);
}

function buildCatalogContext(query, catalog) {
  const terms = tokenize(query);
  if (!terms.length) {
    return { snippet: 'No specific catalog matches for this query.', picks: [] };
  }

  const products = (catalog.products || [])
    .filter((p) => !p.status || p.status === 'live')
    .map((p) => ({
      id: p.id,
      slug: p.slug || p.id,
      title: p.title,
      brand: p.brand || p.brandName,
      category: p.category,
      price: p.price,
      url: `/products/${encodeURIComponent(p.slug || p.id)}`,
      _score: scoreText(`${p.title} ${p.brand} ${p.brandName} ${p.category}`, terms),
    }))
    .filter((p) => p._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 8);

  const brands = (catalog.brands || [])
    .map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category,
      url: `/brands/${encodeURIComponent(b.slug || b.id)}`,
      _score: scoreText(`${b.name} ${b.category} ${b.description}`, terms),
    }))
    .filter((b) => b._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 5);

  const deals = (catalog.deals || [])
    .map((d) => ({
      id: d.id,
      title: d.name || d.title || 'Deal',
      brand: d.seller || d.brandName,
      discount: d.discountValue ? `${d.discountValue}${d.discountType === 'percentage' ? '%' : ' BDT'}` : '',
      url: '/deals',
      _score: scoreText(`${d.name} ${d.title} ${d.seller} ${d.brandName}`, terms),
    }))
    .filter((d) => d._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);

  const picks = [
    ...products.map((p) => ({ type: 'product', ...p })),
    ...brands.map((b) => ({ type: 'brand', ...b })),
    ...deals.map((d) => ({ type: 'deal', ...d })),
  ].slice(0, 10);

  const lines = [];
  if (products.length) {
    lines.push('PRODUCTS:');
    products.forEach((p) => {
      lines.push(
        `- ${p.title} (${p.brand || 'Brand'}) — BDT ${p.price ?? 'N/A'} — ${p.url}`,
      );
    });
  }
  if (brands.length) {
    lines.push('BRANDS:');
    brands.forEach((b) => {
      lines.push(`- ${b.name} (${b.category || 'General'}) — ${b.url}`);
    });
  }
  if (deals.length) {
    lines.push('DEALS:');
    deals.forEach((d) => {
      lines.push(`- ${d.title} (${d.brand || 'Brand'}) — ${d.discount || 'Offer'} — ${d.url}`);
    });
  }

  return {
    snippet: lines.length ? lines.join('\n') : 'No strong catalog matches; suggest browsing /products, /brands, or /deals.',
    picks: picks.map(({ _score, ...rest }) => rest),
  };
}

function checkRateLimit(ip) {
  const key = ip || 'anonymous';
  const now = Date.now();
  const entry = rateLimit.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

const EMI_SYSTEM = `You are Emi, Choosify's friendly shopping assistant for Bangladesh (choosify.bd).

Rules:
- Help users discover products, brands, deals, guides, and comparisons on Choosify.
- ONLY recommend items from the CATALOG SNIPPET when listing specific products or prices.
- Prices are in BDT (৳). Be concise, warm, and practical.
- Include markdown links like [Product Name](/products/slug) when suggesting items from the snippet.
- If the catalog snippet is empty, suggest browsing Categories, Deals, Compare, or Guides — do not invent products.
- Do not give medical, legal, or financial advice beyond shopping guidance.
- Keep replies under 180 words unless comparing multiple items.`;

function fallbackReply(query, catalogContext) {
  if (catalogContext.picks?.length) {
    const list = catalogContext.picks
      .slice(0, 5)
      .map((p) => {
        if (p.type === 'product') {
          return `• **${p.title}** (${p.brand}) — ৳${p.price ?? '—'} — [View](${p.url})`;
        }
        if (p.type === 'brand') {
          return `• **${p.name}** — [Browse brand](${p.url})`;
        }
        return `• **${p.title}** — [Deals](${p.url})`;
      })
      .join('\n');
    return `Hi! I'm **Emi**. Here are some Choosify picks for "${query}":\n\n${list}\n\nAsk me to compare items or narrow by budget.`;
  }
  return `Hi! I'm **Emi**, your Choosify guide. I can help you find products, brands, and deals in Bangladesh. Try asking:\n\n• "Phones under ৳30000"\n• "Best deals today"\n• "Compare formal wear brands"\n\nBrowse [Products](/products), [Deals](/deals), or [Compare](/compare) anytime.`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'anonymous';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please try again later.',
      reply: 'You have reached the hourly message limit for Emi. Please try again in a little while.',
    });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const pageContext = body.pageContext || {};
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const query = lastUser?.content || '';

  const catalog = await getCatalog();
  const catalogContext = buildCatalogContext(query, catalog);

  const pageLine = pageContext.pathname
    ? `User is currently on: ${pageContext.pathname}${pageContext.title ? ` (${pageContext.title})` : ''}.`
    : '';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      reply: fallbackReply(query, catalogContext),
      picks: catalogContext.picks,
      mode: 'fallback',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const historyText = messages
      .slice(-10)
      .map((m) => `${m.role === 'user' ? 'User' : 'Emi'}: ${m.content}`)
      .join('\n');

    const prompt = `${pageLine}

CATALOG SNIPPET (only recommend from this list):
${catalogContext.snippet}

Conversation:
${historyText}

Reply as Emi to the latest user message. Use markdown for links and short lists when helpful.`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: EMI_SYSTEM,
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    const reply =
      response?.text?.trim() ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      fallbackReply(query, catalogContext);

    return res.status(200).json({
      reply,
      picks: catalogContext.picks,
      mode: 'gemini',
    });
  } catch (err) {
    console.error('[emi/chat]', err);
    return res.status(200).json({
      reply: fallbackReply(query, catalogContext),
      picks: catalogContext.picks,
      mode: 'fallback',
      warning: 'AI temporarily unavailable',
    });
  }
};
