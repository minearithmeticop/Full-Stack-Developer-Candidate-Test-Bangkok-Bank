# Full-Stack Developer Candidate Test Bangkok Bank

<p align="center">
  <img src="https://img.shields.io/badge/BUILD%20STATUS-PASSING-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white" alt="BUILD STATUS" />
  <img src="https://img.shields.io/badge/E2E%20TESTS-100%25%20PASSED-success?style=for-the-badge&logo=jest&logoColor=white" alt="E2E TESTS" />
  <img src="https://img.shields.io/badge/NODE.JS-%3E%3D24.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NODE.JS" />
  <img src="https://img.shields.io/badge/NESTJS-v10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NESTJS" />
  <img src="https://img.shields.io/badge/REACT-19%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="REACT" />
  <img src="https://img.shields.io/badge/VITE-v6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="VITE" />
  <img src="https://img.shields.io/badge/AUTH0-PKCE%20OIDC-EB5424?style=for-the-badge&logo=auth0&logoColor=white" alt="AUTH0 PKCE OIDC" />
  <img src="https://img.shields.io/badge/PRISMA-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="PRISMA ORM" />
</p>

---

## 📌 คำอธิบายโครงการ (Project Description)

ระบบ **Personal Bookmark Manager (Bangkok Bank Candidate Test)** คือแอปพลิเคชันสำหรับบริหารจัดการและเว็บบุ๊กมาร์กส่วนตัวระดับองค์กร พัฒนาขึ้นเพื่อช่วยให้พนักงานและผู้ใช้สามารถบันทึก จัดหมวดหมู่ (Collections) และค้นหาเว็บลิงก์สำคัญได้อย่างปลอดภัย โดยมั่นใจได้ว่าข้อมูลทั้งหมดจะถูกเก็บเป็นความลับเฉพาะบุคคล ไม่สามารถเข้าถึงหรือถูกมองเห็นโดยผู้ใช้อื่นได้

ระบบได้รับการออกแบบด้วยสถาปัตยกรรม Monorepo สมัยใหม่ และผ่านการรับรองความปลอดภัยตามมาตรฐานสากล:
- **Authentication & Security**: การยืนยันตัวตนฝั่ง Client ด้วย Auth0 **PKCE OAuth2 OIDC Flow** และการตรวจสอบความถูกต้องของ JWT Access Token ฝั่ง Server ผ่านลายเซ็นดิจิทัล **RS256** ด้วย Auth0 **JWKS Endpoint**
- **Multi-Tenant Data Isolation**: ป้องกันการรั่วไหลของข้อมูลข้ามบัญชี 100% โดยการกรองข้อมูลด้วย `ownerId` ในทุกคำสั่ง Database Operation
- **High Performance API**: ออกแบบ Endpoint พิเศษ `GET /collections/all` (Single Payload Nested Data) เพื่อป้องกันปัญหา N+1 Query ตอนแสดงผลหน้าเว็บ
- **Dual Database Strategy**: รองรับทั้ง **SQLite Database Engine** สำหรับ Local Development & E2E Testing ที่รวดเร็ว และ **PostgreSQL** สำหรับสภาพแวดล้อม Production

---

## 📁 โครงสร้างหลักของ Repository (Repository Structure)

โครงสร้างโปรเจกต์จัดวางในรูปแบบ Monorepo แยกส่วนงานตามขอบเขตความรับผิดชอบอย่างชัดเจน:

