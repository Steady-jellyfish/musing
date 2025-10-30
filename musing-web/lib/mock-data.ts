import { Category, Note, Tag } from "@/types";

// Mock categories with 3-tier hierarchy
export const mockCategories: Category[] = [
  // Level 1: 개발
  {
    id: 1,
    name: "개발",
    full_path: "개발",
    parent_id: null,
    level: 1,
    created_at: "2024-01-01T00:00:00Z",
    noteCount: 5,
  },
  // Level 2: 개발 > 백엔드
  {
    id: 2,
    name: "백엔드",
    full_path: "개발/백엔드",
    parent_id: 1,
    level: 2,
    created_at: "2024-01-01T00:00:00Z",
    noteCount: 3,
  },
  // Level 3: 개발 > 백엔드 > API개발
  {
    id: 3,
    name: "API개발",
    full_path: "개발/백엔드/API개발",
    parent_id: 2,
    level: 3,
    created_at: "2024-01-01T00:00:00Z",
    noteCount: 2,
  },
  // Level 3: 개발 > 백엔드 > 데이터베이스
  {
    id: 4,
    name: "데이터베이스",
    full_path: "개발/백엔드/데이터베이스",
    parent_id: 2,
    level: 3,
    created_at: "2024-01-01T00:00:00Z",
    noteCount: 1,
  },
  // Level 2: 개발 > 프론트엔드
  {
    id: 5,
    name: "프론트엔드",
    full_path: "개발/프론트엔드",
    parent_id: 1,
    level: 2,
    created_at: "2024-01-01T00:00:00Z",
    noteCount: 2,
  },
  // Level 3: 개발 > 프론트엔드 > React
  {
    id: 6,
    name: "React",
    full_path: "개발/프론트엔드/React",
    parent_id: 5,
    level: 3,
    created_at: "2024-01-01T00:00:00Z",
    noteCount: 2,
  },

  // Level 1: 기획
  {
    id: 7,
    name: "기획",
    full_path: "기획",
    parent_id: null,
    level: 1,
    created_at: "2024-01-02T00:00:00Z",
    noteCount: 3,
  },
  // Level 2: 기획 > 요구사항
  {
    id: 8,
    name: "요구사항",
    full_path: "기획/요구사항",
    parent_id: 7,
    level: 2,
    created_at: "2024-01-02T00:00:00Z",
    noteCount: 2,
  },
  // Level 3: 기획 > 요구사항 > 기능명세
  {
    id: 9,
    name: "기능명세",
    full_path: "기획/요구사항/기능명세",
    parent_id: 8,
    level: 3,
    created_at: "2024-01-02T00:00:00Z",
    noteCount: 2,
  },
  // Level 2: 기획 > UI/UX
  {
    id: 10,
    name: "UI/UX",
    full_path: "기획/UI/UX",
    parent_id: 7,
    level: 2,
    created_at: "2024-01-02T00:00:00Z",
    noteCount: 1,
  },

  // Level 1: 학습
  {
    id: 11,
    name: "학습",
    full_path: "학습",
    parent_id: null,
    level: 1,
    created_at: "2024-01-03T00:00:00Z",
    noteCount: 4,
  },
  // Level 2: 학습 > 프로그래밍
  {
    id: 12,
    name: "프로그래밍",
    full_path: "학습/프로그래밍",
    parent_id: 11,
    level: 2,
    created_at: "2024-01-03T00:00:00Z",
    noteCount: 2,
  },
  // Level 3: 학습 > 프로그래밍 > TypeScript
  {
    id: 13,
    name: "TypeScript",
    full_path: "학습/프로그래밍/TypeScript",
    parent_id: 12,
    level: 3,
    created_at: "2024-01-03T00:00:00Z",
    noteCount: 1,
  },
  // Level 3: 학습 > 프로그래밍 > Python
  {
    id: 14,
    name: "Python",
    full_path: "학습/프로그래밍/Python",
    parent_id: 12,
    level: 3,
    created_at: "2024-01-03T00:00:00Z",
    noteCount: 1,
  },
  // Level 2: 학습 > 디자인패턴
  {
    id: 15,
    name: "디자인패턴",
    full_path: "학습/디자인패턴",
    parent_id: 11,
    level: 2,
    created_at: "2024-01-03T00:00:00Z",
    noteCount: 2,
  },
];

// Mock tags
export const mockTags: Tag[] = [
  { id: 1, name: "중요", created_at: "2024-01-01T00:00:00Z" },
  { id: 2, name: "TODO", created_at: "2024-01-01T00:00:00Z" },
  { id: 3, name: "버그", created_at: "2024-01-01T00:00:00Z" },
  { id: 4, name: "아이디어", created_at: "2024-01-01T00:00:00Z" },
  { id: 5, name: "리팩토링", created_at: "2024-01-01T00:00:00Z" },
];

