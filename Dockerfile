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

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
