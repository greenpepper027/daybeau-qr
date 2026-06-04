# daybeau-qr

Daybeau 브랜드용 QR 코드 & 단축 링크 관리 앱.

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## Architecture

**Stack:** Next.js 16 App Router · React 19 · Tailwind CSS v4 · NextAuth v4 · Google Sheets API v4

**Data layer:** Google Sheets (`Links` 시트)
- 컬럼: `id | code | title | original_url | created_at | clicks`
- 헤더 행이 1행, 데이터는 2행부터

**Short URL redirect:** `/r/[code]` → `app/r/[code]/route.js` → Google Sheets 조회 후 redirect

**Auth:** NextAuth credentials (admin 단일 계정). `lib/auth.js`

**API routes** (`app/api/`):
- `GET /api/links` — 전체 목록
- `POST /api/links` — 생성 (body: title, original_url, custom_code?)
- `PATCH /api/links/[code]` — 수정
- `DELETE /api/links/[code]` — 삭제

## Environment Variables

`.env.local` 에 설정 (`.env.local.example` 참조):
- `GOOGLE_SERVICE_ACCOUNT_KEY` — 서비스 계정 JSON 전체
- `GOOGLE_SPREADSHEET_ID` — 스프레드시트 ID
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`

## Google Sheets 초기 설정

`Links` 시트를 만들고 1행에 헤더 입력:
```
id | code | title | original_url | created_at | clicks
```
