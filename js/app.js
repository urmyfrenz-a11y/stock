/**
 * Main Application Logic
 * Handles UI interactions, ticker, and update scheduling
 */

// ── Countdown Timer ──────────────────────────────────────────────────────────
let secondsUntilUpdate = 60;
let countdownInterval = null;
let updateInterval = null;

function startCountdown() {
  secondsUntilUpdate = 60;
  updateCountdownUI();

  countdownInterval = setInterval(() => {
    secondsUntilUpdate--;
    if (secondsUntilUpdate <= 0) {
      secondsUntilUpdate = 60;
    }
    updateCountdownUI();
  }, 1000);
}

function updateCountdownUI() {
  const el = document.getElementById('countdown');
  const bar = document.getElementById('countdown-bar');
  if (el) el.textContent = secondsUntilUpdate;

  if (bar) {
    const pct = ((60 - secondsUntilUpdate) / 60) * 100;
    bar.style.width = `${pct}%`;

    // Color transitions as it approaches update
    if (secondsUntilUpdate <= 10) {
      bar.style.background = 'linear-gradient(90deg, #ef4444, #f97316)';
    } else if (secondsUntilUpdate <= 30) {
      bar.style.background = 'linear-gradient(90deg, #f59e0b, #10b981)';
    } else {
      bar.style.background = 'linear-gradient(90deg, #00d4ff, #7c3aed)';
    }
  }
}

// ── Ticker Tape ──────────────────────────────────────────────────────────────
function buildTickerContent() {
  const tickerData = Object.entries(INDICES).map(([key, config]) => {
    const stats = getIndexStats(key);
    const sign = stats.isPositive ? '+' : '';
    const arrow = stats.isPositive ? '▲' : '▼';
    const cls = stats.isPositive ? 'ticker-up' : 'ticker-down';

    return `
      <span class="ticker-item">
        <span class="ticker-name">${config.flag} ${config.nameEn}</span>
        <span class="ticker-price">${formatPrice(stats.current, config)}</span>
        <span class="${cls}">${arrow} ${sign}${stats.changePercent.toFixed(2)}%</span>
      </span>
      <span class="ticker-sep">◆</span>
    `;
  });

  // Duplicate for seamless loop
  return tickerData.join('') + tickerData.join('');
}

function updateTicker() {
  const ticker = document.getElementById('ticker-content');
  if (ticker) {
    ticker.innerHTML = buildTickerContent();
  }
}

// ── Market Status ────────────────────────────────────────────────────────────
function updateMarketStatus() {
  const now = new Date();
  const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const usTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const koreaHour = koreaTime.getHours();
  const koreaMin = koreaTime.getMinutes();
  const usHour = usTime.getHours();
  const usDay = usTime.getDay();

  // KRX: 09:00 - 15:30 weekdays
  const krxOpen = (koreaHour > 9 || (koreaHour === 9 && koreaMin >= 0)) &&
                  (koreaHour < 15 || (koreaHour === 15 && koreaMin <= 30));
  const krxWeekday = koreaTime.getDay() >= 1 && koreaTime.getDay() <= 5;
  const krxStatus = krxOpen && krxWeekday;

  // US: 09:30 - 16:00 ET weekdays
  const usOpen = (usHour > 9 || (usHour === 9 && usTime.getMinutes() >= 30)) && usHour < 16;
  const usWeekday = usDay >= 1 && usDay <= 5;
  const usStatus = usOpen && usWeekday;

  setMarketStatus('market-krx', krxStatus ? 'OPEN' : 'CLOSED');
  setMarketStatus('market-us', usStatus ? 'OPEN' : 'CLOSED');

  // Update clock
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    clockEl.textContent = timeStr;
  }
}

function setMarketStatus(elementId, status) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = status;
  el.className = `market-status-badge ${status === 'OPEN' ? 'open' : 'closed'}`;
}

// ── Date Display ────────────────────────────────────────────────────────────
function updateDateDisplay() {
  const now = new Date();
  const dateEl = document.getElementById('current-date');
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }
}

// ── Tab switching (per-card, independent) ──────────────────────────────────
function initTabSwitching() {
  // Each chart card manages its own tab group independently
  document.querySelectorAll('.chart-card').forEach(card => {
    const tabGroup = card.querySelector('.tab-group');
    if (!tabGroup) return;

    const indexKey = card.id.replace('card-', '');

    tabGroup.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        // Deactivate siblings within same tab group only
        tabGroup.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        switchTimeRange(tab.dataset.range, indexKey);
      });
    });
  });
}

function switchTimeRange(range, indexKey) {
  const pointsMap = { '1H': 60, '2H': 120, '1D': 390, '1W': 1680 };
  const intervalMap = { '1H': 1, '2H': 1, '1D': 1, '1W': 10 };

  const points   = pointsMap[range]   || 120;
  const interval = intervalMap[range] || 1;

  const config = INDICES[indexKey];
  const prices = generatePriceHistory(config.basePrice, config.volatility, points);
  const labels = generateTimeLabels(points, interval);

  dataStore[indexKey].prices = prices;
  dataStore[indexKey].labels = labels;
  updateChart(indexKey);
  updatePriceCard(indexKey);
}

// ── Mini Sparkline summary ────────────────────────────────────────────────────
function updateSummaryRow() {
  for (const [key, config] of Object.entries(INDICES)) {
    const stats = getIndexStats(key);
    const summaryEl = document.getElementById(`summary-${key}`);
    if (!summaryEl) continue;

    const sign = stats.isPositive ? '+' : '';
    const arrow = stats.isPositive ? '▲' : '▼';
    const cls = stats.isPositive ? 'positive' : 'negative';

    summaryEl.innerHTML = `
      <span class="summary-name">${config.flag} ${config.name}</span>
      <span class="summary-price">${formatPrice(stats.current, config)}</span>
      <span class="summary-change ${cls}">${arrow} ${sign}${stats.changePercent.toFixed(2)}%</span>
    `;
  }
}

// ── Main initialization ──────────────────────────────────────────────────────
function init() {
  // Initial render
  initAllCharts();
  updateTicker();
  updateSummaryRow();
  updateMarketStatus();
  updateDateDisplay();
  startCountdown();

  // Update clock every second
  setInterval(() => {
    updateMarketStatus();
  }, 1000);

  // Update charts every minute
  updateInterval = setInterval(() => {
    tickAllCharts();
    updateTicker();
    updateSummaryRow();
    secondsUntilUpdate = 60;

    // Flash notification
    showUpdateNotification();
  }, 60 * 1000);

  // Initialize tab switching
  initTabSwitching();

  // Handle window resize
  window.addEventListener('resize', () => {
    for (const key of Object.keys(INDICES)) {
      if (chartInstances[key]) {
        chartInstances[key].resize();
      }
    }
  });
}

function showUpdateNotification() {
  const notif = document.getElementById('update-notif');
  if (!notif) return;

  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 2500);
}

// ── Start app when DOM ready ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
