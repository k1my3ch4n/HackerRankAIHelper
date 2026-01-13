# HackerRank AI Helper - 개선 사항 정리

## 개요

이 문서는 프로젝트 분석 후 진행된 개선 작업들을 정리한 내용입니다.

---

## 1. 상수 중복 제거

### 문제점

동일한 URL이 여러 파일에 하드코딩되어 있었습니다.

```typescript
// Header.tsx
const GITHUB_URL = "https://github.com/k1my3ch4n/HackerRankAIHelper";

// page.tsx
const GITHUB_LINK = "https://github.com/k1my3ch4n/HackerRankAIHelper";
```

### 해결 방법

`src/constants/urls.ts` 파일을 생성하여 URL 상수를 통합 관리합니다.

### 변경된 파일

| 파일                               | 변경 내용          |
| ---------------------------------- | ------------------ |
| `src/constants/urls.ts`            | 새로 생성          |
| `src/components/Header/Header.tsx` | 상수 import로 변경 |
| `src/app/page.tsx`                 | 상수 import로 변경 |

### 새로운 상수 파일

```typescript
// src/constants/urls.ts
export const GITHUB_URL = "https://github.com/k1my3ch4n/HackerRankAIHelper";
export const HOME_URL = "/";
export const HELPER_URL = "/helper";
```

---

## 2. API 키 보안 강화

### 문제점

Gemini API 키가 `NEXT_PUBLIC_` 접두사로 인해 클라이언트 번들에 노출되었습니다.

```typescript
// Before (보안 취약)
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// 클라이언트에서 직접 Gemini API 호출
```

### 해결 방법

API Route를 생성하여 서버 사이드에서만 API 키를 사용하도록 변경했습니다.

### 아키텍처 변경

```
Before (보안 취약):
┌─────────────┐     ┌─────────────────┐
│  Client     │────>│  Gemini API     │
│  (API 키    │     │                 │
│   노출됨)   │     └─────────────────┘
└─────────────┘

After (보안 강화):
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│  Client     │────>│  /api/gemini│────>│  Gemini API     │
│  (API 키    │     │  (서버에서  │     │                 │
│   없음)     │     │   API 키    │     └─────────────────┘
└─────────────┘     │   보관)     │
                    └─────────────┘
```

### 변경된 파일

| 파일                                     | 변경 내용                              |
| ---------------------------------------- | -------------------------------------- |
| `src/app/api/gemini/route.ts`            | 새로 생성 - 서버 사이드 API 엔드포인트 |
| `src/api/useGeminiApi/useGeminiApi.ts`   | `/api/gemini` 호출로 변경              |
| `.github/workflows/ci.yml`               | 환경변수명 변경                        |
| `.github/workflows/cd.yml`               | 환경변수명 변경                        |
| `.github/actions/auto_deploy/action.yml` | build-arg 이름 변경                    |
| `Dockerfile`                             | ARG/ENV 이름 변경                      |

### 환경변수 변경

```diff
- NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
+ GEMINI_API_KEY=your_api_key
```

### GitHub Secrets 변경 필요

GitHub Repository Settings에서 Secret 이름을 변경해야 합니다:

```
Settings > Secrets and variables > Actions

NEXT_PUBLIC_GEMINI_API_KEY -> GEMINI_API_KEY
```

---

## 3. 에러 핸들링 개선

### 문제점

1. **useGeminiApi에서 에러 발생 시 사용자에게 피드백이 없음**

```typescript
// Before
} catch (error) {
  console.error("Gemini API 호출 중 오류:", error);
  // 사용자에게 에러 피드백이 없음
}
```

2. **scrape API 응답 검증 누락**

```typescript
// Before
const scrapeResponse = await fetch(`/api/scrape?url=${url}`);
const scrapeData = await scrapeResponse.json();
// scrapeResponse.ok 체크 없이 바로 json() 호출
```

3. **URL 인코딩 미적용**

```typescript
// Before - 특수문자 포함 시 문제 발생 가능
const scrapeResponse = await fetch(`/api/scrape?url=${url}`);
```

