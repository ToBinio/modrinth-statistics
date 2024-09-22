
FROM node:latest as build
WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

RUN npm run build

# Run
FROM node:latest
WORKDIR /app

# Add docker-compose-wait tool -------------------
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

COPY --from=build /app/.output /app/.output

EXPOSE 3000
CMD [ "sh", "-c", "/wait && node .output/server/index.mjs" ]