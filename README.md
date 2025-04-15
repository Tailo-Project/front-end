# 프론트엔드 코딩 컨벤션

## 목차

-   [파일 및 폴더 구조](#파일_및_폴더_구조)
-   [명명 규칙](#명명_규칙)
-   [React 컴포넌트](#react-컴포넌트)
-   [TypeScript](#typescript)
-   [CSS / Styling](#css--styling)
-   [Import 순서](#import-순서)
-   [코드 포맷팅](#코드-포맷팅)
-   [주석](#주석)
-   [Git 커밋 메시지](#git-커밋-메시지)

## 파일 및 폴더 구조

### 폴더 구조

```
src/
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/      # 재사용 가능한 컴포넌트
│   ├── common/      # 공통 컴포넌트 (Button, Input 등)
│   └── feature/     # 특정 기능과 관련된 컴포넌트
├── hooks/           # 커스텀 훅
├── pages/           # 페이지 컴포넌트
├── services/        # API 호출 관련 코드
├── store/           # 상태 관리 (Context API)
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
└── App.tsx          # 앱 진입점
```

### 파일 명명 규칙

-   컴포넌트 파일: `PascalCase.tsx` (예: `Button.tsx`, `MapView.tsx`)
-   훅, 유틸리티 파일: `camelCase.ts` (예: `useAuth.ts`, `formatDate.ts`)
-   스타일 파일: 컴포넌트와 동일한 이름 사용 (예: `Button.styles.ts`)
-   테스트 파일: `.test.tsx` 또는 `.spec.tsx` 접미사 사용

## 명명 규칙

### 변수 및 함수

-   변수와 함수는 `camelCase` 사용
-   의미 있는 이름 사용 (예: `getUserData`보다 `fetchUserProfile`이 더 명확함)
-   불리언 변수는 `is`, `has`, `should` 등의 접두사 사용 (예: `isLoading`, `hasError`)

```typescript
// 좋은 예
const isUserLoggedIn = true;
const fetchUserData = async () => {
    /* ... */
};

// 나쁜 예
const loggedin = true;
const data = async () => {
    /* ... */
};
```

### 상수

-   상수는 `UPPER_SNAKE_CASE` 사용

```typescript
const API_BASE_URL = "https://api.example.com";
const MAX_RETRY_COUNT = 3;
```

### 컴포넌트

-   컴포넌트는 `PascalCase` 사용
-   파일명과 컴포넌트명 일치시키기

```typescript
// Button.tsx
const Button = ({ children, onClick }) => {
    return { children };
};

export default Button;
```

## React 컴포넌트

### 함수형 컴포넌트 사용

-   클래스형 컴포넌트 대신 함수형 컴포넌트와 훅 사용

```typescript
// 좋은 예
const UserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
  }, [userId]);

  return {user ? user.name : 'Loading...'};
};
```

### Props 타입 정의

-   컴포넌트 Props는 인터페이스로 정의하고 명확한 이름 사용
-   Props 인터페이스 이름은 컴포넌트 이름 + Props 형식 사용

```typescript
interface ButtonProps {
    variant?: "primary" | "secondary";
    size?: "small" | "medium" | "large";
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

const Button = ({
    variant = "primary",
    size = "medium",
    onClick,
    disabled,
    children
}: ButtonProps) => {
    // ...
};
```

### 컴포넌트 구조화

-   큰 컴포넌트는 작은 컴포넌트로 분리
-   컴포넌트 내부에서 로직과 렌더링 부분 분리

```typescript
const UserDashboard = () => {
  // 1. 상태 관리
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. 이벤트 핸들러
  const handleUserDelete = (userId: string) => {
    // ...
  };

  // 3. 부수 효과
  useEffect(() => {
    // ...
  }, []);

  // 4. 조건부 렌더링
  if (isLoading) return ;

  // 5. 메인 렌더링
  return (

      {users.map(user => (

      ))}

  );
};
```

## TypeScript

### 타입 정의

-   인터페이스와 타입 정의는 명확하고 구체적으로 작성
-   재사용 가능한 타입은 별도 파일로 분리 (`types/` 폴더)

```typescript
// types/user.ts
export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    createdAt: Date;
}

// 재사용 가능한 타입 정의
export type ID = string;
export type Timestamp = number;

// 유니온 타입 활용
export type NotificationType = "email" | "sms" | "push";
```

### any 타입 지양

-   `any` 타입은 가능한 사용하지 않기
-   불가피한 경우 `unknown`을 사용하고 타입 가드 적용

```typescript
// 나쁜 예
const processData = (data: any) => {
    return data.value;
};

// 좋은 예
const processData = (data: unknown) => {
    if (typeof data === "object" && data !== null && "value" in data) {
        return data.value;
    }
    throw new Error("Invalid data format");
};
```

## CSS / Styling

### TailwindCSS 사용 규칙

-   클래스 이름은 알파벳 순서로 정렬
-   관련 속성끼리 그룹화 (레이아웃, 색상, 타이포그래피 등)
-   반응형 클래스는 모바일 퍼스트 원칙에 따라 작성

```tsx
// 좋은 예
<div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md md:p-6 lg:p-8">
    <h2 className="text-lg font-bold text-gray-800 md:text-xl">제목</h2>
</div>
```

### Styled-components 사용 규칙

-   컴포넌트 파일 내에서 스타일 정의 시 상단에 배치
-   의미 있는 이름으로 스타일 컴포넌트 정의
-   props를 활용한 조건부 스타일링 권장

```tsx
// Button.tsx
import styled from "styled-components";

const StyledButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: bold;

    ${({ variant }) =>
        variant === "primary" &&
        `
    background-color: #3b82f6;
    color: white;
  `}

    ${({ variant }) =>
        variant === "secondary" &&
        `
    background-color: #e5e7eb;
    color: #1f2937;
  `}
`;

const Button = ({ variant = "primary", children }) => {
    return { children };
};
```

### 들여쓰기 및 공백

-   들여쓰기는 2칸 사용
-   중괄호, 연산자 주변에 공백 추가
-   함수 선언과 호출 사이에 공백 없음

```typescript
// 좋은 예
const calculateSum = (a: number, b: number): number => {
    return a + b;
};

// 나쁜 예
const calculateSum = (a: number, b: number): number => {
    return a + b;
};
```

## 주석

### 주석 작성 규칙

-   코드가 "무엇"을 하는지보다 "왜" 그렇게 하는지 설명
-   복잡한 로직에는 주석 추가
-   JSDoc 스타일 주석 권장

```typescript
/**
 * 사용자 데이터를 가져와 포맷팅하는 함수
 * @param userId - 사용자 ID
 * @returns 포맷팅된 사용자 정보
 */
const fetchAndFormatUser = async (userId: string): Promise => {
    // API에서 가져온 데이터는 snake_case이므로 camelCase로 변환
    const userData = await fetchUser(userId);
    return formatUserData(userData);
};

// TODO: 추후 성능 최적화 필요
function expensiveCalculation() {
    // ...
}
```

## Git 커밋 메시지

### 커밋 메시지 형식

-   커밋 메시지는 다음 형식 준수: `type: subject`
-   타입은 소문자로 시작 (feat, fix, docs, style, refactor, test, chore)
-   제목은 명령문 형태로 작성 (과거형 X)

```
feat: 사용자 위치 기반 대피소 필터링 기능 추가
fix: 지도 마커 클릭 시 오류 수정
docs: README 업데이트
style: 버튼 컴포넌트 스타일 개선
refactor: 사용자 인증 로직 리팩토링
test: 대피소 컴포넌트 테스트 추가
chore: 패키지 의존성 업데이트
```

### 브랜치 명명 규칙

-   브랜치 이름은 `type/description` 형식 사용
-   설명은 짧고 명확하게 작성 (kebab-case 사용)

```
feat/user-location
fix/map-marker-click
refactor/auth-logic
```

---
