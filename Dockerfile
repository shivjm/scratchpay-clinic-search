ARG NODE_VERSION

FROM node:$NODE_VERSION-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json tsconfig.production.json ./

COPY src ./src

COPY data ./data

RUN npm run build

RUN npm prune --production

FROM gcr.io/distroless/nodejs:14

WORKDIR /app

COPY --from=builder /app/dist dist

COPY --from=builder /app/node_modules node_modules

COPY .env.example ./

CMD ["/app/dist/src/index.js"]
