# Build stage
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Run stage
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/.output /app/.output
COPY --from=build /app/drizzle.config.ts /app/drizzle.config.ts
COPY --from=build /app/server/database /app/server/database

EXPOSE 3000

RUN npm install drizzle-orm drizzle-kit @libsql/client
CMD ["sh", "-c", "npx drizzle-kit migrate && node .output/server/index.mjs"]
