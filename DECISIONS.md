# DECISIONS.md - Architecture Decision Records (ADRs)

เอกสารบันทึกการตัดสินใจทางสถาปัตยกรรม (Architecture Decision Records) สำหรับระบบ **Personal Bookmark Manager (Bangkok Bank Candidate Test)**

---

## 📋 ดัชนี ADR (ADR Index)

| ADR ID | หัวข้อการตัดสินใจ (Title) | สถานะ (Status) |
| :--- | :--- | :--- |
| **ADR-001** | การใช้ JWT Access Token แทน ID Token ในการยื่นขอรับบริการ API | Accepted |
| **ADR-002** | การยืนยันความถูกต้องของ JWT ผ่าน Auth0 JWKS (RS256 Algorithm) | Accepted |
| **ADR-003** | ยุทธศาสตร์ฐานข้อมูลแบบคู่ (SQLite สำหรับ Dev/Test & PostgreSQL สำหรับ Prod) | Accepted |
| **ADR-004** | นโยบายการลบ Collection แบบตั้งค่า `collectionId = null` (ไม่ใช่ Cascade Delete) | Accepted |
| **ADR-005** | การใช้ TanStack Query ร่วมกับ Axios สำหรับ Frontend Server-State Management | Accepted |

---

## 🏛️ รายละเอียดการตัดสินใจ (Architecture Decision Records)

### ADR-001: การใช้ JWT Access Token แทน ID Token ในการยื่นขอรับบริการ API

* **Status**: Accepted
* **Context (บริบท)**:
  ในการเชื่อมต่อระหว่าง React Frontend และ NestJS Backend ผ่านระบบ Auth0 OIDC/OAuth2 มี Token หลัก 2 ประเภทเกิดขึ้น คือ ID Token และ Access Token
* **Decision (การตัดสินใจ)**:
  ตกลงใช้ **JWT Access Token** ใน HTTP Header `Authorization: Bearer <access_token>` สำหรับการร้องขอข้อมูลไปยัง NestJS Backend API ทั้งหมด
* **Rationale (เหตุผล)**:
  1. **Purpose Alignment**: ID Token ถูกออกแบบตามมาตรฐาน OpenID Connect เพื่อระบุตัวตนของผู้ใช้ให้กับ Client Application (React Frontend) นำไปแสดงผล UI เท่านั้น ส่วน Access Token ถูกออกแบบตามมาตรฐาน OAuth 2.0 สำหรับให้ Resource Server (NestJS API) ตรวจสอบสิทธิ์การเข้าถึงทรัพยากร
  2. **Audience Restriction**: Access Token ประกอบด้วย Field `aud` (Audience) ที่ระบุ Identifier ของ Backend API โดยตรง ช่วยป้องกันการนำ Token ไปสวมรอยใช้กับบริการอื่น

---

### ADR-002: การยืนยันความถูกต้องของ JWT ผ่าน Auth0 JWKS (RS256 Algorithm)

* **Status**: Accepted
* **Context (บริบท)**:
  Backend ต้องยืนยันความถูกต้องของ JWT Token ที่ส่งมาจากผู้ใช้ โดยต้องมั่นใจว่าเป็น Token ที่ออกโดย Auth0 Domain ที่ถูกต้อง และไม่ถูกปลอมแปลงข้อมูล
* **Decision (การตัดสินใจ)**:
  ใช้การตรวจสอบลายเซ็นดิจิทัลแบบ **Asymmetric Encryption (RS256)** โดยดึง Public Key จาก Auth0 **JWKS (JSON Web Key Set)** Endpoint (`https://<AUTH0_DOMAIN>/.well-known/jwks.json`) ร่วมกับ `jwks-rsa` และ Passport JWT Strategy
* **Rationale (เหตุผล)**:
  1. **Zero Secret Sharing**: Backend ไม่ต้องถือ Secret Key ใดๆ ช่วยลดความเสี่ยงจากการหลุดของ Private Key
  2. **Automatic Key Rotation**: ระบบรองรับการหมุนเวียน Key (Key Rotation) ของ Auth0 ได้โดยอัตโนมัติ โดย `jwks-rsa` จะทำการ Cache Public Keys ไว้และดึง Keys ใหม่เมื่อมีการอัปเดต

