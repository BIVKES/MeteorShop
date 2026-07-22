
FROM node:14-bullseye AS build


RUN apt-get update && apt-get install -y curl python3 make g++ git


ENV METEOR_ALLOW_SUPERUSER=1


RUN curl https://install.meteor.com/ | sh

WORKDIR /app


COPY . .


RUN npm install --unsafe-perm


RUN meteor build --directory /app/build --server-only --allow-superuser


FROM node:14-bullseye-slim

WORKDIR /app


COPY --from=build /app/build/bundle ./


RUN cd programs/server && npm install --production

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "main.js"]