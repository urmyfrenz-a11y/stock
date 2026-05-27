/**
 * Main Application Logic
 * 실제 Yahoo Finance 데이터를 api.js 를 통해 가져와서 차트와 UI를 구동합니다.
 * 서버 연결 실패 시 mock 데이터로 자동 폴백합니다.
 */

// ── 상태 ─────────────────────────────────────────────────────────────────────
let usingRealData   = false;   // 실제 데이터 사용 여부
let secondsUntilUpd = 60;

// ── 카운트다운 ────────────────────────────────────────────────────────────────
function startCountdown() {
  secondsUntilUpd = 60;
  setInterval(() => {
    secondsUntilUpd = Math.max(0, secondsUntilUpd - 1);
    updateCountdownUI();
  }, 1000);
}

function updateCountdownUI() {
  const el  = document.getElementById('countdown');
  const bar = document.getElementById('countdown-bar');
  if (el)  el.textContent = secondsUntilUpd;
  if (bar) {
    const pct = ((60 - secondsUntilUpd) / 60) * 100;
    bar.style.width = `${pct}%`;
    bar.style.background =
      secondsUntilUpd <= 10 ? 'linear-gradient(90deg,#ef4444,#f97316)' :
      secondsUntilUpd <= 30 ? 'linear-gradient(90deg,#f59e0b,#10b981)' :
                              'linear-gradient(90deg,#00d4ff,#7c3aed)';
  }
}

// ── 티커 테이프 ───────────────────────────────────────────────────────────────
function buildTickerContent() {
  return Object.entries(INDICES).map(([key, config]) => {
    const s    = getIndexStats(key);
    const sign = s.isPositive ? '+' : '';
    const arr  = s.isPositive ? '▲' : '▼';
    const cls  = s.isPositive ? 'ticker-up' : 'ticker-down';
    return `
      <span class="ticker-item">
        <span class="ticker-name">${config.flag} ${config.nameEn}</span>
        <span class="ticker-price">${formatPrice(s.current, config)}</span>
        <span class="${cls}">${arr} ${sign}${s.changePercent.toFixed(2)}%</span>
      </span>
      <span class="ticker-sep">◆</span>`;
  }).join('') .repeat(2); // 무한 스크롤을 위해 2배 복사
}

function updateTicker() {
  const el = document.getElementById('ticker-content');
  if (el) el.innerHTML = buildTickerContent();
}

// ── 시장 상태 표시 ────────────────────────────────────────────────────────────
function updateMarketStatus() {
  const now    = new Date();
  const krTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const usTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

  const krH = krTime.getHours(), krM = krTime.getMinutes(), krD = krTime.getDay();
  const usH = usTime.getHours(), usM = usTime.getMinutes(), usD = usTime.getDay();

  const krOpen = krD >= 1 && krD <= 5 &&
    (krH > 9 || (krH === 9 && krM >= 0)) &&
    (krH < 15 || (krH === 15 && krM <= 30));

  const usOpen = usD >= 1 && usD <= 5 &&
    (usH > 9 || (usH === 9 && usM >= 30)) && usH < 16;

  setStatusBadge('market-krx', krOpen ? 'OPEN' : 'CLOSED');
  setStatusBadge('market-us',  usOpen ? 'OPEN' : 'CLOSED');

  const clockEl = document.getElementById('live-clock');
  if (clockEl) clockEl.textContent = now.toLocaleTimeString('ko-KR');
}

function setStatusBadge(id, status) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = status;
  el.className   = `market-status-badge ${status === 'OPEN' ? 'open' : 'closed'}`;
}

// ── 날짜 표시 ─────────────────────────────────────────────────────────────────
function updateDateDisplay() {
  const el = document.getElementById('current-date');
  if (el) el.textContent = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });
}

// ── 요약 바 ───────────────────────────────────────────────────────────────────
function updateSummaryRow() {
  for (const [key, config] of Object.entries(INDICES)) {
    const s   = getIndexStats(key);
    const el  = document.getElementById(`summary-${key}`);
    if (!el) continue;
    const sign = s.isPositive ? '+' : '';
    const arr  = s.isPositive ? '▲' : '▼';
    el.innerHTML = `
      <span class="summary-name">${config.flag} ${config.name}</span>
      <span class="summary-price">${formatPrice(s.current, config)}</span>
      <span class="summary-change ${s.isPositive ? 'positive' : 'negative'}">${arr} ${sign}${s.changePercent.toFixed(2)}%</span>`;
  }
}