```text
Full-Stack-Developer-Candidate-Test-Bangkok-Bank/
├── /.agents/                    # AI Agent skills, guidelines และระบบย่อย transcript-logger
├── /.github/                    # GitHub Actions CI/CD workflows และการตั้งค่า repository
├── /backend/                    # NestJS REST API Service, Prisma ORM และ Supertest E2E Tests
│   ├── /prisma/                 # Prisma Schemas (schema.sqlite.prisma & schema.postgres.prisma)
│   ├── /src/                    # Controllers, Services, Guards, Middleware, DTOs
│   └── /test/                   # Supertest E2E Security & Tenant Isolation Tests
├── /frontend/                   # React 19+ Client Application (Vite + MUI v9)
│   ├── /src/                    # UI Components, Custom Hooks, Auth0 Integration, Axios Client
│   └── index.html               # Frontend HTML Entry Point
├── /transcripts/                # ระบบ Audit Transcripts Logging
│   ├── index.html               # Modern Chat-style HTML Transcript Viewer
│   ├── logs-data.js             # Data Provider สำหรับแก้ปัญหา CORS ในโปรโตคอล file://
│   └── YYYY-MM-DD_[Model].log   # ไฟล์บันทึกประวัติการสนทนารายวันในรูปแบบ Text Format
├── .gitignore                   # กฎการยกเว้นไฟล์สำหรับ Version Control
├── AGENTS.md                    # Agent Guidelines, Security Invariants และ Git Commit Conventions
├── AI_WORKFLOW.md               # AI Collaboration Protocol, Milestone Roadmap และ Pre-commit Rules
├── API_DESIGN.md                # REST API Specifications, DTOs และ Error Handling Standards
├── DECISIONS.md                 # Architecture Decision Records (ADR-001 ถึง ADR-005)
├── README.md                    # คู่มือประกอบการใช้งานและการติดตั้งระบบ (เอกสารฉบับนี้)
├── Makefile                     # Shortcut Targets สำหรับคำสั่ง Development & Docker
├── docker-compose.yml           # Docker Compose Config สำหรับโหมด SQLite
└── docker-compose.postgres.yml  # Docker Compose Config สำหรับโหมด PostgreSQL
```

---

## 🌐 ภาพรวมสถาปัตยกรรมและเทคโนโลยี (Architecture Overview)

### 1. 📂 Monorepo Architecture Layout
* **Separation of Concerns**: แยกส่วน Backend (NestJS API), Frontend (React SPA) และ Audit Infrastructure (Transcripts Log) ออกจากกันอย่างสมบูรณ์ โค้ดฝั่ง Client ไม่สามารถเข้าถึงกุญแจความลับหรือฐานข้อมูลโดยตรงได้
* **Version Control Standards**: มี `.gitignore` ครอบคลุม `node_modules`, `.env`, `dist`, `build`, ไฟล์ฐานข้อมูล SQLite (`dev.db`), IDE Settings และ OS System Files

### 2. ⚡ NestJS Backend Structure (`/backend`)
* **Node.js**: รันบน Node.js Runtime เวอร์ชัน `>= 24.x`
* **Prisma ORM**: ใช้งาน Dual Database Schema Architecture:
  * `schema.sqlite.prisma`: ใช้งาน SQLite สำหรับ Local Dev & Automated Testing (Zero-dependency)
  * `schema.postgres.prisma`: ใช้งาน PostgreSQL สำหรับ Enterprise Production Environment
* **Security Guardrails**: มี `AuthGuard` ตรวจสอบ JWT Access Token ด้วย RS256 Signature ผ่าน Auth0 JWKS Endpoint
* **Automated E2E Testing**: มีชุดทดสอบด้วย **Supertest** สำหรับทดสอบ Security Boundary และ Tenant Isolation

### 3. 🎨 React + Vite + MUI v9 Frontend Structure (`/frontend`)
* **Core Framework**: React 19+ ร่วมกับ Vite 6+ เพื่อการ Build และ HMR ที่รวดเร็ว
* **UI Component Library**: Material UI (MUI v9) ควบคุม Design System และ Aesthetic Layout
* **Auth0 Integration**: `@auth0/auth0-react` SDK รองรับ PKCE OAuth2 OIDC Flow
* **Data Fetching & Caching**: TanStack Query (React Query v5+) ร่วมกับ Axios Interceptors

