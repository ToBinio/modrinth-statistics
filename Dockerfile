
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

RUN npm run build

# Run
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]