### 해결 방법

#### 3.1 에러 상태 관리 store 생성

**`src/stores/error/error.ts`** (신규)

```typescript
import { create } from "zustand";

interface ErrorState {
  error: string | null;
  setError: (message: string | null) => void;
  clearError: () => void;
}

const useError = create<ErrorState>((set) => ({
  error: null,
  setError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),
}));

export default useError;
```

#### 3.2 useGeminiApi 개선

**`src/api/useGeminiApi/useGeminiApi.ts`**

| 개선 항목            | 설명                              |
| -------------------- | --------------------------------- |
| scrape API 응답 검증 | `scrapeResponse.ok` 체크 추가     |
| 데이터 유효성 검증   | `title`, `content` 존재 여부 확인 |
| URL 인코딩           | `encodeURIComponent(url)` 적용    |
| 에러 상태 관리       | `setError()`, `clearError()` 활용 |
| 명확한 에러 메시지   | 단계별 구체적인 에러 메시지 제공  |

```typescript
// After
const { setError, clearError } = useError();

const fetchGeminiData = async ({ url, type = "summary" }) => {
  setIsLoading(true);
  clearError(); // 이전 에러 초기화

  try {
    // URL 인코딩 적용
    const scrapeResponse = await fetch(
      `/api/scrape?url=${encodeURIComponent(url)}`
    );

    // scrape API 응답 검증
    if (!scrapeResponse.ok) {
      const scrapeError = await scrapeResponse.json();
      throw new Error(
        scrapeError.error || "문제 페이지를 불러오는데 실패했습니다."
      );
    }

    const scrapeData = await scrapeResponse.json();

    // 데이터 유효성 검증
    if (!scrapeData || !scrapeData.title || !scrapeData.content) {
      throw new Error("문제 데이터를 추출하지 못했습니다.");
    }

    // ... Gemini API 호출 ...
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    setError(errorMessage); // 사용자에게 에러 피드백
    console.error("Gemini API 호출 중 오류:", error);
  } finally {
    setIsLoading(false);
  }
};
```

#### 3.3 UI 에러 표시

**`src/app/helper/page.tsx`**

- 에러 발생 시 빨간색 알림 박스 표시
- X 버튼으로 에러 닫기 기능
- 접근성을 위한 `aria-label` 추가

```tsx
{
  error && (
    <div className="... border border-red-500 rounded-xl bg-red-900/30">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <svg>...</svg> {/* 에러 아이콘 */}
          <p className="text-red-400">{error}</p>
        </div>
        <button onClick={clearError} aria-label="에러 닫기">
          <svg>...</svg> {/* 닫기 아이콘 */}
        </button>
      </div>
    </div>
  );
}
```

### 에러 처리 흐름

```
요청 시작
  └─ clearError() → 이전 에러 초기화
  └─ scrape API 호출
      ├─ 실패 시 → "문제 페이지를 불러오는데 실패했습니다."
      └─ 데이터 없음 → "문제 데이터를 추출하지 못했습니다."
  └─ Gemini API 호출
      ├─ 실패 시 → "AI 응답을 받는데 실패했습니다."
      └─ 응답 없음 → "AI 응답이 비어있습니다."
  └─ setError(message) → UI에 에러 표시
```

### 변경된 파일

| 파일                                   | 변경 내용                        |
| -------------------------------------- | -------------------------------- |
| `src/stores/error/error.ts`            | 새로 생성 - 에러 상태 관리 store |
| `src/stores/error/index.ts`            | 새로 생성 - export 파일          |
| `src/api/useGeminiApi/useGeminiApi.ts` | 에러 핸들링 로직 추가            |
| `src/app/helper/page.tsx`              | 에러 메시지 UI 추가              |

---

## 4. 타입 중복 제거

### 문제점

동일한 타입이 여러 파일에 중복 정의되어 있었습니다.

