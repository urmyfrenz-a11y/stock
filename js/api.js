/**
 * Frontend API Client
 * 백엔드 /api/* 엔드포인트를 호출하여 실제 시세 데이터를 가져옵니다.
 */

// ── 현재 시세 (가격·등락·고저가·거래량) ──────────────────────
async function apiFetchQuotes() {
  const res  = await fetch('/api/quotes');
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'quotes API 오류');
  return json.data;
}

// ── 시계열 차트 데이터 ─────────────────────────────────────────
async function apiFetchChart(key, range = '2H') {
  const res  = await fetch(`/api/chart/${key}?range=${range}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || `chart API 오류 (${key})`);
  return json.data; // [{ t: ms, price: number }, ...]
}

// ── 타임스탬프 → "HH:MM" 레이블 변환 ──────────────────────────
function tsToLabel(ms) {
  const d = new Date(ms);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

// ── 모든 차트 데이터를 가져와 dataStore 업데이트 ───────────────
async function loadAllCharts(range = '2H') {
  const keys    = Object.keys(INDICES);
  const results = await Promise.allSettled(
    keys.map(key => apiFetchChart(key, range))
  );

  let successCount = 0;

  results.forEach((result, i) => {
    const key = keys[i];
    if (result.status === 'fulfilled' && result.value.length > 0) {
      const points = result.value;
      dataStore[key].prices = points.map(p => p.price);
      dataStore[key].labels = points.map(p => tsToLabel(p.t));
      successCount++;
      console.log(`[chart:${key}] ✅ ${points.length}개 데이터 포인트 로드`);
    } else {
      const reason = result.reason?.message ?? '응답 없음';
      console.warn(`[chart:${key}] ⚠️ 실패 → mock 데이터 사용 (${reason})`);
    }
  });

  return successCount;
}

// ── 현재 시세를 가져와 dataStore + UI 업데이트 ────────────────
async function loadAndApplyQuotes() {
  const quotes = await apiFetchQuotes();

  for (const [key, q] of Object.entries(quotes)) {
    if (!dataStore[key]) continue;

    dataStore[key].prevClose = q.prevClose;
    dataStore[key].liveQuote = q; // { price, change, changePercent, dayHigh, dayLow, volume, marketState }

    // 차트가 비어 있으면 현재가라도 채워 넣기
    if (dataStore[key].prices.length === 0) {
      dataStore[key].prices = [q.price];
      dataStore[key].labels = [tsToLabel(Date.now())];
    }
  }

  return quotes;
}

// ── 매 1분 틱: 최신 시세를 차트 데이터에 롤링 추가 ────────────
async function tickRealData() {
  let quotes;
  try {
    quotes = await loadAndApplyQuotes();
  } catch (err) {
    console.error('[tick] 시세 갱신 실패:', err.message);
    // fallback: mock tick
    tickAllCharts();
    return;
  }

  const nowLabel = tsToLabel(Date.now());

  for (const [key, q] of Object.entries(quotes)) {
    if (!dataStore[key]) continue;

    const prices = dataStore[key].prices;
    const labels = dataStore[key].labels;

    // 현재가를 차트 끝에 추가하고 가장 오래된 포인트 제거 (롤링 윈도우)
    prices.push(q.price);
    labels.push(nowLabel);

    // 최대 120개 포인트 유지 (2시간)
    if (prices.length > 240) { prices.shift(); labels.shift(); }

    dataStore[key].prevClose = q.prevClose;

    updateChart(key);
    updatePriceCard(key);
  }
}
