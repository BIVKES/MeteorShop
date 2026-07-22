FROM geoffreybooth/meteor-base:2.13 AS build

ENV PATH="${PATH}:/root/.meteor"

WORKDIR /app

COPY package*.json ./
COPY .meteor ./.meteor

RUN meteor npm install

COPY . .

RUN meteor build --directory /app/build --server-only

FROM node:14-alpine

WORKDIR /app

COPY --from=build /app/build/bundle ./

RUN cd programs/server && npm install

ENV PORT=3000
EXPOSE 3000

CMD ["node", "main.js"]