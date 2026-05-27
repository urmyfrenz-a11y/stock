/**
 * Mock Data Generator for Stock Index Charts
 * Generates realistic-looking stock index data using random walk algorithm
 */

const INDICES = {
  kospi: {
    name: '코스피',
    nameEn: 'KOSPI',
    basePrice: 2650,
    volatility: 0.003,
    color: '#00d4ff',
    gradientStart: 'rgba(0, 212, 255, 0.3)',
    gradientEnd: 'rgba(0, 212, 255, 0.0)',
    currency: '',
    suffix: '',
    flag: '🇰🇷',
    market: 'KRX',
  },
  kosdaq: {
    name: '코스닥',
    nameEn: 'KOSDAQ',
    basePrice: 780,
    volatility: 0.004,
    color: '#7c3aed',
    gradientStart: 'rgba(124, 58, 237, 0.3)',
    gradientEnd: 'rgba(124, 58, 237, 0.0)',
    currency: '',
    suffix: '',
    flag: '🇰🇷',
    market: 'KRX',
  },
  nasdaq: {
    name: '나스닥',
    nameEn: 'NASDAQ',
    basePrice: 17850,
    volatility: 0.0025,
    color: '#f59e0b',
    gradientStart: 'rgba(245, 158, 11, 0.3)',
    gradientEnd: 'rgba(245, 158, 11, 0.0)',
    currency: '$',
    suffix: '',
    flag: '🇺🇸',
    market: 'NASDAQ',
  },
  sp500: {
    name: 'S&P 500',
    nameEn: 'S&P500',
    basePrice: 5320,
    volatility: 0.002,
    color: '#10b981',
    gradientStart: 'rgba(16, 185, 129, 0.3)',
    gradientEnd: 'rgba(16, 185, 129, 0.0)',
    currency: '$',
    suffix: '',
    flag: '🇺🇸',
    market: 'NYSE',
  },
};

// Seeded random for consistent initial data
let seed = 42;
function seededRandom() {
  seed = (seed * 1664525 + 1013904223) & 0xffffffff;
  return ((seed >>> 0) / 0xffffffff);
}

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * Generate historical price data using random walk
 * @param {number} basePrice - Starting price
 * @param {number} volatility - Volatility factor
 * @param {number} points - Number of data points
 * @param {boolean} useSeeded - Use seeded random for reproducibility
 */
function generatePriceHistory(basePrice, volatility, points = 390, useSeeded = false) {
  const prices = [];
  let price = basePrice * (1 + (useSeeded ? (seededRandom() - 0.5) : (Math.random() - 0.5)) * 0.02);

  // Add slight trend component
  const trendStrength = (Math.random() - 0.48) * 0.0002;

  for (let i = 0; i < points; i++) {
    const change = gaussianRandom(trendStrength, volatility);
    price = price * (1 + change);

    // Mean reversion: pull price back toward basePrice slowly
    const reversionForce = (basePrice - price) / basePrice * 0.005;
    price = price * (1 + reversionForce);

    prices.push(parseFloat(price.toFixed(2)));
  }
  return prices;
}

/**
 * Generate time labels for the past N minutes
 * @param {number} points - Number of data points
 * @param {number} intervalMinutes - Interval in minutes
 */
function generateTimeLabels(points, intervalMinutes = 1) {
  const labels = [];
  const now = new Date();

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now - i * intervalMinutes * 60 * 1000);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    labels.push(`${hours}:${minutes}`);
  }
  return labels;
}

/**
 * Initialize data stores for all indices
 */
const dataStore = {};

function initializeData() {
  const HISTORY_POINTS = 120; // 2 hours of per-minute data

  for (const [key, config] of Object.entries(INDICES)) {
    const prices = generatePriceHistory(config.basePrice, config.volatility, HISTORY_POINTS, true);
    const labels = generateTimeLabels(HISTORY_POINTS);

    dataStore[key] = {
      prices,
      labels,
      openPrice: prices[0],
      prevClose: config.basePrice * (1 + (Math.random() - 0.5) * 0.01),
    };
  }
}

/**
 * Add a new data point to the store (simulating real-time update)
 */
function updateDataPoint(indexKey) {
  const config = INDICES[indexKey];
  const store = dataStore[indexKey];
  const lastPrice = store.prices[store.prices.length - 1];

  // Generate new price
  const change = gaussianRandom(0, config.volatility);
  const reversionForce = (config.basePrice - lastPrice) / config.basePrice * 0.003;
  const newPrice = parseFloat((lastPrice * (1 + change + reversionForce)).toFixed(2));

  // Add new point
  store.prices.push(newPrice);
  store.prices.shift(); // Remove oldest point

  // Update time labels
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  store.labels.push(`${hours}:${minutes}`);
  store.labels.shift();

  return {
    price: newPrice,
    change: newPrice - store.prevClose,
    changePercent: ((newPrice - store.prevClose) / store.prevClose) * 100,
  };
}

/**
 * Get current stats for an index.
 * 실제 시세가 있으면(liveQuote) 그 값을 우선 사용합니다.
 */
function getIndexStats(indexKey) {
  const store = dataStore[indexKey];
  const q     = store.liveQuote; // api.js 가 채워주는 실제 시세

  if (q) {
    // ── 실제 데이터 경로 ──────────────────────────────
    return {
      current:       q.price,
      prevClose:     q.prevClose ?? store.prevClose,
      change:        q.change,
      changePercent: q.changePercent,
      dayHigh:       q.dayHigh,
      dayLow:        q.dayLow,
      volume:        q.volume,
      marketState:   q.marketState,
      isPositive:    q.change >= 0,
    };
  }

  // ── Mock 폴백 (서버 미연결 / 시장 휴장 시) ──────────
  const currentPrice  = store.prices[store.prices.length - 1];
  const change        = currentPrice - store.prevClose;
  const changePercent = (change / store.prevClose) * 100;

  return {
    current:       currentPrice,
    prevClose:     store.prevClose,
    change,
    changePercent,
    dayHigh:       Math.max(...store.prices),
    dayLow:        Math.min(...store.prices),
    volume:        Math.floor(Math.random() * 900_000 + 100_000),
    marketState:   'CLOSED',
    isPositive:    change >= 0,
  };
}

// Initialize on load
initializeData();