```typescript
// src/app/api/gemini/route.ts
type PromptType = "summary" | "hint" | "answer";

// src/stores/prompts/prompts.ts
export type TypeKey = "summary" | "hint" | "answer";

// src/api/useGeminiApi/useGeminiApi.ts
type?: "summary" | "hint" | "answer";  // 인라인 정의
```

### 해결 방법

공통 타입 파일을 생성하여 한 곳에서 관리합니다.

#### 4.1 공통 타입 파일 생성

**`src/types/prompt.ts`** (신규)

```typescript
export type PromptType = "summary" | "hint" | "answer";

export interface PromptData {
  type: PromptType;
  url: string;
  summary: string;
}
```

**`src/types/index.ts`** (신규)

```typescript
export type { PromptType, PromptData } from "./prompt";
```

#### 4.2 각 파일에서 공통 타입 import

```typescript
// Before
type PromptType = "summary" | "hint" | "answer";

// After
import type { PromptType } from "@/types";
```

### 변경된 파일

| 파일                                   | 변경 내용                                                 |
| -------------------------------------- | --------------------------------------------------------- |
| `src/types/prompt.ts`                  | 새로 생성 - 공통 타입 정의                                |
| `src/types/index.ts`                   | 새로 생성 - export 파일                                   |
| `src/app/api/gemini/route.ts`          | 공통 타입 import                                          |
| `src/stores/prompts/prompts.ts`        | `TypeKey` → `PromptType`, `PromptDataType` → `PromptData` |
| `src/stores/prompts/index.ts`          | `TypeKey` re-export 제거                                  |
| `src/app/helper/page.tsx`              | `TypeKey` → `PromptType`                                  |
| `src/api/useGeminiApi/useGeminiApi.ts` | 공통 타입 import                                          |

### 장점

- **단일 소스**: 타입 변경 시 한 곳만 수정하면 됨
- **일관성**: 모든 파일에서 동일한 타입명 사용
- **유지보수성**: 타입 정의 위치가 명확함

---

## 5. API 응답 타입 정의 추가

### 문제점

API 응답에 타입이 명시되지 않아 타입 안전성이 부족했습니다.

```typescript
// Before
const scrapeData = await scrapeResponse.json(); // any 타입
const result = await response.json(); // any 타입
```

### 해결 방법

#### 5.1 API 타입 정의 파일 생성

**`src/types/api.ts`** (신규)

```typescript
// 공통 에러 응답
export interface ApiErrorResponse {
  error: string;
}

// Scrape API 응답
export interface ScrapeSuccessResponse {
  message: string;
  title: string;
  content: string | null;
}

// Gemini API 응답
export interface GeminiSuccessResponse {
  summary: string;
}
```

#### 5.2 타입 적용

```typescript
// After
const scrapeError: ApiErrorResponse = await scrapeResponse.json();
const scrapeData: ScrapeSuccessResponse = await scrapeResponse.json();
const result: GeminiSuccessResponse = await response.json();
```

### 변경된 파일

| 파일                                   | 변경 내용                                |
| -------------------------------------- | ---------------------------------------- |
| `src/types/api.ts`                     | 새로 생성 - API 응답 타입 정의           |
| `src/types/index.ts`                   | API 타입 export 추가                     |
| `src/api/useGeminiApi/useGeminiApi.ts` | API 응답에 타입 적용                     |
| `src/app/api/scrape/route.ts`          | 캐시 타입 정의, `Map<string, CacheData>` |
| `src/app/api/gemini/route.ts`          | 요청/응답 타입 적용                      |

### 장점

- **타입 안전성**: API 응답 속성 접근 시 자동완성 지원
- **에러 감지**: 잘못된 속성 접근 시 컴파일 타임에 에러 감지
- **문서화**: 타입 정의가 API 스펙 문서 역할

---

## 6. Prettier 설정 추가

### 문제점

코드 포맷팅 규칙이 없어 일관성이 부족했습니다.

### 해결 방법

Prettier와 ESLint 연동을 설정했습니다.

#### 7.1 패키지 설치

```bash
pnpm add -D prettier eslint-config-prettier
```

