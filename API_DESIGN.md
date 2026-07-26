# API_DESIGN.md - REST API Specification

เอกสารข้อกำหนดการออกแบบ RESTful API สำหรับระบบ **Personal Bookmark Manager (Bangkok Bank Candidate Test)**

---

## 🔒 กฎความปลอดภัยและการยืนยันตัวตนระดับระบบ (Global Authentication & Tenant Policy)

1. **Authentication Rule**:
   - ทุก Endpoint (ยกเว้น `GET /health`) จำเป็นต้องแนบ HTTP Header:
     ```http
     Authorization: Bearer <AUTH0_ACCESS_TOKEN>
     ```
   - Backend จะทำการยิงตรวจสอบ Signature ของ Token ผ่าน Auth0 JWKS Endpoint (`/.well-known/jwks.json`) หาก Token ไม่ถูกต้องหรือหมดอายุ ระบบจะตอบกลับด้วย `401 Unauthorized`

2. **Multi-Tenant Isolation Rule**:
   - ข้อมูลผู้ใช้ในคลังข้อมูลจะถูกจัดเก็บโดยมีฟิลด์ `ownerId` (ค่า `sub` จาก Auth0 JWT) กำกับไว้เสมอ
   - ทุก API Operations จะบังคับกรองข้อมูลด้วย `ownerId` ของผู้ใช้ที่เข้าสู่ระบบเท่านั้น ผู้ใช้จะไม่สามารถดู แก้ไข หรือลบข้อมูลของผู้อื่นได้ (หากพยายามเข้าถึงข้อมูลผู้อื่นจะได้รับ `404 Not Found` หรือ `403 Forbidden`)

---

## 📌 สรุปรายการ Endpoints (API Endpoints Overview)

| Method | Endpoint Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | ❌ No | ตรวจสอบสถานะการทำงานของระบบ (Health Check) |
| `GET` | `/api/v1/me` | ✅ Yes | ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบันจาก Auth0 JWT |
| `GET` | `/api/v1/collections` | ✅ Yes | ดึงรายการ Collections ทั้งหมดของผู้ใช้ |
| `GET` | `/api/v1/collections/all` | ✅ Yes | ดึง Collections ทั้งหมดพร้อม Bookmarks ที่ซ้อนอยู่ข้างใน (Single Payload / Anti-N+1) |
| `POST` | `/api/v1/collections` | ✅ Yes | สร้าง Collection ใหม่ |
| `GET` | `/api/v1/collections/:id` | ✅ Yes | ดึงรายละเอียด Collection ตาม ID |
| `PATCH` | `/api/v1/collections/:id` | ✅ Yes | แก้ไขข้อมูล Collection |
| `DELETE` | `/api/v1/collections/:id` | ✅ Yes | ลบ Collection (ตั้งค่า `collectionId = null` ใน Bookmarks) |
| `GET` | `/api/v1/bookmarks` | ✅ Yes | ดึงรายการ Bookmarks (ค้นหา/กรองตาม Collection ได้) |
| `POST` | `/api/v1/bookmarks` | ✅ Yes | สร้าง Bookmark ใหม่ |
| `GET` | `/api/v1/bookmarks/:id` | ✅ Yes | ดึงรายละเอียด Bookmark ตาม ID |
| `PATCH` | `/api/v1/bookmarks/:id` | ✅ Yes | แก้ไขข้อมูล Bookmark |
| `DELETE` | `/api/v1/bookmarks/:id` | ✅ Yes | ลบ Bookmark ออกจากระบบ |

---

## 🛠️ รายละเอียดสเปกของแต่ละ Endpoint (Endpoint Details)

### 1. System Health Check

