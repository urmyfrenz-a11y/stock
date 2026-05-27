/**
 * Chart Management Module
 * Handles creation and updating of stock index charts using Chart.js
 */

const chartInstances = {};

/**
 * Create a gradient for chart fill
 */
function createGradient(ctx, colorStart, colorEnd) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  return gradient;
}

/**
 * Determine chart colors based on price trend (last vs first point)
 */
function getTrendColors(prices, config) {
  const isPositive = prices[prices.length - 1] >= prices[0];
  if (isPositive) {
    return {
      line: config.color,
      gradientStart: config.gradientStart,
      gradientEnd: config.gradientEnd,
    };
  } else {
    return {
      line: '#ef4444',
      gradientStart: 'rgba(239, 68, 68, 0.25)',
      gradientEnd: 'rgba(239, 68, 68, 0.0)',
    };
  }
}

/**
 * Format price based on index type
 */
function formatPrice(price, config) {
  if (price >= 10000) {
    return price.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
  }
  return price.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

/**
 * Create a new chart for a given index
 */
function createChart(canvasId, indexKey) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const config = INDICES[indexKey];
  const store = dataStore[indexKey];
  const colors = getTrendColors(store.prices, config);

  // Destroy existing chart if any
  if (chartInstances[indexKey]) {
    chartInstances[indexKey].destroy();
  }

  const gradient = createGradient(ctx, colors.gradientStart, colors.gradientEnd);

  chartInstances[indexKey] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: store.labels,
      datasets: [{
        label: config.name,
        data: store.prices,
        borderColor: colors.line,
        borderWidth: 2,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.line,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 600,
        easing: 'easeInOutQuart',
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 20, 40, 0.95)',
          borderColor: colors.line,
          borderWidth: 1,
          padding: 12,
          titleColor: '#a0aec0',
          titleFont: { size: 12, family: "'Noto Sans KR', sans-serif" },
          bodyColor: '#ffffff',
          bodyFont: { size: 14, weight: 'bold', family: "'Noto Sans KR', sans-serif" },
          callbacks: {
            title: (items) => `⏰ ${items[0].label}`,
            label: (item) => {
              const price = item.raw;
              return ` ${config.name}: ${formatPrice(price, config)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            drawBorder: false,
          },
          ticks: {
            color: '#4a5568',
            font: { size: 10, family: "'Noto Sans KR', sans-serif" },
            maxTicksLimit: 8,
            maxRotation: 0,
          },
          border: { display: false },
        },
        y: {
          position: 'right',
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            drawBorder: false,
          },
          ticks: {
            color: '#4a5568',
            font: { size: 10, family: "'Noto Sans KR', sans-serif" },
            callback: (value) => {
              if (value >= 10000) return (value / 1000).toFixed(0) + 'k';
              return value.toLocaleString();
            },
          },
          border: { display: false },
        },
      },
    },
  });
}

/**
 * Update chart with new data
 */
function updateChart(indexKey) {
  const chart = chartInstances[indexKey];
  if (!chart) return;

  const store = dataStore[indexKey];
  const config = INDICES[indexKey];
  const colors = getTrendColors(store.prices, config);

  // Update data
  chart.data.labels = [...store.labels];
  chart.data.datasets[0].data = [...store.prices];

  // Update colors based on trend
  chart.data.datasets[0].borderColor = colors.line;

  // Recreate gradient on update
  const canvas = chart.canvas;
  const ctx = canvas.getContext('2d');
  chart.data.datasets[0].backgroundColor = createGradient(ctx, colors.gradientStart, colors.gradientEnd);

  chart.update('active');
}

/**
 * Update price display card
 */
function updatePriceCard(indexKey) {
  const stats = getIndexStats(indexKey);
  const config = INDICES[indexKey];

  const priceEl = document.getElementById(`${indexKey}-price`);
  const changeEl = document.getElementById(`${indexKey}-change`);
  const changePercentEl = document.getElementById(`${indexKey}-change-percent`);
  const highEl = document.getElementById(`${indexKey}-high`);
  const lowEl = document.getElementById(`${indexKey}-low`);
  const badge = document.getElementById(`${indexKey}-badge`);

  if (priceEl) {
    // Animate price change
    priceEl.classList.add('price-flash');
    setTimeout(() => priceEl.classList.remove('price-flash'), 500);
    priceEl.textContent = formatPrice(stats.current, config);
  }

  const sign = stats.isPositive ? '+' : '';
  const changeClass = stats.isPositive ? 'positive' : 'negative';
  const changeIcon = stats.isPositive ? '▲' : '▼';

  if (changeEl) {
    changeEl.textContent = `${changeIcon} ${sign}${stats.change.toFixed(2)}`;
    changeEl.className = `change-value ${changeClass}`;
  }

  if (changePercentEl) {
    changePercentEl.textContent = `(${sign}${stats.changePercent.toFixed(2)}%)`;
    changePercentEl.className = `change-percent ${changeClass}`;
  }

  if (highEl) highEl.textContent = formatPrice(stats.dayHigh, config);
  if (lowEl) lowEl.textContent = formatPrice(stats.dayLow, config);

  const volEl = document.getElementById(`${indexKey}-vol`);
  if (volEl) {
    const vol = stats.volume;
    volEl.textContent = vol >= 1000000
      ? (vol / 1000000).toFixed(1) + 'M'
      : vol >= 1000
        ? (vol / 1000).toFixed(0) + 'K'
        : vol.toLocaleString();
  }

  if (badge) {
    badge.className = `status-badge ${stats.isPositive ? 'badge-up' : 'badge-down'}`;
    badge.textContent = stats.isPositive ? '↑ 상승' : '↓ 하락';
  }

  // Update card border glow
  const card = document.getElementById(`card-${indexKey}`);
  if (card) {
    card.classList.remove('glow-positive', 'glow-negative');
    card.classList.add(stats.isPositive ? 'glow-positive' : 'glow-negative');
  }
}

/**
 * Initialize all charts
 */
function initAllCharts() {
  for (const indexKey of Object.keys(INDICES)) {
    createChart(`chart-${indexKey}`, indexKey);
    updatePriceCard(indexKey);
  }
}

/**
 * Perform update tick for all charts
 */
function tickAllCharts() {
  for (const indexKey of Object.keys(INDICES)) {
    updateDataPoint(indexKey);
    updateChart(indexKey);
    updatePriceCard(indexKey);
  }
}
