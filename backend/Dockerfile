# Stage 1: Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG DATABASE_MODE=sqlite
RUN if [ "$DATABASE_MODE" = "postgres" ]; then \
      cp ./prisma/schema.postgres.prisma ./prisma/schema.prisma; \
    else \
      cp ./prisma/schema.sqlite.prisma ./prisma/schema.prisma; \
    fi

RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

# Stage 2: Production runner stage
FROM node:24-alpine AS runner

RUN apk add --no-cache openssl bash

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig*.json ./
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]
