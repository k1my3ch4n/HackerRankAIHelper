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
