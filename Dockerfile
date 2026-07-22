FROM node:20-bullseye AS build

# Устанавливаем необходимые зависимости
RUN apt-get update && apt-get install -y curl python3 make g++ git

# Настройки окружения для Meteor внутри Docker
ENV METEOR_ALLOW_SUPERUSER=1
ENV TOOL_NODE_FLAGS="--max-old-space-size=4096"

# Устанавливаем Meteor
RUN curl https://install.meteor.com/ | sh

WORKDIR /app

# Копируем всё содержимое проекта
COPY . .

# Собираем бандл без прогона тестов и мобильных билдов
RUN meteor build --directory /app/build --server-only --allow-superuser --architecture os.linux.x86_64

# Этап запуска
FROM node:20-bullseye-slim

WORKDIR /app

# Копируем скомпилированный бандл
COPY --from=build /app/build/bundle ./

# Устанавливаем продакшен-зависимости скомпилированного сервера
RUN cd programs/server && npm install --production

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "main.js"]