### 4. 🤖 Audit & Agent Infrastructure (`/transcripts` & `/.agents`)
* **Sub-Agent Skill**: `transcript-logger` สำหรับกำกับและบันทึกประวัติการสนทนาจริงระหว่าง User และ Agent
* **Daily Transcripts**: บันทึกไฟล์ `.log` รายวันตามมาตรฐานเวลา ISO 8601
* **Log Viewer**: หน้าเว็บ `transcripts/index.html` สไตล์ Modern Chat UI มีระบบ Parser ด้วย State Machine รองรับ Code Highlighting และดึงข้อมูลจาก `logs-data.js` เพื่อแก้ปัญหา CORS

---

## 🔌 การตั้งค่า Ports (Port Configuration Rationale)

| Service | Host & Port | Purpose & Rationale |
| :--- | :--- | :--- |
| **Frontend Service** | `http://localhost:3000` | พอร์ตมาตรฐานสำหรับ React SPA และตรงกับ Auth0 Allowed Callback URL (`http://localhost:3000/callback`), Allowed Logout URLs และ Allowed Web Origins |
| **Backend REST API** | `http://localhost:3001` | พอร์ตสำหรับ NestJS API Service แยกจาก Frontend เพื่อป้องกัน Port Collision และให้บริการ RESTful API Endpoints |
| **PostgreSQL Database** | `localhost:5432` | พอร์ตมาตรฐานของ PostgreSQL Database Engine (ใช้งานในโหมด PostgreSQL Container) |

---

## 🚀 การตั้งค่า Environment Variables (Configuration Setup)

ก่อนเริ่มรันแอปพลิเคชัน ให้คัดลอกและสร้างไฟล์ `.env` ในโฟลเดอร์ `/backend` และ `/frontend` ตามค่าตัวอย่างดังนี้:

### 1. Backend Environment Config (`/backend/.env`)
```env
# Server Port Configuration
PORT=3001

# Database Connection String
# สำหรับ SQLite Mode:
DATABASE_URL="file:./dev.db"
# สำหรับ PostgreSQL Mode (เมื่อใช้ Docker Compose PostgreSQL):
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookmark_db?schema=public"

# Auth0 Authentication Credentials (RS256 JWKS Verification)
AUTH0_DOMAIN="dev-yg.us.auth0.com"
AUTH0_AUDIENCE="https://bbl-candidate-test-api"
```

### 2. Frontend Environment Config (`/frontend/.env`)
```env
# Backend API Base URL
VITE_API_URL="http://localhost:3001"

# Auth0 Client Configuration (PKCE OIDC Flow)
VITE_AUTH0_DOMAIN="dev-yg.us.auth0.com"
VITE_AUTH0_CLIENT_ID="H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA"
VITE_AUTH0_AUDIENCE="https://bbl-candidate-test-api"
VITE_AUTH0_REDIRECT_URI="http://localhost:3000/callback"
```

> [!NOTE]
> **🔑 Public Test Tenant Credentials**:
> สามารถใช้บัญชีผู้ใช้และ Auth0 Client ID ต่อไปนี้สำหรับการทดสอบยืนยันตัวตนและการเข้าถึงระบบ (Public Test Tenant ไม่ใช่ข้อมูลความลับสำหรับ Production):
> - **Auth0 Client ID**: `H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA`
> - **Test User Email**: `candidate@test.com`
> - **Test User Password**: `@password1234`

---


## 💻 วิธีการติดตั้งและรันระบบ (Installation & Running Guide)

สามารถเลือกรันระบบได้ 3 รูปแบบตามความสะดวกของผู้พัฒนา:

### ทางเลือกที่ 1: รันด้วย Makefile Shortcuts (แนะนำสำหรับ Developer) ⭐

พิมพ์คำสั่ง `make` หรือ `make help` เพื่อดูรายการคำสั่งทั้งหมด:

```bash
# 1. แสดงรายการคำสั่งทั้งหมดและคู่มือการใช้งาน
make

# 2. รัน Backend ในโหมด SQLite (Port 3001)
make dev-sqlite

# 3. รัน Backend ในโหมด PostgreSQL (Port 3001)
make dev-postgres

# 4. รัน Frontend Dev Server (Port 3000)
make dev-frontend

# 5. รันชุดทดสอบ Supertest E2E Tests (ในโฟลเดอร์ backend)
make test-e2e

# 6. รัน Full Stack แบบ SQLite ผ่าน Docker Compose (Ports 3000 & 3001)
make docker-up

# 7. รัน Full Stack แบบ PostgreSQL ผ่าน Docker Compose (Ports 3000, 3001 & 5432)
make docker-postgres

# 8. หยุดและลบ Docker Containers ทั้งหมด
make docker-down

# 9. Build Production Bundles ทั้ง Backend และ Frontend
make build
```

---

### ทางเลือกที่ 2: รันด้วย Docker Compose (Full Stack Containerized)

#### โหมด 1: SQLite Full Stack
```bash
# เริ่มการทำงานของ Backend (SQLite) และ Frontend Containers
docker compose up -d

# ปิดการทำงานของ Containers
docker compose down --remove-orphans
```

#### โหมด 2: PostgreSQL Full Stack
```bash
# เริ่มการทำงานของ PostgreSQL Database (postgres:17-alpine), Backend และ Frontend Containers
docker compose -f docker-compose.postgres.yml up -d

# ปิดการทำงานของ Containers
docker compose -f docker-compose.postgres.yml down --remove-orphans
```

---

### ทางเลือกที่ 3: รันด้วย NPM Commands แบบสั่งการทีละส่วน (Manual Mode)

#### 1. ติดตั้ง Dependencies
```bash
# ติดตั้ง Packages ฝั่ง Backend
cd backend
npm install

# ติดตั้ง Packages ฝั่ง Frontend
cd ../frontend
npm install
```

#### 2. รัน Backend Service (Port 3001)
```bash
cd backend

# รันด้วย SQLite Database
npm run start:dev:sqlite

# หรือ รันด้วย PostgreSQL Database
npm run start:dev:postgres
```

#### 3. รัน Frontend Client (Port 3000)
```bash
cd frontend
npm run dev
```

#### 4. รันชุดทดสอบ E2E Tests
```bash
cd backend
npm run test:e2e
```

---

## 📝 Git Commit Conventions

ทุก Commit ภายในโปรเจกต์นี้ต้องปฏิบัติตามข้อกำหนด **Conventional Commits**:

```text
<type>(<scope>): <description>
```

### 1. Types (`<type>`)
* `feat`: การเพิ่มฟีเจอร์ใหม่
* `fix`: การแก้ไขบั๊กหรือข้อผิดพลาด
* `docs`: การสร้างหรือปรับปรุงเอกสาร (เช่น `README.md`, `AGENTS.md`)
* `test`: การเพิ่มหรือแก้ไขชุดทดสอบ (เช่น Supertest E2E tests)
* `chore`: งานปรับปรุงโครงสร้าง ค่าคอนฟิก หรือไฟล์บิลด์
* `refactor`: การปรับแต่งโครงสร้างโค้ดโดยไม่เปลี่ยนแปลงพฤติกรรมระบบ

### 2. Scopes (`<scope>`)
* `agent`: Audit Infrastructure, Sub-Agent Skills และ Transcripts Log
* `frontend`: โค้ดส่วน Frontend (React 19+, Vite, MUI v9, Auth0 Client)
* `backend`: โค้ดส่วน Backend (NestJS, Prisma ORM, Middleware, Guards)
* `security`: ระบบความปลอดภัย, Tenant Verification และ Auth0 JWT Tokens
* `api`: การออกแบบ API, Endpoints และ DTOs
* `decisions`: เอกสารสรุปการตัดสินใจทางสถาปัตยกรรม (ADRs)

### 3. ตัวอย่าง Commit Messages
* `feat(agent): setup transcript-logger sub-agent and initial transcripts`
* `docs(readme): update project structure and commit conventions`
* `feat(backend): implement tenant-id guard and auth0 middleware`
* `test(backend): add supertest e2e tests for tenant isolation`
* `chore(agent): add Makefile shortcuts for development and docker workflows`
