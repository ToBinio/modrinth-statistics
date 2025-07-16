
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun i --fronzen-lockfile

COPY . .

RUN bun run build

# Run
FROM oven/bun:1
WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000
CMD [ "bun", ".output/server/index.mjs" ]
