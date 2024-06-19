
FROM oven/bun:1 as build
WORKDIR /app

COPY package.json .
RUN bun i

COPY . .

RUN bun run build

# Run
FROM oven/bun:1
WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]