# 📈 StockVision — 실시간 글로벌 주식 지수 대시보드

코스피, 코스닥, 나스닥, S&P500 지수를 1분마다 자동 갱신하는 대시보드입니다.

## 기술 스택

- **Backend** : Node.js + Express (Yahoo Finance API 프록시)
- **Frontend** : Vanilla JS + Chart.js
- **데이터 소스** : Yahoo Finance (yfinance)

## 🚀 로컬 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/urmyfrenz-a11y/stock.git
cd stock

# 2. 의존성 설치
npm install

# 3. 서버 실행
npm start

# 4. 브라우저에서 열기
open http://localhost:3000
```

## 지수 데이터

| 지수 | 심볼 | 설명 |
|------|------|------|
| 코스피 | `^KS11` | 한국거래소 종합주가지수 |
| 코스닥 | `^KQ11` | 코스닥시장지수 |
| 나스닥 | `^IXIC` | NASDAQ Composite |
| S&P500 | `^GSPC` | S&P 500 Index |

## API 엔드포인트

```
GET /api/quotes          — 4개 지수 현재 시세 (30초 캐시)
GET /api/chart/:key      — 시계열 차트 데이터 (1분 캐시)
    ?range=1H|2H|1D|1W
GET /api/health          — 서버 상태 확인
```

## 주요 기능

- ✅ Yahoo Finance 실시간 데이터 (매 1분 갱신)
- ✅ 서버 연결 실패 시 mock 데이터로 자동 폴백
- ✅ 헤더의 `● LIVE` / `● DEMO` 배지로 데이터 상태 표시
- ✅ 시간 범위 탭: 1H / 2H / 1D / 1W (각 카드 독립)
- ✅ KRX / US 시장 개장 상태 실시간 표시
- ✅ 반응형 다크 테마 UI

## 주의사항

> 본 서비스는 투자 참고용이며 실제 투자 결정의 근거로 단독 사용하지 마세요.
