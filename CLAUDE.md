# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드 — 배포 전 반드시 실행
npm run lint     # ESLint
```

No test suite. Verify changes by running the dev server and checking the browser.

**포트 충돌 시:**
```bash
taskkill /PID <PID> /F   # Windows — 터미널에 출력된 PID 사용
npm run dev
```

**OneDrive 경로 + Turbopack HMR 이슈:** 파일 수정 후 hot reload가 작동하지 않을 수 있다. 변경이 반영되지 않으면 서버를 재시작하고 브라우저에서 Ctrl+Shift+R로 강제 새로고침한다. Tailwind 클래스가 `components/` 폴더에서 간헐적으로 적용 안 되는 문제가 있어 **`PageEditor.js`와 `PublicPage.js`는 인라인 스타일만 사용**한다.

## Architecture

**Stack:** Next.js 16 App Router · React 19 · Tailwind CSS v4 · NextAuth v4 · Google Sheets API v4

### Data Layer

Google Sheets가 유일한 DB다. 모든 읽기/쓰기는 `lib/sheets.js` → Google Sheets API (서비스 계정).

**`Links` 시트** — 단축 URL:
```
A:id | B:code | C:title | D:original_url | E:created_at | F:clicks
```

**`Pages` 시트** — 링크트리 스타일 랜딩 페이지:
```
A:id | B:code | C:title | D:subtitle | E:theme_color | F:items_json | G:config_json | H:created_at
```
- `items_json`: `[{label, url, icon}]` — 버튼 배열. `icon` 값은 `'flag_kr'`, `'flag_cn'`, `'instagram'` 등
- `config_json`: `{logo_url, logo_size, title_color, subtitle_color, bg_color, bg_image_url, lang:{en,zh_hans,zh_hant,ja,th}}`

데이터는 **1행 헤더, 2행부터 데이터**. `lib/sheets.js`의 모든 함수는 row 2부터 읽는다.

### API Routes (`app/api/`)

모든 API는 `getServerSession(authOptions)`로 인증을 검사한다.

| Method | Path | 설명 |
|--------|------|------|
| GET/POST | `/api/links` | 단축 링크 목록 / 생성 |
| PATCH/DELETE | `/api/links/[code]` | 수정 / 삭제 |
| GET/POST | `/api/pages` | 링크 페이지 목록 / 생성 |
| GET/PATCH/DELETE | `/api/pages/[code]` | 조회 / 수정 / 삭제 |

### Routing

- `/` — 관리자 대시보드 (로그인 필요)
- `/login` — 로그인 페이지
- `/r/[code]` — 단축 URL 리다이렉트 + 클릭 카운트 (`app/r/[code]/route.js`, Route Handler)
- `/p/[code]` — 링크트리 공개 랜딩 페이지 (`app/p/[code]/page.js` → `PublicPage.js`)

### Auth

`lib/auth.js` — NextAuth credentials. 환경변수의 `ADMIN_USERNAME` / `ADMIN_PASSWORD`로 단일 admin 계정. JWT 세션 전략.

### Styling 주의사항

- **`components/PageEditor.js`**: 인라인 스타일 전용. Tailwind 클래스 사용 금지.
- **`app/p/[code]/PublicPage.js`**: 인라인 스타일 전용. Tailwind 클래스 사용 금지.
- 나머지 컴포넌트(`LinkTable`, `QrModal`, `PrintGuide` 등)는 Tailwind 사용 가능.
- `app/globals.css`에 `@source` 지시어로 `components/`와 `app/` 폴더를 명시적으로 스캔.

### `PageEditor.js` 내부 exports

`PageEditor.js`는 세 가지를 export한다:
- `default PageEditor` — 에디터 폼 + 미리보기 레이아웃
- `export function PagePreview` — 미리보기 카드 컴포넌트
- `export function IconBadge` — 아이콘/국기 배지 컴포넌트 (`PublicPage.js`에서 import)

`FLAG_META` 상수: `flag_kr → 'KR'`, `flag_cn → 'CN'` 등. `IconBadge`에서 국기 배지를 렌더링할 때 사용.

## Environment Variables

`.env.local` (`.env.local.example` 참조):
- `GOOGLE_SERVICE_ACCOUNT_KEY` — 서비스 계정 JSON 전체 (한 줄)
- `GOOGLE_SPREADSHEET_ID` — 스프레드시트 ID
- `NEXTAUTH_SECRET` — `openssl rand -base64 32`로 생성
- `NEXTAUTH_URL` — 로컬: `http://localhost:3000`, 배포: 실제 URL
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`

## Google Sheets 초기 설정

1. `Links` 시트 생성, 1행 헤더: `id | code | title | original_url | created_at | clicks`
2. `Pages` 시트 생성, 1행 헤더: `id | code | title | subtitle | theme_color | items_json | config_json | created_at`
3. 서비스 계정 이메일에 스프레드시트 **편집자** 권한 부여
