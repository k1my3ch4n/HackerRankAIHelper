FROM node:20-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/usr/local/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# standalone 출력물 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# 런타임에 GEMINI_API_KEY 환경변수 전달 필요
# docker run -e GEMINI_API_KEY=your_key ...
CMD ["node", "server.js"]