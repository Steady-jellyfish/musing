# Musing Web

카테고리 기반 노트 관리 애플리케이션의 웹 프론트엔드

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 라이브러리**: shadcn/ui
- **아이콘**: Lucide React

## 주요 기능

- 3계층 카테고리 트리 구조
- 카테고리별 노트 관리
- 노트 조회 및 편집
- 태그 시스템
- 검색 기능 (추후 구현)

## 시작하기

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 프로젝트 구조

```
musing-web/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 메인 페이지
│   └── globals.css     # 전역 스타일
├── components/          # React 컴포넌트
│   ├── ui/             # shadcn/ui 컴포넌트
│   ├── header.tsx      # 헤더
│   ├── sidebar.tsx     # 사이드바
│   ├── category-tree-item.tsx  # 카테고리 트리 아이템
│   ├── note-list.tsx   # 노트 목록
│   └── note-viewer.tsx # 노트 뷰어
├── lib/                # 유틸리티
│   ├── utils.ts        # 공통 유틸
│   └── mock-data.ts    # 목업 데이터
└── types/              # TypeScript 타입
    └── index.ts        # 타입 정의
```

## 데이터 구조

### Category (카테고리)
- 3계층 구조 지원 (Level 1, 2, 3)
- 부모-자식 관계로 트리 구조 형성
- 각 카테고리별 노트 개수 표시

### Note (노트)
- 제목, 원본 텍스트, 정제된 텍스트
- 카테고리 연결
- 태그 지원
- 버전 관리

## 향후 계획

- [ ] 백엔드 API 연동
- [ ] 노트 생성/수정/삭제 기능
- [ ] 검색 기능 구현
- [ ] 다크 모드 지원
- [ ] 모바일 반응형 최적화
- [ ] 노트 이어쓰기 기능
- [ ] LLM 기반 카테고리 추천