#### `GET /health`
* **Description**: ตรวจสอบความพร้อมของระบบ API และ Database connection
* **Response `200 OK`**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-07-27T03:30:00.000Z"
  }
  ```

---

### 2. User Profile

#### `GET /api/v1/me`
* **Description**: ดึงข้อมูลโปรไฟล์ของผู้ใช้จาก JWT Access Token
* **Response `200 OK`**:
  ```json
  {
    "sub": "auth0|6677889900aabbcc",
    "email": "candidate@bbl.co.th",
    "name": "Bangkok Bank Candidate",
    "picture": "https://lh3.googleusercontent.com/a/default-user"
  }
  ```

---

### 3. Collections API

#### `GET /api/v1/collections`
* **Description**: ดึงรายการ Collections ทั้งหมดของ ownerId ปัจจุบัน
* **Response `200 OK`**:
  ```json
  [
    {
      "id": "clx111222333",
      "name": "Work Links",
      "description": "Internal developer portals and tools",
      "ownerId": "auth0|6677889900aabbcc",
      "createdAt": "2026-07-27T01:00:00.000Z",
      "updatedAt": "2026-07-27T01:00:00.000Z"
    }
  ]
  ```

---

#### `GET /api/v1/collections/all` ⭐ (Anti-N+1 Query Endpoint)
* **Description**: ดึงทุก Collections ของผู้ใช้ปัจจุบัน พร้อมรายการ Bookmarks ที่อยู่ข้างในแบบ Nested Array ภายใน Request เดียว เพื่อป้องกันปัญหา N+1 Query ตอนหน้า Frontend ต้องการแสดงผล Collections และ Bookmarks พร้อมกัน
* **Response `200 OK`**:
  ```json
  [
    {
      "id": "clx111222333",
      "name": "Work Links",
      "ownerId": "auth0|6677889900aabbcc",
      "bookmarks": [
        {
          "id": "bmx999888777",
          "url": "https://portal.bbl.co.th",
          "title": "BBL Developer Portal",
          "notes": "Internal API documentation and specs",
          "createdAt": "2026-07-27T01:05:00.000Z",
          "updatedAt": "2026-07-27T01:05:00.000Z"
        }
      ],
      "createdAt": "2026-07-27T01:00:00.000Z",
      "updatedAt": "2026-07-27T01:00:00.000Z"
    }
  ]
  ```

---

#### `POST /api/v1/collections`
* **Description**: สร้าง Collection ใหม่
* **Request Body (CreateCollectionDto)**:
  ```json
  {
    "name": "Work Links",
    "description": "Internal developer portals and tools"
  }
  ```
* **Response `201 Created`**:
  ```json
  {
    "id": "clx111222333",
    "name": "Work Links",
    "description": "Internal developer portals and tools",
    "ownerId": "auth0|6677889900aabbcc",
    "createdAt": "2026-07-27T01:00:00.000Z",
    "updatedAt": "2026-07-27T01:00:00.000Z"
  }
  ```

---

#### `GET /api/v1/collections/:id`
* **Description**: ดึงข้อมูล Collection รายตัวตาม ID
* **Response `200 OK`**:
  ```json
  {
    "id": "clx111222333",
    "name": "Work Links",
    "description": "Internal developer portals and tools",
    "ownerId": "auth0|6677889900aabbcc",
    "createdAt": "2026-07-27T01:00:00.000Z",
    "updatedAt": "2026-07-27T01:00:00.000Z"
  }
  ```

---

#### `PATCH /api/v1/collections/:id`
* **Description**: แก้ไขชื่อหรือคำอธิบายของ Collection
* **Request Body (UpdateCollectionDto)**:
  ```json
  {
    "name": "Updated Work Links",
    "description": "Updated description"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "id": "clx111222333",
    "name": "Updated Work Links",
    "description": "Updated description",
    "ownerId": "auth0|6677889900aabbcc",
    "createdAt": "2026-07-27T01:00:00.000Z",
    "updatedAt": "2026-07-27T02:00:00.000Z"
  }
  ```

---

#### `DELETE /api/v1/collections/:id`
* **Description**: ลบ Collection (ตามนโยบาย ADR-004 จะทำการปรับ `collectionId` ของ Bookmarks ที่เคยสังกัด Collection นี้ให้กลายเป็น `null`)
* **Response `204 No Content`**

---

### 4. Bookmarks API

#### `GET /api/v1/bookmarks`
* **Description**: ดึงรายการ Bookmarks ของ ownerId ปัจจุบัน (รองรับ Query Parameters `collectionId` และ `search`)
* **Query Parameters**:
  - `collectionId` (optional): กรองตาม Collection ID (หรือ `uncategorized` สำหรับ bookmarks ที่ไม่มี collection)
  - `search` (optional): ค้นหาจาก title, url หรือ notes
* **Response `200 OK`**:
  ```json
  [
    {
      "id": "bmx999888777",
      "url": "https://portal.bbl.co.th",
      "title": "BBL Developer Portal",
      "notes": "Internal API documentation",
      "collectionId": "clx111222333",
      "ownerId": "auth0|6677889900aabbcc",
      "createdAt": "2026-07-27T01:05:00.000Z",
      "updatedAt": "2026-07-27T01:05:00.000Z"
    }
  ]
  ```

---

#### `POST /api/v1/bookmarks`
* **Description**: สร้าง Bookmark ใหม่
* **Request Body (CreateBookmarkDto)**:
  ```json
  {
    "url": "https://portal.bbl.co.th",
    "title": "BBL Developer Portal",
    "notes": "Internal API documentation",
    "collectionId": "clx111222333"
  }
  ```
* **Response `201 Created`**:
  ```json
  {
    "id": "bmx999888777",
    "url": "https://portal.bbl.co.th",
    "title": "BBL Developer Portal",
    "notes": "Internal API documentation",
    "collectionId": "clx111222333",
    "ownerId": "auth0|6677889900aabbcc",
    "createdAt": "2026-07-27T01:05:00.000Z",
    "updatedAt": "2026-07-27T01:05:00.000Z"
  }
  ```

---

#### `GET /api/v1/bookmarks/:id`
* **Description**: ดึงข้อมูล Bookmark รายตัวตาม ID
* **Response `200 OK`**:
  ```json
  {
    "id": "bmx999888777",
    "url": "https://portal.bbl.co.th",
    "title": "BBL Developer Portal",
    "notes": "Internal API documentation",
    "collectionId": "clx111222333",
    "ownerId": "auth0|6677889900aabbcc",
    "createdAt": "2026-07-27T01:05:00.000Z",
    "updatedAt": "2026-07-27T01:05:00.000Z"
  }
  ```

---

#### `PATCH /api/v1/bookmarks/:id`
* **Description**: แก้ไขข้อมูล Bookmark (url, title, notes, collectionId)
* **Request Body (UpdateBookmarkDto)**:
  ```json
  {
    "title": "Updated BBL Portal",
    "collectionId": null
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "id": "bmx999888777",
    "url": "https://portal.bbl.co.th",
    "title": "Updated BBL Portal",
    "notes": "Internal API documentation",
    "collectionId": null,
    "ownerId": "auth0|6677889900aabbcc",
    "createdAt": "2026-07-27T01:05:00.000Z",
    "updatedAt": "2026-07-27T02:10:00.000Z"
  }
  ```

---

#### `DELETE /api/v1/bookmarks/:id`
* **Description**: ลบ Bookmark ออกจากระบบ
* **Response `204 No Content`**

---

## ⚠️ โครงสร้าง Error Responses มาตรฐาน (Standard Error Responses)

เมื่อเกิดข้อผิดพลาด NestJS Exceptions จะส่งผ่านโครงสร้าง JSON ดังนี้:

* **`400 Bad Request`** (Validation Failed):
  ```json
  {
    "statusCode": 400,
    "message": ["url must be a valid URL address", "title should not be empty"],
    "error": "Bad Request"
  }
  ```

* **`401 Unauthorized`** (Token Missing / Invalid):
  ```json
  {
    "statusCode": 401,
    "message": "Unauthorized access: Invalid or expired Bearer token",
    "error": "Unauthorized"
  }
  ```

* **`404 Not Found`** (Resource not found or owned by another tenant):
  ```json
  {
    "statusCode": 404,
    "message": "Bookmark with ID bmx999888777 not found",
    "error": "Not Found"
  }
  ```
