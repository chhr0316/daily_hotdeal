# 🧺 오늘의 생필품 핫딜

매일 아침 생필품 특가를 한 페이지에 모아 보여 주는 **모바일 퍼스트 정적 웹사이트**입니다.
빌드 과정이 없고, 파일 그대로 GitHub Pages·Netlify·Vercel에 올릴 수 있습니다.

> 로컬에서 `index.html`을 더블클릭해 열면 브라우저 보안 정책 때문에 `deals.json`을 읽지 못합니다.
> 폴더에서 `python3 -m http.server 8000` 을 실행하고 `http://localhost:8000` 으로 열어 주세요.

- 라이브: https://chhr0316.github.io/daily_hotdeal/
- 저장소: https://github.com/chhr0316/daily_hotdeal
- 운영 계정: @kkoso22 (네이버 쇼핑커넥트 연동 대상)

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| `index.html` | 페이지 뼈대 (헤더·소개 배너·필터 탭·상품 영역·고지·푸터) |
| `styles.css` | 디자인 (모바일 2열 → 태블릿 3열 → 데스크톱 4열) |
| `app.js` | `deals.json`을 읽어 날짜·탭·상품 카드를 자동 렌더링 |
| `deals.json` | **매일 고치는 유일한 파일.** 사이트 정보 + 상품 목록 |
| `assets/` | 상품 이미지 (판매처 이미지를 내려받아 700px로 정리해 둔 것) |
| `preview_mobile.png`, `preview_desktop.png` | 390×844 / 1440×900 렌더링 화면 |

## 매일 업데이트하는 법

1. `deals.json`의 `site.display_date`, `site.updated_at`, `site.price_checked_at`, `notice`의 날짜를 오늘로 바꿉니다.
2. `deals` 배열에서 오늘 특가를 넣고 뺍니다. 항목 하나의 형식은 아래와 같습니다.

```json
{
  "id": "sparkle-water",
  "name": "스파클 생수, 무라벨, 500ml, 80개",
  "brand": "스파클",
  "store": "토스쇼핑",
  "category": "kitchen",
  "price": 13900,
  "list_price": null,
  "discount_rate": 42,
  "unit_price": "500ml당 174원 · 총 40L",
  "point": "물값 오를 때마다 사게 되는 80병 묶음, 40L를 1만 3천원대로 채워두세요.",
  "image": "assets/sparkle-water.jpg",
  "image_alt": "스파클 무라벨 생수 500ml 80병 묶음",
  "url": "https://toss.shopping/t/56322313",
  "shopping_connect_url": "",
  "price_source": "토스쇼핑 하루특가",
  "price_checked_at": "2026.11.17 18:10"
}
```

- `category` 값: `life`(세제·생활) / `kitchen`(주방·식품) / `bath`(욕실·위생) / `etc`(기타)
- `list_price`는 판매처가 정가를 표시할 때만 숫자로 넣습니다. 모르면 `null` (화면에 취소선이 안 나옵니다).
- `unit_price`·`point`는 비우면 그 줄이 사라집니다.
- 이미지는 `assets/`에 넣고 `image` 경로를 맞춰 주세요. 파일이 없거나 깨져도 카드에는 🧺 대체 그림이 나옵니다.

## 네이버 쇼핑커넥트 링크 넣는 법 (가장 중요)

지금은 모든 상품의 `shopping_connect_url`이 `""`(빈칸)입니다. 이 상태에서는 카드 버튼이
**"최저가 링크 준비 중"** 으로 표시되고, 원문 상품 페이지로 자동 이동하지 않습니다(폴백 없음).

쇼핑커넥트에서 상품별 링크를 받으면 `deals.json`의 해당 상품 `shopping_connect_url`에 넣기만 하면 됩니다.

```json
"shopping_connect_url": "https://naver.me/XXXXXXXX"
```

- 값이 들어간 순간 버튼이 **"최저가 보러가기 →"** 로 바뀌고 `rel="sponsored noopener noreferrer"` 링크로 열립니다.
- 잘못된 링크를 넣었을 때를 대비해, 값을 지우면 다시 "준비 중" 상태로 돌아갑니다.
- 상품을 쇼핑커넥트 링크의 상품과 **같은 구성·같은 판매처 가격**으로 맞춰 주세요. 가격이 다르면 `price`도 같이 고칩니다.

## 배포

정적 파일이라 어디든 올릴 수 있습니다.

- **GitHub Pages**: 저장소 → Settings → Pages → Source `Deploy from a branch` → Branch `main` / `/ (root)`.
- 수정 후 `git add -A && git commit -m "2026.11.18 특가 업데이트" && git push` 하면 1~2분 뒤 사이트에 반영됩니다.

## 가격·이미지 출처와 주의

- 2026-11-17 18:10 기준으로 확인한 **토스쇼핑 하루특가** 가격입니다. 토스쇼핑은 앱 전용 가격이라
  웹 상품 페이지에서는 QR로만 가격이 보입니다. 페이지 상단·하단 고지에 기준 시각을 적어 두었습니다.
- 공정위 대가성 문구(쇼핑커넥트 수수료 고지)는 상품 영역 아래와 푸터에 두 곳 모두 들어가 있습니다.
  문구는 `deals.json`의 `disclosure` 값 하나로 양쪽이 함께 바뀝니다.
- 상품 이미지는 판매처가 제공한 이미지를 사용했습니다. 실제 구성·색상과 다를 수 있다는 안내가 하단 고지에 있습니다.
