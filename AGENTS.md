# AGENTS.md - Agent Instructions & Commit Conventions

เอกสารฉบับนี้ใช้สำหรับกำกับดูแลการทำงานของ AI Agent และ Sub-Agents ภายในโครงการ **Full-Stack Developer Candidate Test Bangkok Bank**

---

## 1. 📝 Git Commit Conventions

ทุก Commit ภายใน Repository จะต้องปฏิบัติตามข้อกำหนดการเขียน Commit Message แบบ Conventional Commits ดังนี้:

```text
<type>(<scope>): <description>
```

### 1.1 Types (`<type>`)
* `feat`: การเพิ่มฟีเจอร์ใหม่
* `fix`: การแก้ไขบั๊กหรือข้อผิดพลาด
* `docs`: การสร้างหรือปรับปรุงเอกสาร (เช่น README.md, AGENTS.md)
* `test`: การเพิ่มหรือแก้ไขชุดทดสอบ (เช่น Supertest e2e tests)
* `chore`: การปรับปรุงค่าคอนฟิกหรือไฟล์บิลด์
* `refactor`: การปรับแต่งโครงสร้างโค้ดโดยไม่เปลี่ยนแปลงพฤติกรรม

### 1.2 Scopes (`<scope>`)
* `agent`: Audit Infrastructure, Sub-Agent Skills และ Transcripts Log
* `frontend`: โค้ดส่วน Frontend (React 19+, Vite, MUI v9, Auth0 Client)
* `backend`: โค้ดส่วน Backend (NestJS, Prisma ORM, Middleware, Guards)
* `security`: ระบบความปลอดภัย, Tenant Verification และ Auth0 JWT Tokens
* `api`: การออกแบบ API, Endpoints และ DTOs
* `decisions`: เอกสารสรุปการตัดสินใจทางสถาปัตยกรรม (ADRs)

### 1.3 ตัวอย่างการใช้งาน Commit Messages
* `feat(agent): setup transcript-logger sub-agent and initial transcripts`
* `docs(readme): update project structure and commit conventions`
* `feat(backend): implement tenant-id guard and auth0 middleware`
* `test(backend): add supertest e2e tests for tenant isolation`

---

## 2. 🛡️ Strict Pre-commit Verification Guardrails

ก่อนทำการ `git commit` ทุกครั้ง Agent ต้องทำการทดสอบและตรวจสอบความถูกต้องของโค้ดล่วงหน้า (Pre-commit Verification) เสมอ:

1. **Linting & Formatting**:
   - เรียกใช้ `npx lint-staged` รวมถึงการทำ `eslint --fix` และ `prettier --write` กับไฟล์ที่ถูกแก้ไข
2. **Type Checking & E2E Testing**:
   - รันการตรวจสอบ Type ด้วยคำสั่ง `npm run type-check`
   - รันชุดทดสอบ E2E ด้วยคำสั่ง `npm run test:e2e` (ในโฟลเดอร์ backend)
3. **Strict Enforcement**:
   - หากขั้นตอนใดขั้นตอนหนึ่งข้างต้น **FAILED** ห้ามทำการ `git commit` โดยเด็ดขาด และต้องทำการแก้ไขข้อผิดพลาดให้ผ่าน 100% ก่อนเสมอ (ในกรณีที่โฟลเดอร์หรือสคริปต์ดังกล่าวยังไม่ถูกสร้างในระยะเริ่มต้น ให้ยกเว้นเฉพาะส่วนที่ยังไม่มี)

---

## 3. 🛠️ AI Agent Self-Correction & Recovery Protocol

เมื่อเกิดข้อผิดพลาดในการบิลด์, การรัน Test, Linting หรือ Runtime AI Agent ต้องปฏิบัติตามแนวทางการแก้ไขปัญหาดังนี้:

1. **Inspect Full Error Logs**:
   - ตรวจสอบและอ่าน Error Log ฉบับเต็มอย่างละเอียดเสมอ เพื่อวิเคราะห์สาเหตุที่แท้จริง (Root Cause) ว่าเกิดจากจุดใดและเพราะเหตุใด