// ── 탭 전환 (각 카드 독립) ────────────────────────────────────────────────────
function initTabSwitching() {
  document.querySelectorAll('.chart-card').forEach(card => {
    const tabGroup = card.querySelector('.tab-group');
    if (!tabGroup) return;
    const indexKey = card.id.replace('card-', '');

    tabGroup.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        switchTimeRange(tab.dataset.range, indexKey);
      });
    });
  });
}

async function switchTimeRange(range, indexKey) {
  if (usingRealData) {
    try {
      showCardLoading(indexKey, true);
      const points = await apiFetchChart(indexKey, range);
      if (points.length > 0) {
        dataStore[indexKey].prices = points.map(p => p.price);
        dataStore[indexKey].labels = points.map(p => tsToLabel(p.t));
        updateChart(indexKey);
        updatePriceCard(indexKey);
      }
    } catch (err) {
      console.warn(`[tab:${indexKey}] ${err.message}`);
    } finally {
      showCardLoading(indexKey, false);
    }
  } else {
    // mock 폴백
    const pointsMap  = { '1H': 60, '2H': 120, '1D': 390, '1W': 1680 };
    const intervalMap = { '1H': 1, '2H': 1, '1D': 1, '1W': 10 };
    const config = INDICES[indexKey];
    dataStore[indexKey].prices = generatePriceHistory(config.basePrice, config.volatility, pointsMap[range] || 120);
    dataStore[indexKey].labels = generateTimeLabels(pointsMap[range] || 120, intervalMap[range] || 1);
    updateChart(indexKey);
    updatePriceCard(indexKey);
  }
}

// ── 카드 로딩 오버레이 ────────────────────────────────────────────────────────
function showCardLoading(key, show) {
  const overlay = document.getElementById(`loading-${key}`);
  if (overlay) overlay.style.opacity = show ? '1' : '0';
}

// ── 업데이트 알림 ─────────────────────────────────────────────────────────────
function showUpdateNotification(isReal = true) {
  const el = document.getElementById('update-notif');
  if (!el) return;
  el.textContent = isReal ? '🔄  시세가 업데이트되었습니다' : '⚠️  서버 연결 실패 — mock 데이터 표시 중';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

// ── 데이터 소스 배지 ──────────────────────────────────────────────────────────
function setDataSourceBadge(isReal) {
  const el = document.getElementById('data-source-badge');
  if (!el) return;
  el.textContent = isReal ? '● LIVE' : '● DEMO';
  el.className   = `data-source-badge ${isReal ? 'live' : 'demo'}`;
}

// ── 초기 데이터 로드 ──────────────────────────────────────────────────────────
async function initData() {
  try {
    // 1. 모든 차트 데이터 가져오기
    const count = await loadAllCharts('2H');

    // 2. 현재 시세 가져오기 (prevClose, liveQuote 채우기)
    await loadAndApplyQuotes();

    if (count > 0) {
      usingRealData = true;
      console.log('✅ 실제 Yahoo Finance 데이터 로드 완료');
    } else {
      throw new Error('차트 데이터 없음');
    }
  } catch (err) {
    console.warn('⚠️ 실제 데이터 로드 실패 → mock 데이터 사용:', err.message);
    usingRealData = false;
    // mockData.js 의 initializeData() 는 이미 실행됨
  }

  setDataSourceBadge(usingRealData);
}

// ── 앱 진입점 ─────────────────────────────────────────────────────────────────
async function init() {
  updateDateDisplay();
  updateMarketStatus();

  // 1. 데이터 로드 (실제 or mock)
  await initData();

  // 2. 차트·UI 초기 렌더링
  initAllCharts();
  updateTicker();
  updateSummaryRow();
  startCountdown();

  // 3. 매초 시계 갱신
  setInterval(updateMarketStatus, 1000);

  // 4. 매 1분 시세 갱신
  setInterval(async () => {
    if (usingRealData) {
      try {
        await tickRealData();
        showUpdateNotification(true);
      } catch (err) {
        console.error('[1min tick]', err.message);
        tickAllCharts(); // mock 폴백
        showUpdateNotification(false);
      }
    } else {
      tickAllCharts();
    }
    updateTicker();
    updateSummaryRow();
    secondsUntilUpd = 60;
  }, 60_000);

  // 5. 탭 이벤트 바인딩
  initTabSwitching();

  // 6. 리사이즈 대응
  window.addEventListener('resize', () => {
    Object.keys(INDICES).forEach(key => chartInstances[key]?.resize());
  });
}

document.addEventListener('DOMContentLoaded', init);
