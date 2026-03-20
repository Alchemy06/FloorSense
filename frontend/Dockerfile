FROM node:24-alpine AS builder
RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]