#### 7.2 설정 파일 생성

**`.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**`.prettierignore`**

```
node_modules
.next
.git
pnpm-lock.yaml
```

#### 7.3 ESLint 연동

**`eslint.config.mjs`**

```javascript
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
];
```

### 변경된 파일

| 파일                | 변경 내용            |
| ------------------- | -------------------- |
| `.prettierrc`       | 새로 생성            |
| `.prettierignore`   | 새로 생성            |
| `eslint.config.mjs` | prettier 추가        |
| `package.json`      | format 스크립트 추가 |

### 사용법

```bash
pnpm format        # 전체 코드 포맷팅
pnpm format:check  # 포맷팅 체크만
```

---

## 7. 테마 시스템 중복 제거

### 문제점

Button과 NavigateButton에서 테마 스타일이 중복 정의되어 있었습니다.

```typescript
// Button.tsx
const buttonTheme = {
  black: "border border-white bg-black hover:bg-gray-700",
  main: "border border-main bg-main text-black hover:bg-main-hover",
  white: "border border-main bg-white text-black hover:bg-gray-300",
};

// NavigateButton.tsx
const themeClassName = {
  white: "border border-white bg-white",
  main: "border border-main bg-main",
};
```

### 해결 방법

#### 8.1 공통 테마 타입 및 스타일 정의

**`src/types/button.ts`** (신규)

```typescript
export type ButtonTheme = "black" | "main" | "white";

export const BUTTON_THEME_STYLES: Record<ButtonTheme, string> = {
  black: "border border-white bg-black hover:bg-gray-700",
  main: "border border-main bg-main text-black hover:bg-main-hover",
  white: "border border-main bg-white text-black hover:bg-gray-300",
};
```

#### 8.2 Button 컴포넌트 수정

```typescript
import { ButtonTheme, BUTTON_THEME_STYLES } from "@/types";

const Button = ({ theme = "black", ...props }: ButtonProps) => {
  return (
    <button className={`${baseStyles} ${BUTTON_THEME_STYLES[theme]}`}>
      {props.children}
    </button>
  );
};
```

#### 8.3 NavigateButton이 Button 재사용

```typescript
import Button from "@/components/Button";

const NavigateButton = ({ url, theme, children }: NavigateButtonProps) => {
  return (
    <Button theme={theme} onClick={() => router.push(url)}>
      {children}
    </Button>
  );
};
```

### 변경된 파일

| 파일                                               | 변경 내용                              |
| -------------------------------------------------- | -------------------------------------- |
| `src/types/button.ts`                              | 새로 생성 - ButtonTheme 타입 및 스타일 |
| `src/types/index.ts`                               | button 타입 export 추가                |
| `src/components/Button/Button.tsx`                 | 공통 테마 사용                         |
| `src/components/NavigateButton/NavigateButton.tsx` | Button 재사용, text→children           |
| `src/app/page.tsx`                                 | NavigateButton children 방식으로 변경  |

### 장점

- **단일 소스**: 테마 스타일 변경 시 한 곳만 수정
- **일관성**: 모든 버튼에서 동일한 테마 스타일 적용
- **재사용성**: NavigateButton이 Button을 확장하여 사용

---

## 8. 상태 초기화 메서드 추가

### 문제점

Zustand store에 상태 초기화 메서드가 없어 새 세션 시작 시 이전 데이터가 남아있었습니다.

### 해결 방법

각 store에 초기화 메서드를 추가했습니다.

```typescript
// prompts.ts
clearPrompts: () => set({ prompts: [] }),

// questionURL.ts
clearQuestionURL: () => set({ questionURL: "" }),

// isLoading.ts
resetIsLoading: () => set({ isLoading: false }),

// error.ts (기존)
clearError: () => set({ error: null }),
```

### 변경된 파일

| 파일                                    | 추가된 메서드        |
| --------------------------------------- | -------------------- |
| `src/stores/prompts/prompts.ts`         | `clearPrompts()`     |
| `src/stores/questionURL/questionURL.ts` | `clearQuestionURL()` |
| `src/stores/isLoading/isLoading.ts`     | `resetIsLoading()`   |

### 사용 예시

```typescript
const { clearPrompts } = usePrompts();
const { clearQuestionURL } = useQuestionURL();

