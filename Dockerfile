# 1. Сборка приложения
FROM node:20.18.0-bullseye AS build

# Устанавливаем системные сборщики для C++ модулей
RUN apt-get update && apt-get install -y curl python3 make g++ git

# Принудительно задаем Node-окружение для Meteor
ENV METEOR_ALLOW_SUPERUSER=1
ENV TOOL_NODE_FLAGS="--max-old-space-size=4096"
ENV DISABLE_RSPACK=1

# Устанавливаем Meteor
RUN curl https://install.meteor.com/ | sh

WORKDIR /app

# Копируем проект
COPY . .

# Устанавливаем npm-зависимости с отключением проверки движков
RUN npm install --engine-strict=false

# Собираем продакшен-бандл
RUN meteor build --directory /app/build --server-only --allow-superuser

# 2. Продакшен запуск
FROM node:20.18.0-bullseye-slim

WORKDIR /app

# Копируем результат сборки
COPY --from=build /app/build/bundle ./

# Устанавливаем зависимости сервера
RUN cd programs/server && npm install --production

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "main.js"]