
FROM node:latest as build
WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

RUN npm run build

# Run
FROM node:latest
WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]