---

### ADR-003: ยุทธศาสตร์ฐานข้อมูลแบบคู่ (SQLite สำหรับ Dev/Test & PostgreSQL สำหรับ Prod)

* **Status**: Accepted
* **Context (บริบท)**:
  การพัฒนาระบบต้องการความรวดเร็วในการรัน Local Development และ Automated E2E Testing แต่ในสภาพแวดล้อม Production ต้องรองรับการทำงานแบบ Enterprise High Availability
* **Decision (การตัดสินใจ)**:
  สร้าง Prisma Schema เป็น 2 ไฟล์แยกกันอย่างชัดเจน:
  - `schema.sqlite.prisma`: สำหรับ Local Development และ Supertest E2E Automated Testing (ใช้ SQLite File-based Database)
  - `schema.postgres.prisma`: สำหรับ Production Deployment (ใช้ PostgreSQL Database Engine)
* **Rationale (เหตุผล)**:
  1. **Zero-Dependency Local Dev**: ผู้พัฒนาและเครื่อง CI/CD สามารถรันชุดทดสอบ E2E ได้ทันทีโดยไม่ต้องติดตั้งหรือเปิดใช้ Docker Container
  2. **Production-Grade Reliability**: PostgreSQL ให้ประสิทธิภาพสูง รองรับ Concurrent Transactions และการย้ายระบบขึ้น Cloud Infrastructure ขององค์กร

---

### ADR-004: นโยบายการลบ Collection แบบตั้งค่า `collectionId = null` (ไม่ใช่ Cascade Delete)

* **Status**: Accepted
* **Context (บริบท)**:
  เมื่อผู้ใช้ทำการลบกลุ่มหมวดหมู่ (Collection) ของ Bookmarks คำถามสำคัญคือควรจัดการกับ Bookmarks ที่อยู่ภายใน Collection นั้นอย่างไร
* **Decision (การตัดสินใจ)**:
  กำหนดนโยบายความสัมพันธ์ใน Prisma Schema เป็น **`onDelete: SetNull`** เมื่อ Collection ถูกลบ `collectionId` ของ Bookmarks ที่เกี่ยวข้องทั้งหมดจะถูกปรับเป็น `null` (ย้ายไปอยู่หมวด "Uncategorized")
* **Rationale (เหตุผล)**:
  1. **Prevent Data Loss**: ลิงก์ Bookmarks เป็นข้อมูลสำคัญของผู้ใช้ การลบกลุ่มจัดหมวดหมู่ไม่ควรส่งผลให้ลิงก์ที่ถูกบันทึกไว้สูญหาย
  2. **User Experience**: ผู้ใช้สามารถย้าย Bookmarks ที่กลายเป็น Uncategorized ไปยัง Collection ใหม่ได้ในภายหลัง

---

### ADR-005: การใช้ TanStack Query ร่วมกับ Axios สำหรับ Frontend Server-State Management

* **Status**: Accepted
* **Context (บริบท)**:
  React Frontend ต้องการจัดการข้อมูล異步 (Async Data) การทำ Caching การจัดการสถานะ Loading/Error และการซิงโครไนซ์ข้อมูลกับ Backend API
* **Decision (การตัดสินใจ)**:
  เลือกใช้ **TanStack Query (React Query v5+)** ทำหน้าที่บริหารจัดการ Server State และใช้ **Axios** เป็น HTTP Client ที่มี Interceptor สำหรับแนบ Auth0 Access Token
* **Rationale (เหตุผล)**:
  1. **Decoupled UI & Data Fetching**: ลดปัญหา Boilerplate Code เช่น `useState` และ `useEffect` ในการดึงข้อมูล
  2. **Smart Caching & Background Refetching**: มีระบบ Automatic Invalidation และ Refetching เมื่อข้อมูลเปลี่ยนแปลง ทำให้ UI อัปเดตแบบ Real-time และรวดเร็ว
  3. **Axios Interceptors**: รวมศูนย์การแนบ `Authorization: Bearer <token>` และการจัดการ Global Error Responses (401, 403, 500) ไว้ที่เดียว