// Mock notes
export const mockNotes: Note[] = [
  {
    id: 1,
    session_id: "sess_001",
    title: "REST API 설계 원칙",
    original_text: "REST API를 설계할 때 지켜야 할 원칙들을 정리했습니다.",
    refined_text: "REST API 설계 시 다음 원칙들을 준수해야 합니다:\n1. 자원을 명확하게 표현\n2. HTTP 메서드를 적절히 사용\n3. 상태 코드를 정확하게 반환\n4. 버전 관리 전략 수립",
    category_id: 3,
    parent_note_id: null,
    is_merged: false,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    version: 1,
    tags: [mockTags[0], mockTags[4]],
  },
  {
    id: 2,
    session_id: "sess_002",
    title: "PostgreSQL 인덱스 최적화",
    original_text: "데이터베이스 성능 개선을 위한 인덱스 전략",
    refined_text: "PostgreSQL에서 쿼리 성능을 향상시키기 위한 인덱스 최적화 방법:\n1. B-tree 인덱스는 범위 검색에 효과적\n2. Hash 인덱스는 동등 비교에 최적화\n3. 복합 인덱스 컬럼 순서가 중요\n4. EXPLAIN ANALYZE로 실행 계획 확인",
    category_id: 4,
    parent_note_id: null,
    is_merged: false,
    created_at: "2024-01-16T14:20:00Z",
    updated_at: "2024-01-16T14:20:00Z",
    version: 1,
    tags: [mockTags[0]],
  },
  {
    id: 3,
    session_id: "sess_003",
    title: "React Hooks 사용 패턴",
    original_text: "함수형 컴포넌트에서 상태 관리하는 방법",
    refined_text: "React Hooks를 효과적으로 사용하는 패턴:\n1. useState: 컴포넌트 상태 관리\n2. useEffect: 사이드 이펙트 처리\n3. useCallback: 함수 메모이제이션\n4. useMemo: 값 메모이제이션\n5. Custom Hooks로 로직 재사용",
    category_id: 6,
    parent_note_id: null,
    is_merged: false,
    created_at: "2024-01-17T09:15:00Z",
    updated_at: "2024-01-17T09:15:00Z",
    version: 1,
    tags: [mockTags[0], mockTags[3]],
  },
  {
    id: 4,
    session_id: "sess_004",
    title: "사용자 로그인 기능 요구사항",
    original_text: "로그인 화면과 인증 프로세스 정의",
    refined_text: "사용자 로그인 기능 요구사항:\n1. 이메일/비밀번호 입력 폼\n2. 소셜 로그인 지원 (Google, GitHub)\n3. 비밀번호 찾기 기능\n4. 자동 로그인 옵션\n5. 2FA 인증 지원",
    category_id: 9,
    parent_note_id: null,
    is_merged: false,
    created_at: "2024-01-18T11:00:00Z",
    updated_at: "2024-01-18T11:00:00Z",
    version: 1,
    tags: [mockTags[1]],
  },
  {
    id: 5,
    session_id: "sess_005",
    title: "TypeScript 제네릭 활용",
    original_text: "제네릭을 사용해서 타입 안전성 높이기",
    refined_text: "TypeScript 제네릭 활용 방법:\n1. 함수에서 제네릭 타입 파라미터 선언\n2. 제네릭 인터페이스로 재사용 가능한 타입 정의\n3. 제약 조건(extends)으로 타입 범위 제한\n4. 유틸리티 타입과 함께 사용",
    category_id: 13,
    parent_note_id: null,
    is_merged: false,
    created_at: "2024-01-19T15:45:00Z",
    updated_at: "2024-01-19T15:45:00Z",
    version: 1,
    tags: [mockTags[0]],
  },
  {
    id: 6,
    session_id: "sess_006",
    title: "Next.js 라우팅 시스템 이해",
    original_text: "App Router와 Pages Router의 차이점",
    refined_text: "Next.js 14의 App Router는 React Server Components를 기반으로 합니다:\n1. app 디렉토리 구조 사용\n2. 레이아웃 중첩 지원\n3. 서버 컴포넌트가 기본\n4. 데이터 페칭이 간소화됨\n5. Streaming과 Suspense 지원",
    category_id: 6,
    parent_note_id: null,
    is_merged: false,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
    version: 1,
    tags: [mockTags[0], mockTags[3]],
  },
  {
    id: 7,
    session_id: "sess_007",
    title: "API 에러 핸들링 전략",
    original_text: "백엔드 API에서 에러를 처리하는 방법",
    refined_text: "효과적인 API 에러 핸들링:\n1. 표준화된 에러 응답 형식 정의\n2. HTTP 상태 코드 올바르게 사용\n3. 에러 메시지는 명확하고 구체적으로\n4. 로깅과 모니터링 구축\n5. 재시도 가능한 에러 구분",
    category_id: 3,
    parent_note_id: null,
    is_merged: false,
    created_at: "2024-01-21T13:30:00Z",
    updated_at: "2024-01-21T13:30:00Z",
    version: 1,
    tags: [mockTags[2], mockTags[4]],
  },
];

// Build hierarchical category tree
export function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<number, Category>();
  const rootCategories: Category[] = [];

  // Create a map of all categories
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Build the tree structure
  categories.forEach((cat) => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parent_id === null) {
      rootCategories.push(category);
    } else {
      const parent = categoryMap.get(cat.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(category);
      }
    }
  });

  return rootCategories;
}

// Get notes by category ID
export function getNotesByCategory(categoryId: number): Note[] {
  return mockNotes.filter((note) => note.category_id === categoryId);
}

// Get category by ID
export function getCategoryById(id: number): Category | undefined {
  return mockCategories.find((cat) => cat.id === id);
}
