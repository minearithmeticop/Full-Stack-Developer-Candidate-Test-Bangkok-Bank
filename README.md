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

## 📌 คำอธิบาย

แอปพลิเคชันสำหรับเก็บ Bookmarks ส่วนตัว โดยผู้ใช้สามารถบันทึก Links ได้โดยไม่ต้องกลัวผู้อื่นเห็นได้ ซึ่งผ่านการรับรองการยืนยันตัวตนผ่าน **Auth0 PKCE OIDC**

---

## 📁 โครงสร้างหลักของ Repository

```text
/.agents
/.github
/backend
/frontend
/transcripts
.gitignore
AGENTS.md
AI_WORKFLOW.md
API_DESIGN.md
DECISIONS.md
README.md
Makefile
docker-compose.yml
```

---

## 🌐 อธิบายภาพรวม

### 1. 📂 Github Repository Layout
* **Root Architecture**: โครงสร้างแบบ Monorepo ที่แยกงานส่วน Backend, Frontend และ Audit Infrastructure อย่างชัดเจน
* **Version Control Rules**: มีไฟล์ `.gitignore` ครอบคลุม `node_modules`, `.env`, `dist`, `build`, SQLite Database เช่น `dev.db` และไฟล์จาก IDE/OS

### 2. ⚡ NestJS Backend Structure (`/backend`)
* รันบน **Node.js >= 24.x**
* **Prisma ORM** ใช้ร่วมกับ SQLite Database Engine และ PostgreSQL 
  * สร้าง schema เป็น 2 files:
    * `schema.postgres.prisma`
    * `schema.sqlite.prisma`
* สร้าง Guard และ Middleware สำหรับตรวจสอบ `tenant-id` และ Auth0 JWT tokens
* รองรับ e2e automated testing ด้วย **Supertest** เพื่อทดสอบความปลอดภัยและการแยกข้อมูล tenant

### 3. 🎨 React + Vite + MUI v9 Frontend Structure (`/frontend`)
* **React 19+** (ไม่เอา Version ที่มีช่องโหว่) ร่วมกับ **Vite**
* **MUI v9**
* **Auth0 React SDK** สำหรับใช้กับ PKCE OAuth2 OIDC Flow

### 4. 🤖 Audit & Agent Infrastructure (`/transcripts` & `/.agents`)
* **Sub-Agent Skill**
* **Pre-Commit Verification**
* **Daily Transcripts**
* **Log Viewer**

---

## 🔌 การตั้งค่า Ports (Port Configuration)

| Service | Host & Port | Description |
| :--- | :--- | :--- |
| **Frontend** | `localhost:3000` | เพื่อใช้ในส่วน Auth0 Callback URL `http://localhost:3000/callback` |
| **Backend** | `localhost:3001` | RESTful API Service |

---

## 🚀 วิธีการติดตั้งและใช้งานโปรเจค (Installation & Running)

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

---

### 2. Environment Variables

#### Backend (`/backend/.env`)
```env
PORT=3001
DATABASE_URL=""
AUTH0_DOMAIN=""
AUTH0_AUDIENCE=""
```

#### Frontend (`/frontend/.env`)
```env
VITE_API_URL="http:localhost:3001"
VITE_AUTH0_DOMAIN=""
VITE_AUTH0_CLIENT_ID=""
VITE_AUTH0_AUDIENCE=""
VITE_AUTH0_REDIRECT_URI="http://localhost:3000/callback"
```

---

### 3. คำสั่งการรันระบบ (Development Mode)

#### รัน Backend (Port 3001)
```bash
cd backend
npm run start:dev:sqlite //สำหรับใช้งาน SQLite Database
# หรือ
npm run start:dev:postgres //สำหรับใช้งาน PostgresQL Database
```

#### รัน Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

---

### 4. ทดสอบ E2E Tests
```bash
cd backend
npm run test:e2e
```

---

## 📝 Git Commit Conventions

โปรเจกต์นี้กำหนดมาตรฐานการเขียน Commit Message ตามรูปแบบ Conventional Commits:

```text
<type>(<scope>): <description>
```

### Types (`<type>`)
* `feat`: เพิ่มฟีเจอร์ใหม่
* `fix`: แก้ไขบั๊ก
* `docs`: ปรับปรุงหรือเพิ่มเอกสาร (เช่น README, AGENTS.md)
* `test`: เพิ่มหรือแก้ไขระบบทดสอบ (เช่น E2E Supertest)
* `chore`: งานปรับปรุงโครงสร้าง/การตั้งค่าทั่วไป
* `refactor`: การปรับปรุงโครงสร้างโค้ดโดยไม่เปลี่ยนพฤติกรรมระบบ

### Scopes (`<scope>`)
* `agent`: Audit Infrastructure, Sub-Agent Skills และ Transcripts Log
* `frontend`: งานส่วน React, Vite, MUI v9 และ Auth0 Client
* `backend`: งานส่วน NestJS, Prisma ORM, Middleware และ Guards
* `security`: การจัดการสิทธิ์, Tenant Verification และ Auth0 JWT Tokens
* `api`: API Design, Endpoints และ DTOs
* `decisions`: เอกสารการตัดสินใจทางสถาปัตยกรรม (ADRs)

### ตัวอย่าง Commit Messages
* `feat(agent): setup transcript-logger sub-agent and initial transcripts`
* `docs(readme): update project structure and commit conventions`
* `feat(backend): implement tenant-id guard and auth0 middleware`
* `test(backend): add supertest e2e tests for tenant isolation`
