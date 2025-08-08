# syntax=docker/dockerfile:1
FROM node:20-slim AS base
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
    else npm install --legacy-peer-deps; fi

COPY . .

RUN npm run build

EXPOSE 3000
ENV PORT=3000
CMD ["npm","start"]