2. **Fix Underlying Logic (No Superficial Fixes)**:
   - แก้ไขที่ตรรกะของโค้ด (Logic) ให้ถูกต้องตามข้อกำหนดที่แท้จริง
   - **ห้าม** แก้ปัญหาแบบฉาบฉวยโดยการคอมเมนต์โค้ดทิ้ง (Comment out broken code)
   - **ห้าม** ปิดการใช้งานกฎ Linter/Compiler เช่น การใส่ `eslint-disable` หรือ `@ts-ignore` เพื่อหลบหลีกการตรวจจับ
   - **ห้าม** ครอบโค้ดที่ทำงานล้มเหลวด้วย `try/catch` ว่างเปล่า (Empty catch blocks) หรือ swallowing exceptions

---

## 4. 🔒 Security Invariants (หลักความปลอดภัยขั้นเด็ดขาด)

ระบบต้องปฏิบัติตาม Security Invariants ทั้ง 4 ข้อนี้อย่างเคร่งครัดโดยไม่มีข้อละเว้น:

1. **Multi-tenant Data Isolation**:
   - ทุก Database Query (Prisma Operations: `findMany`, `findOne`, `create`, `update`, `delete`) **ต้องกรองด้วย `ownerId`** ของ User ปัจจุบันที่ดึงจาก Auth0 JWTเสมอ ป้องกันการรั่วไหลของข้อมูลข้าม Tenant (Cross-tenant Data Leakage) 100%
2. **DTO & Payload Validation**:
   - ทุก Request Body และ Query Parameters ต้องได้รับการตรวจสอบผ่าน `ValidationPipe` ของ NestJS ร่วมกับ `class-validator` และ `class-transformer` เพื่อป้องกัน Injection Attcks และ Malformed Payloads
3. **Auth0 Authentication with PKCE & JWKS Verification**:
   - ฝั่ง Frontend ต้องยืนยันตัวตนผ่าน Auth0 PKCE OIDC Flow
   - ฝั่ง Backend ต้องยืนยันสิทธิ์ผ่าน `AuthGuard` ด้วยการตรวจสอบ JWT Access Token แบบ RS256 Signature Verification โดยดึง Public Key จาก Auth0 JWKS Endpoint (`/.well-known/jwks.json`)
4. **Clean Monorepo Architectural Separation**:
   - แยกส่วน Backend (NestJS + Prisma ORM) และ Frontend (React 19+ + Vite + MUI v9 + React Router) ออกจากกันอย่างชัดเจน โค้ดฝั่ง Client ห้ามเข้าถึง Database หรือ Private Secrets โดยตรง

---

## 5. 📐 Coding Guidelines & Quality Standards

1. **Explicit Return Types**:
   - ฟังก์ชันและเมธอดทุกตัวใน TypeScript ทั้ง Backend และ Frontend ต้องระบุ Return Type อย่างชัดเจน (เช่น `async findAll(ownerId: string): Promise<CollectionResponseDto[]>`)
2. **NestJS Built-in Exceptions**:
   - ใช้ NestJS HTTP Exceptions มาตรฐาน (`NotFoundException`, `UnauthorizedException`, `ForbiddenException`, `BadRequestException`) **ห้าม** สร้าง Custom Generic Error Object ขึ้นมาเอง เพื่อให้ระบบส่ง HTTP Status Codes และ Response Structure ตามมาตรฐาน REST API
3. **UI Standard Component Library**:
   - ฝั่ง Frontend ใช้ Material UI (MUI v9) เป็น UI Component Library หลักของระบบ เพื่อควบคุม Aesthetics และ Design System ให้สอดคล้องกันทั้งแอปพลิเคชัน

---

## 6. 📜 Daily Transcript Logging Requirement

1. Agent ต้องทำการบันทึกประวัติการสนทนาทุกครั้งที่มีการส่ง User Prompt และ Agent Response ลงในไฟล์ Text Log รายวันในโฟลเดอร์ `/transcripts`
2. รูปแบบชื่อไฟล์: `/transcripts/YYYY-MM-DD_[AgentModel].log` (เช่น `/transcripts/2026-07-27_Gemini3.6Flash.log`)
3. ใช้มาตรฐานเวลา ISO 8601 format: `YYYY-MM-DDTHH:mm:ss+07:00`
4. อัปเดตข้อมูลไฟล์ `/transcripts/logs-data.js` เพื่อให้ `index.html` (Transcript Viewer) สามารถโหลดข้อมูลล่าสุดขึ้นมาแสดงผลได้โดยไม่ติดปัญหา CORS
