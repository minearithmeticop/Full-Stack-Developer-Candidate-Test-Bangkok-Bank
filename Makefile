.PHONY: help dev-sqlite dev-postgres dev-frontend test-e2e docker-up docker-postgres docker-down build

.DEFAULT_GOAL := help

help: ## แสดงรายการคำสั่งทั้งหมดพร้อมคำอธิบาย (Display available commands)
	@echo "=========================================================================="
	@echo "          Personal Bookmark Manager - Development Shortcuts"
	@echo "=========================================================================="
	@echo "  make dev-sqlite     - Run backend in SQLite mode (Port 3001)"
	@echo "  make dev-postgres   - Run backend in PostgreSQL mode (Port 3001)"
	@echo "  make dev-frontend   - Run frontend dev server (Port 3000)"
	@echo "  make test-e2e       - Run backend Supertest E2E tests"
	@echo "  make docker-up      - Start SQLite Full Stack via Docker Compose"
	@echo "  make docker-postgres- Start PostgreSQL Full Stack via Docker Compose"
	@echo "  make docker-down    - Stop and remove all Docker containers"
	@echo "  make build          - Build production bundles for backend & frontend"
	@echo "=========================================================================="

dev-sqlite: ## Run backend with SQLite Database
	cd backend && npm run start:dev:sqlite

dev-postgres: ## Run backend with PostgreSQL Database
	cd backend && npm run start:dev:postgres

dev-frontend: ## Run frontend Vite development server
	cd frontend && npm run dev

test-e2e: ## Run backend Supertest E2E tests
	cd backend && npm run test:e2e

docker-up: ## Start SQLite Full Stack in Docker Compose
	docker compose up -d

docker-postgres: ## Start PostgreSQL Full Stack in Docker Compose
	docker compose -f docker-compose.postgres.yml up -d

docker-down: ## Stop and remove all Docker Compose containers
	docker compose down --remove-orphans
	docker compose -f docker-compose.postgres.yml down --remove-orphans

build: ## Build production bundles for backend and frontend
	cd backend && npm run build
	cd frontend && npm run build
