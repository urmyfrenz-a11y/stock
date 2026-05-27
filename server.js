/**
 * StockVision Backend Server
 * - Yahoo Finance API 프록시 (CORS 우회)
 * - 정적 파일 서빙
 * - 응답 캐싱 (30초)
 */

const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

// ── 지수 심볼 매핑 ─────────────────────────────────────────────
const SYMBOLS = {
  kospi:  '^KS11',
  kosdaq: '^KQ11',
  nasdaq: '^IXIC',
  sp500:  '^GSPC',
};

// ── Yahoo Finance 요청 헤더 ────────────────────────────────────
const YF_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept':          'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.5',
  'Referer':         'https://finance.yahoo.com/',
  'Origin':          'https://finance.yahoo.com',
};

// ── 간단한 메모리 캐시 ─────────────────────────────────────────
const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > entry.ttl) { cache.delete(key); return null; }
  return entry.data;
}

function setCached(key, data, ttl = 30_000) {
  cache.set(key, { data, ts: Date.now(), ttl });
}

// ── Yahoo Finance fetch 헬퍼 ───────────────────────────────────
async function yfFetch(url, cacheTTL = 30_000) {
  const cached = getCached(url);
  if (cached) return cached;

  const res = await fetch(url, { headers: YF_HEADERS, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Yahoo Finance HTTP ${res.status}`);

  const json = await res.json();
  setCached(url, json, cacheTTL);
  return json;
}

// ── 미들웨어 ───────────────────────────────────────────────────
app.use(express.static(path.join(__dirname)));   // index.html + js/css
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// ── GET /api/quotes  (현재 시세 스냅샷) ───────────────────────
app.get('/api/quotes', async (req, res) => {
  try {
    const symbols = Object.values(SYMBOLS).map(encodeURIComponent).join(',');
    const fields  = [
      'regularMarketPrice',
      'regularMarketChange',
      'regularMarketChangePercent',
      'regularMarketDayHigh',
      'regularMarketDayLow',
      'regularMarketVolume',
      'regularMarketPreviousClose',
      'regularMarketTime',
      'marketState',
      'shortName',
    ].join(',');

    const url  = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=${fields}`;
    const data = await yfFetch(url, 30_000);

    const results = data?.quoteResponse?.result ?? [];
    const quotes  = {};

    for (const r of results) {
      const key = Object.keys(SYMBOLS).find(k => SYMBOLS[k] === r.symbol);
      if (!key) continue;
      quotes[key] = {
        price:         r.regularMarketPrice,
        change:        r.regularMarketChange,
        changePercent: r.regularMarketChangePercent,
        dayHigh:       r.regularMarketDayHigh,
        dayLow:        r.regularMarketDayLow,
        volume:        r.regularMarketVolume,
        prevClose:     r.regularMarketPreviousClose,
        marketState:   r.marketState,       // REGULAR | PRE | POST | CLOSED
        updatedAt:     r.regularMarketTime, // Unix timestamp
      };
    }

    if (Object.keys(quotes).length === 0) {
      throw new Error('Yahoo Finance returned empty quote response');
    }

    res.json({ ok: true, data: quotes });
  } catch (err) {
    console.error('[/api/quotes]', err.message);
    res.status(502).json({ ok: false, error: err.message });
  }
});

// ── GET /api/chart/:key?range=2H  (시계열 차트 데이터) ────────
app.get('/api/chart/:key', async (req, res) => {
  const { key }  = req.params;
  const symbol   = SYMBOLS[key];
  if (!symbol) return res.status(400).json({ ok: false, error: '알 수 없는 지수 키' });

  const range = (req.query.range || '2H').toUpperCase();

  // range → Yahoo Finance 파라미터 매핑
  const rangeMap = {
    '1H': { yRange: '1d',  yInterval: '1m'  },
    '2H': { yRange: '1d',  yInterval: '1m'  },
    '1D': { yRange: '1d',  yInterval: '5m'  },
    '1W': { yRange: '5d',  yInterval: '30m' },
  };
  const { yRange, yInterval } = rangeMap[range] ?? rangeMap['2H'];

  // 최대 반환 포인트 수
  const limitMap = { '1H': 60, '2H': 120, '1D': null, '1W': null };
  const limit    = limitMap[range] ?? null;

  const url      = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${yInterval}&range=${yRange}&includePrePost=false`;

  try {
    const data   = await yfFetch(url, 60_000); // 1분 캐시
    const result = data?.chart?.result?.[0];
    if (!result) throw new Error('차트 데이터 없음 (시장 휴장 중일 수 있습니다)');

    const timestamps = result.timestamp ?? [];
    const closes     = result.indicators?.quote?.[0]?.close ?? [];

    let points = timestamps
      .map((t, i) => ({ t: t * 1000, price: closes[i] }))
      .filter(p => p.price != null && isFinite(p.price));

    if (points.length === 0) throw new Error('유효한 가격 데이터 없음');

    if (limit) points = points.slice(-limit);

    res.json({ ok: true, data: points, meta: { range, symbol, count: points.length } });
  } catch (err) {
    console.error(`[/api/chart/${key}]`, err.message);
    res.status(502).json({ ok: false, error: err.message });
  }
});

// ── 상태 확인 ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), cacheSize: cache.size });
});

// ── 서버 시작 ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n📈 StockVision server started`);
  console.log(`   → http://localhost:${PORT}\n`);
});
