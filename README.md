# TECHBYTE

뉴스와 일상에서 만나는 IT 용어를 쉬운 말로 설명하는 한국어·영어 용어 사전
용어 상세 페이지와 주제별 가이드, IT 이야기 제공

## 시작하기

Node.js와 npm을 설치한 뒤 프로젝트 루트에서 실행합니다.

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 (먼저 `npm run build` 실행) |
| `npm run lint` | ESLint 검사 |

## 주요 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 용어 검색·목록, 오늘의 용어, 많이 찾는 용어 |
| `/terms/{id}` | 용어 상세 페이지 |
| `/read` | 쉽게 읽는 IT 글 목록 및 상세 페이지 |
| `/guides` | 주제별 용어 가이드 목록 및 상세 페이지 |
| `/about` | 서비스 소개 |
| `/contact` | 문의 |
| `/privacy` | 개인정보처리방침 |
| `/robots.txt`, `/sitemap.xml` | 검색엔진용 파일 |

목록 페이지는 글을 5개씩 보여 주며, 두 번째 페이지부터 `/read/page/2`, `/guides/page/2` 형식의 경로를 사용합니다.

## 프로젝트 구조

```text
app/                  페이지 라우트와 공통 UI 컴포넌트
  ui/                 헤더, 푸터, 글·용어 화면 등 재사용 UI
  terms/[id]/         용어 상세 페이지
  read/               쉽게 읽는 IT 글 페이지
  guides/             용어 가이드 페이지
content/              Markdown 글과 글 작성 템플릿
  pages/              소개·개인정보처리방침 (한국어 .md, 영어 .en.md)
  read/               쉽게 읽는 IT 글
  guides/             용어 가이드
data/                 홈, 소개 페이지, 분류, 도구, 용어 데이터
  terms/{category}/   분류별 용어 JSON 파일
lib/                  콘텐츠 로딩 및 화면 데이터 가공 로직
public/               정적 파일
site.config.js        사이트 이름, URL, 설명, 문의처 등 공통 설정
```

## 콘텐츠 관리

### 글 추가 및 수정

`content/_template.md`를 복사해 `content/read/` 또는 `content/guides/`에 Markdown 파일을 추가합니다. 파일 이름이 URL의 글 식별자가 됩니다. 예를 들어 `content/read/what-is-api.md`는 `/read/what-is-api`로 연결됩니다.

파일 첫 부분에 YAML frontmatter로 제목, 요약, 날짜를 작성합니다.

```md
---
title: API란 무엇인가요?
description: 앱과 서버가 요청과 응답을 주고받는 방법을 알아봅니다.
date: 2026-11-01
order: 60
terms: api, llm
---

본문을 Markdown으로 작성합니다.
```

- `order`가 있는 글은 숫자가 큰 순서로 먼저 표시됩니다. `order`가 없는 글은 그 뒤에 날짜 최신순으로 표시됩니다.
- 영어 글은 같은 이름에 `.en.md`를 붙여 추가합니다. 예: `what-is-api.en.md`.
- `terms`에는 용어 ID 또는 표시할 문구를 쉼표로 구분해 적습니다. 본문에 `[[terms]]`를 한 줄로 넣으면 해당 위치에 용어 태그가 표시됩니다.
- 이름이 `_`로 시작하는 Markdown 파일은 목록에 표시되지 않습니다.

### 소개·개인정보처리방침 수정

`content/pages/about.md`, `content/pages/privacy.md`에서 한국어 내용을 수정합니다. 영어 내용은 각각 `about.en.md`, `privacy.en.md`에서 관리합니다. Markdown 제목(`#`)이 페이지 제목으로 표시됩니다. `{{siteName}}`, `{{contactEmail}}`, `{{retentionPeriod}}`, `{{effectiveDate}}`처럼 `site.config.js`에 정의된 표기는 빌드 시 설정값으로 치환됩니다.

### 용어 추가 및 수정

`data/terms/_template.json`을 참고해 용어 데이터를 `data/terms/{분류 ID}/{용어 ID}.json`에 추가합니다. 분류 ID는 `data/categories.json`에 등록된 ID여야 하며, 파일 이름이 `/terms/{용어 ID}`의 주소가 됩니다. 용어 ID는 모든 분류에서 중복될 수 없습니다.

예를 들어 `data/terms/ai/rag.json`은 `/terms/rag` 페이지를 만듭니다. 데이터에는 한국어·영어 이름과 설명, 상세 내용, 관련 용어 등을 작성할 수 있습니다. `data/tools.json`의 도구 ID를 용어 데이터의 `tools`에 지정하면 관련 도구를 연결할 수 있습니다.

### 사이트 및 홈 설정

- `site.config.js`: 사이트 이름, 설명, 도메인(`siteUrl`), 문의 이메일, 개인정보처리방침 설정을 관리합니다. 배포 전에 실제 서비스 주소로 `siteUrl`을 변경하세요. 이 값은 canonical URL과 sitemap, robots.txt에 사용됩니다.
- `data/home.json`: 첫 화면에 고정할 오늘의 용어(`todayTerm`), 목록 페이지 크기(`termsPerPage`), 인기 용어 순서(`popularTerms`)를 설정합니다. `todayTerm`을 비우면 한국 시간 기준으로 용어가 매일 바뀝니다.
- `data/categories.json`: 용어 분류 ID와 다국어 이름을 관리합니다.
- `data/pages.json`: 문의 페이지의 안내 문구와 문의 유형을 관리합니다.
- `data/tools.json`: 용어 페이지에서 참조할 외부 도구 목록입니다.

## 기술 스택

- Node.js 24.19.0
- npm 11.17.0
- Next.js 16.4.3
- React 19.3.0
- Tailwind CSS 4.3.3
- marked 18.1.2
- ESLint 9.39.5
