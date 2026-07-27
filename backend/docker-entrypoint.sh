#!/bin/sh
set -e

echo "=== Starting Backend Startup Sequence ==="

# Select Prisma Schema based on DATABASE_MODE or DATABASE_URL
if [ "$DATABASE_MODE" = "postgres" ] || echo "$DATABASE_URL" | grep -q "postgres"; then
  echo "[1/4] Selected Database Mode: PostgreSQL"
  SCHEMA_FILE="./prisma/schema.postgres.prisma"
else
  echo "[1/4] Selected Database Mode: SQLite"
  SCHEMA_FILE="./prisma/schema.sqlite.prisma"
fi

# Generate Prisma Client
echo "[2/4] Generating Prisma Client ($SCHEMA_FILE)..."
npx prisma generate --schema="$SCHEMA_FILE"

# Push database schema (create tables)
echo "[3/4] Pushing database schema..."
npx prisma db push --schema="$SCHEMA_FILE" --accept-data-loss

# Seed initial data for User A and User B
echo "[4/4] Seeding initial data (User A and User B)..."
npx ts-node prisma/seed.ts

echo "=== Startup Sequence Complete. Launching NestJS Server ==="
if [ -f dist/src/main.js ]; then
  exec node dist/src/main.js
elif [ -f dist/main.js ]; then
  exec node dist/main.js
else
  echo "Error: Neither dist/src/main.js nor dist/main.js was found!"
  exit 1
fi
