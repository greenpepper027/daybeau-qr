# Daybeau QR — 작업 진행 현황

마지막 업데이트: 2026-06-05

---

## ✅ 완료된 것

### 프로젝트 기반
- Next.js 16 + Tailwind CSS v4 + NextAuth 프로젝트 생성
- Google Sheets 연동 (`lib/sheets.js`) — Links / Pages 두 시트 지원
- 로그인/인증 (NextAuth credentials, admin 계정)
- GitHub 레포 생성 (`greenpepper027/daybeau-qr`) 및 push 완료
- Vercel 배포 완료 (`https://daybeau-qr.vercel.app`)

### 단축 링크 기능 (`/r/[code]`)
- 링크 생성 / 수정 / 삭제
- 커스텀 코드 or 자동 생성 (nanoid)
- 클릭 수 카운트 (Google Sheets F열)
- QR 코드 생성 + PNG 다운로드 (`qrcode` 라이브러리)

### 링크 페이지 기능 (`/p/[code]`) — 링크트리 스타일
- 페이지 생성 / 수정 / 삭제
- Google Sheets `Pages` 시트 연동
- 공개 랜딩 페이지 (`PublicPage.js`) — 글래스모피즘 디자인
- 페이지 에디터 (`PageEditor.js`) — 인라인 스타일 전용

### 페이지 에디터 기능 (현재 코드 기준)
- 로고 파일 업로드 (canvas 압축 600px/PNG) + URL 직접 입력
- 로고 사이즈 조절 (S / M / L)
- 페이지 제목 / 부제목
- **제목 바 배경색** + 투명도 슬라이더 (0~100%) + 제목 텍스트 색상 / 부제목 색상
- 테마 색상 (프리셋 8개 + 커스텀 color picker)
- 배경: 색상 / 이미지 업로드 (canvas 압축 800px/JPEG 40%, 50K 한도 적응형)
- 배경 이미지 표시 방식: 꽉채움 / 전체보기 / 너비맞춤
- 배경 위치: 위 / 중앙 / 아래
- **어둡기 슬라이더** (배경 오버레이 0~70%)
- **카드 투명도 슬라이더** (30~100%)
- 다국어 병기 (영어 · 중국어 간체 · 중국어 번체 · 일본어 · 태국어)
- 링크 버튼 추가 / 삭제 / 순서 변경
- 아이콘: SNS + 국기 12개 (원형 배지, 브랜드 컬러)
- 실시간 미리보기 (sticky)

### 공개 페이지 디자인 (`/p/[code]`)
- 글래스모피즘 카드 (`backdrop-filter: blur(24px)`, `rgba(255,255,255, card_opacity)`)
- 배경 이미지 + 반투명 오버레이 지원
- 흰색 버튼 + 호버 시 떠오르는 효과 (`translateY(-1px)`)
- 국기 배지 원형 (브랜드 컬러)
- 하단 동심원 SVG 장식

### Google Sheets 스키마 (Pages)
```
A:id | B:code | C:title | D:subtitle | E:theme_color | F:items_json | G:config_json | H:created_at | I:bg_image
```
- `bg_image` (I열): base64 배경 이미지 별도 저장 (config_json 50K 한도 우회)
- `config_json`에는 bg_image_url 제외, 나머지 설정만 저장

---

## 🚨 Vercel 배포 이슈 (2026-06-05 현재)

### 에러 내용
```
SyntaxError: Bad control character in string literal in JSON at position 156
```
- 모든 API 라우트 (`/api/pages`, `/api/links`)와 `/p/[code]` 에서 500 에러 발생
- **원인**: `GOOGLE_SERVICE_ACCOUNT_KEY` 환경변수에 private_key의 `\n`이
  실제 줄바꿈 문자(control character)로 저장됨 → `JSON.parse()` 실패

### 조치한 것
- Vercel 환경변수에서 `GOOGLE_SERVICE_ACCOUNT_KEY` 값을 수정
  - `\n` → 이스케이프된 `\\n` (두 글자)으로 교체 완료
- `NEXTAUTH_URL` → `https://daybeau-qr.vercel.app` 으로 업데이트
- Redeploy 트리거 완료 (Status: Ready ✅)

### 아직 확인 안 된 것
- [ ] Redeploy 후 `/p/DpEzKDv` 접속 시 정상 동작하는지 **브라우저에서 직접 확인 필요**
- [ ] 에디터(`daybeau-qr.vercel.app` 로그인 → 링크 페이지 탭)에서 글래스모피즘 / 투명도 슬라이더 등 신규 기능 표시 여부 확인
- [ ] 배경 이미지 저장 → 공개 페이지 표시 end-to-end 확인

---

## ⚠️ 알려진 이슈

### OneDrive + Turbopack HMR 이슈
- 파일 수정 시 hot reload가 간헐적으로 작동 안 됨
- **대응책**: 서버 재시작 (`Ctrl+C` → `npm run dev`)

### 배경 이미지 50K 한도
- Google Sheets 셀 최대 50,000자 제한
- bg_image는 I열에 별도 저장하고, 업로드 시 canvas로 압축 (800px, JPEG 40%)
- 적응형 압축 루프: 48,000자 초과 시 품질 5%씩 낮춤

---

## 📋 다음 할 일

### 확인 필요 (즉시)
1. `https://daybeau-qr.vercel.app/p/DpEzKDv` 접속 → 정상 렌더링 확인
2. Vercel 로그인 후 에디터에서 신규 기능(슬라이더, 카드투명도 등) 동작 확인
3. 배경 이미지 재업로드 → 저장 → 공개 페이지 확인

### 기능 추가 후보
- 단축 링크 QR 출력 시 안내문 디자인 개선
- 링크 클릭 통계 차트 (날짜별)
- 페이지별 조회수 카운트
- 관리자 비밀번호 변경 UI

---

## 🚀 서버 시작 방법

```bash
cd "C:\Users\ewndu\OneDrive\바탕 화면\daybeau-qr"
npm run dev
# → http://localhost:3000 (또는 3001)
```

포트 충돌 시:
```bash
taskkill /PID [충돌PID] /F
npm run dev
```

---

## 🌐 배포 정보

| 항목 | 값 |
|------|-----|
| 프로덕션 URL | https://daybeau-qr.vercel.app |
| GitHub | https://github.com/greenpepper027/daybeau-qr |
| 브랜치 | main (push 시 자동 배포) |
| 로그인 | admin / daybeau2024 |

---

## 🗂️ 주요 파일 구조

```
components/
  PageEditor.js     # 링크 페이지 에디터 (인라인 스타일 전용)
  PagePreview       # 에디터 내 미리보기 (PageEditor.js 내부 export)
  IconBadge         # 아이콘/국기 배지 컴포넌트 (PageEditor.js 내부 export)
  LinkTable.js      # 단축 링크 목록
  PrintGuide.js     # 안내문 출력 모달
  QrModal.js        # QR 코드 모달

app/
  page.js           # 메인 대시보드 (단축링크 탭 / 링크페이지 탭)
  p/[code]/
    page.js         # 서버 컴포넌트 (Google Sheets 조회)
    PublicPage.js   # 클라이언트 컴포넌트 (글래스모피즘 디자인)
  r/[code]/route.js # 단축 URL 리다이렉트
  api/pages/        # 페이지 CRUD API
  api/links/        # 링크 CRUD API

lib/
  sheets.js         # Google Sheets CRUD (Pages I열 bg_image 포함)
  auth.js           # NextAuth 설정
```
