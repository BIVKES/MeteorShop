FROM node:18-bullseye-slim AS build

RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*


RUN curl https://install.meteor.com/ | sh


ENV METEOR_ALLOW_SUPERUSER=1

WORKDIR /app


COPY package*.json ./


COPY . .

RUN meteor build --directory /app/build --server-only --allow-superuser

FROM node:18-bullseye-slim

WORKDIR /app

COPY --from=build /app/build/bundle ./

RUN cd programs/server && npm install

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "main.js"]