# Daybeau QR — 작업 진행 현황

마지막 업데이트: 2026-06-05

---

## ✅ 완료된 것

### 프로젝트 기반
- Next.js 16 + Tailwind CSS v4 + NextAuth 프로젝트 생성
- Google Sheets 연동 (`lib/sheets.js`) — Links / Pages 두 시트 지원
- 로그인/인증 (NextAuth credentials, admin 계정)
- Vercel 배포 준비 (`.env.local` 설정, GitHub push 준비)
- Google Sheets 설정 완료 (기존 derna-report 서비스 계정 재사용)

### 단축 링크 기능 (`/r/[code]`)
- 링크 생성 / 수정 / 삭제
- 커스텀 코드 or 자동 생성 (nanoid)
- 클릭 수 카운트 (Google Sheets F열)
- QR 코드 생성 + PNG 다운로드 (`qrcode` 라이브러리)

### 링크 페이지 기능 (`/p/[code]`) — 링크트리 스타일
- 페이지 생성 / 수정 / 삭제
- Google Sheets `Pages` 시트 연동 (컬럼: id · code · title · subtitle · theme_color · items_json · config_json · created_at)
- 공개 랜딩 페이지 (`PublicPage.js`) — 완전 인라인 스타일로 구현
- 페이지 에디터 (`PageEditor.js`) — 완전 인라인 스타일로 재작성

### 페이지 에디터 기능
- 로고 파일 업로드 (→ base64 data URL) + URL 직접 입력
- 로고 사이즈 조절 (S / M / L)
- 페이지 제목 / 부제목
- 제목 텍스트 색상 / 부제목 색상 선택
- 테마 색상 (프리셋 8개 + 커스텀 color picker)
- 배경 색상 / 배경 이미지 업로드
- 다국어 병기 (영어 · 중국어 간체 · 중국어 번체 · 일본어 · 태국어)
- 링크 버튼 추가 / 삭제 / 순서 변경
- 아이콘 선택: SNS(Google·Instagram·Facebook·YouTube·TikTok·Naver·Band·Link) + 국기 12개(KR·CN·TW·JP·US·GB·TH·ID·RU·VN·SG·MN)
- 실시간 미리보기 (sticky, 스크롤해도 고정)

### 안내문 출력 (PrintGuide)
- 로고 파일 업로드
- 헤더 텍스트 / 부제목 / 카드 제목 편집
- 다국어 병기 텍스트 입력
- 테마 색상 선택
- 하단 동심원 장식 켜기/끄기
- 인쇄 / PDF 저장 (새 창 print)

### 공개 페이지 디자인 (`/p/[code]`)
- 로고 흰 배경 영역 분리
- 제목 컬러 밴드 (테마 색상)
- 버튼 은은한 배경색 (`color + 0d` 투명도)
- 하단 동심원 SVG 장식
- 외부 배경색 = 테마 색상 (또는 커스텀 배경)

---

## ⚠️ 미완성 / 버그

### 국가 배지 미표시 (공개 페이지)
- **원인**: Google Sheets의 items_json에 `icon` 필드가 저장되지 않은 상태
- **해결 방법**: 에디터에서 각 버튼 아이콘을 선택한 뒤 **저장 버튼 클릭** → Google Sheets 업데이트 → `/p/[code]` 새로고침

### 에디터 미리보기 — 배지 미표시
- 현재 form 상태의 `item.icon` 값이 렌더링에 반영되는지 확인 필요
- `IconBadge` 컴포넌트 자체는 정상 (코드 확인 완료)

### OneDrive + Turbopack HMR 이슈
- 파일 수정 시 hot reload가 간헐적으로 작동 안 됨
- **대응책**: 서버 재시작 (`Ctrl+C` → `npm run dev`)

---

## 📋 다음 할 일

### 우선순위 높음
1. **저장 버튼 눌러서 Google Sheets 업데이트** → 공개 페이지 배지 확인
2. 에디터 미리보기 배지 렌더링 디버깅 (form.items[i].icon 값 추적)
3. Vercel 배포 연결 (GitHub 레포 → Vercel import → 환경변수 설정)

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
# → http://localhost:3000
```

포트 충돌 시:
```bash
taskkill /PID [충돌PID] /F
npm run dev
```

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
    PublicPage.js   # 클라이언트 컴포넌트 (인라인 스타일 전용)
  r/[code]/route.js # 단축 URL 리다이렉트

lib/
  sheets.js         # Google Sheets CRUD
  auth.js           # NextAuth 설정
```