// 새 세션 시작 시
clearPrompts();
clearQuestionURL();
```

---

## 9. CI/CD 및 Docker 보안 강화

### 문제점

Docker 빌드 시 API 키가 `--build-arg`로 전달되어 이미지 레이어에 노출되는 보안 문제가 있었습니다.

```yaml
# Before: 보안 취약
docker build --build-arg GEMINI_API_KEY=${{ inputs.gemini_api_key }} ...
```

Docker 빌드 시 다음 경고가 발생했습니다:

```
SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data
```

### 해결 방법

API 키를 빌드 시점이 아닌 런타임에 환경변수로 전달하도록 변경했습니다.

#### 9.1 Dockerfile 수정

```dockerfile
# Before
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
# ... 빌드 ...

# After
# ARG/ENV 제거 - 빌드 시 API 키 불필요
# ... 빌드 ...
# 런타임에 환경변수로 전달
```

#### 9.2 CI/CD 워크플로우 수정

**`ci.yml`** - 빌드 테스트에서 API 키 환경변수 제거

```yaml
# Before
env:
  GEMINI_API_KEY: ${{secrets.GEMINI_API_KEY}}

# After
# env 섹션 제거 (빌드에 불필요)
```

**`cd.yml`** - 동일하게 env 섹션 제거

**`auto_deploy/action.yml`** - 런타임 환경변수로 변경

```yaml
# Before: 빌드 시 ARG로 전달
docker build --build-arg GEMINI_API_KEY=${{ inputs.gemini_api_key }} ...
gcloud run deploy ...

# After: 런타임에 환경변수로 전달
docker build ...
gcloud run deploy ... --set-env-vars=GEMINI_API_KEY=${{ inputs.gemini_api_key }}
```

### 변경된 파일

| 파일                                     | 변경 내용                                 |
| ---------------------------------------- | ----------------------------------------- |
| `Dockerfile`                             | `ARG`, `ENV GEMINI_API_KEY` 제거          |
| `.github/workflows/ci.yml`               | `env: GEMINI_API_KEY` 제거                |
| `.github/workflows/cd.yml`               | `env: GEMINI_API_KEY` 제거                |
| `.github/actions/auto_deploy/action.yml` | `--build-arg` 제거, `--set-env-vars` 추가 |

### 장점

- **보안 강화**: API 키가 Docker 이미지에 포함되지 않음
- **이미지 재사용**: 동일 이미지를 다른 환경에서 다른 API 키로 사용 가능
- **Docker 경고 해결**: `SecretsUsedInArgOrEnv` 경고 제거

### Docker 실행 방법

```bash
# 로컬 실행
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key image_name

# Cloud Run은 --set-env-vars로 자동 설정됨
```

---

## 미완료 개선 사항

분석 결과 확인된 추가 개선 가능 항목들입니다.

### 높은 우선순위

- [x] 에러 핸들링 개선 ✅ 완료
- [x] 타입 중복 제거 ✅ 완료
- [x] API 응답 타입 정의 추가 ✅ 완료

### 중간 우선순위

- [x] Prettier 설정 추가 ✅ 완료
- [x] 테마 시스템 중복 제거 ✅ 완료

### 낮은 우선순위

- [ ] 테스트 코드 작성
- [x] 상태 초기화 메서드 추가 ✅ 완료

---

## 테스트 결과

| 테스트 항목                | 결과          |
| -------------------------- | ------------- |
| 메인 페이지 (`/`)          | 정상 (200 OK) |
| Helper 페이지 (`/helper`)  | 정상 (200 OK) |
| Gemini API (`/api/gemini`) | 정상 응답     |

---

## 참고

- 작성일: 2026-01-06
- 최종 수정일: 2026-01-07
- Next.js 버전: 16.0.8
- React 버전: 19.1.0
