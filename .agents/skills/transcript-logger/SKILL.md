---
name: transcript-logger
description: sub-agent skill สำหรับบันทึกประวัติการสนทนาจริงระหว่าง user และ agent เป็นไฟล์ text log รายวัน พร้อม transcript reader html viewer
---

# Transcript Logger Sub-Agent Skill

สคิลนี้ใช้สำหรับกำกับดูแลและบันทึกประวัติการสนทนาจริงระหว่าง **USER** และ **AGENT** ทุกครั้งที่มีการรับส่ง Prompt ในระบบ โดยบันทึกออกมาเป็นไฟล์ Text Log รายวัน (`.log`) ในโฟลเดอร์ `/transcripts` และแสดงผลผ่านหน้าเว็บ HTML Transcript Reader Viewer (`/transcripts/index.html`)

---

## 1. ข้อกำหนดและมาตรฐานการบันทึก Log (Logging Specifications)

### 1.1 ไฟล์และไดเรกทอรี
- **โฟลเดอร์จัดเก็บ**: `/transcripts` (อยู่ที่ root directory ของโปรเจกต์)
- **รูปแบบชื่อไฟล์**: `YYYY-MM-DD_[AgentModel].log`
  - ตัวอย่าง: `2026-07-27_Gemini3.6Flash.log`
  - หากมีการเปลี่ยน Model ในวันนั้น ให้ใช้ชื่อ Model สอดคล้องกับ Model ปัจจุบันโดยลบสัญลักษณ์พิเศษหรือช่องว่างส่วนเกิน
- **มาตรฐานเวลา**: ใช้ ISO 8601 Timestamp พร้อม Timezone Offset
  - รูปแบบ: `YYYY-MM-DDTHH:mm:ss+07:00` (เช่น `2026-07-27T01:45:00+07:00`)
- **การต่อเติมไฟล์ (Append)**: ต่อเติมข้อความท้ายไฟล์เดิมเสมอเมื่อเกิด Turn ใหม่ในวันเดียวกัน

---

## 2. รูปแบบโครงสร้างไฟล์ Log (Specification Structure)

ไฟล์ `.log` แต่ละไฟล์จะต้องเริ่มต้นด้วย Header ของ Session (ในกรณีสร้างไฟล์ใหม่) และตามด้วย Entry ของแต่ละ Turn ดังนี้:

```text
=========================================
SESSION LOG: YYYY-MM-DD | MODEL [AgentModel]
=========================================

[TIMESTAMP: YYYY-MM-DDTHH:mm:ss+07:00]
--- USER REPORT ---
<ข้อความ User Prompt จริงทั้งหมด>

--- AGENT RESPONSE ---
<ข้อความ Agent Response จริงทั้งหมด>

=========================================
```

### คำอธิบายโครงสร้าง:
- `SESSION LOG:` ระบุ วันที่ และ Model ที่ใช้งาน
- `[TIMESTAMP: ...]` ระบุเวลาเริ่มต้นของ Turn นั้นๆ
- `--- USER REPORT ---` ตัวแบ่งเริ่มต้นข้อความ User Prompt
- `--- AGENT RESPONSE ---` ตัวแบ่งเริ่มต้นข้อความ Agent Response
- `=========================================` ตัวแบ่งปิดท้าย Turn Block

---

## 3. ระบบอ่านไฟล์บันทึก HTML Viewer (`/transcripts/index.html`) & Embedded Data (`/transcripts/logs-data.js`)

หน้าเว็บอ่าน Log ถูกสร้างขึ้นมาให้อ่านไฟล์ `.log` ได้อย่างสวยงาม เสมือนอยู่ใน Chat Application โดยมีคุณสมบัติดังนี้:

1. **Navbar Log Selector Dropdown**:
   - แสดงรายการไฟล์ Log บน Navbar ในรูปแบบ `<select>` Dropdown เพื่อประหยัดพื้นที่หน้าจอ
   - มีปุ่ม `📁 Open .log File` รองรับการเลือกไฟล์ `.log` จากเครื่องโลคอล

2. **Auto-Load & Sort**:
   - เมื่อเปิดหน้า `index.html` ระบบจะทำการโหลดไฟล์ Log ล่าสุดขึ้นมาแสดงผลโดยอัตโนมัติทันที

3. **Robust Code Fence & State Machine Parser**:
   - Parser ทำงานด้วย State Machine และมีการตรวจจับ Markdown Code Fences (```)
   - หากข้อความภายใน User Prompt หรือ Agent Response มีการพิมพ์สัญลักษณ์ `--- USER REPORT ---`, `--- AGENT RESPONSE ---` หรือ `=========================================` ไว้ข้างในบล็อกโค้ด ระบบ Parser จะมองเป็นข้อความธรรมดา ไม่ทำให้เกิดการตัดแบ่ง Turn ผิดพลาด

4. **UI Card Layout & Syntax Highlighting**:
   - จัดกลุ่มการสนทนาของแต่ละ Turn ไว้ใน Card เดียวกัน (ประกอบด้วย Timestamp, Status `OK`, ส่วน `💬 USER PROMPT` และ `🤖 AGENT RESPONSE`)
   - รองรับ Markdown formatting และ Syntax Code Highlighting (Prism.js) พร้อมปุ่ม Copy โค้ด

---

## 4. กฎการหนีอักขระพิเศษสำหรับ `transcripts/logs-data.js` (CRITICAL ESCAPING RULES)

เนื่องจากไฟล์ `logs-data.js` จัดเก็บเนื้อหา Log ไว้ในตัวแปร JavaScript Template Literal (`window.EMBEDDED_TRANSCRIPTS["..."] = \`...\``) ทุกครั้งที่ Agent ทำการสร้างหรือต่อเติมเนื้อหาลงใน `logs-data.js` **ต้องทำการ Escape อักขระพิเศษทุกตัวต่อไปนี้ก่อนแปะลงไฟล์เสมอ** เพื่อป้องกันปัญหา JavaScript SyntaxError ที่จะทำให้ไฟล์พังทั้งไฟล์:

### ⚠️ กฎการ Escape อักขระ 3 ข้อบังคับเด็ดขาด:
1. **Backtick (`` ` ``)**: ต้องเปลี่ยนเป็น `\` ` เสมอ (เพื่อไม่ให้หลุดขอบเขต Template Literal)
2. **Backslash (`\`)**: ต้องเปลี่ยนเป็น `\\` เสมอ
3. **Template Interpolation (`${`)**: ต้องเปลี่ยนเป็น `\${` เสมอ (เพื่อไม่ให้ JS ประมวลผลเป็น Variable Interpolation)

---

### 💡 ตัวอย่าง Before / After ในการ Escape ข้อมูลสำหรับ `logs-data.js`:

#### ตัวอย่างที่ 1: การ Escape Backticks ในข้อความคำอธิบายหรือชื่อไฟล์
- **ข้อความต้นฉบับ (Raw Agent Response)**:
  ```text
  สร้างไฟล์ `/backend/package.json` และ `tsconfig.json` เรียบร้อย
  ```
- **ข้อความหลังจาก Escape สำหรับแปะใน `logs-data.js`**:
  ```javascript
  สร้างไฟล์ \`/backend/package.json\` และ \`tsconfig.json\` เรียบร้อย
  ```

#### ตัวอย่างที่ 2: การ Escape `${}` Interpolation และ Backticks ในบล็อกโค้ด
- **ข้อความต้นฉบับ (Raw Agent Response)**:
  ```text
  กำหนดพอร์ตผ่าน `${PORT}` ในไฟล์ `main.ts`
  ```
- **ข้อความหลังจาก Escape สำหรับแปะใน `logs-data.js`**:
  ```javascript
  กำหนดพอร์ตผ่าน \${PORT} ในไฟล์ \`main.ts\`
  ```

#### ตัวอย่างที่ 3: การ Escape Backslash ใน Path
- **ข้อความต้นฉบับ (Raw Agent Response)**:
  ```text
  ไฟล์อยู่ที่ `C:\Users\usEr\project`
  ```
- **ข้อความหลังจาก Escape สำหรับแปะใน `logs-data.js`**:
  ```javascript
  ไฟล์อยู่ที่ \`C:\\Users\\usEr\\project\`
  ```

---

## 5. ข้อบังคับ Pre-commit Verification Rule

ก่อนทำการ `git commit` ทุกครั้ง Agent ต้องปฏิบัติตามขั้นตอน ดังนี้:
1. ตรวจสอบ Syntax ของไฟล์ JavaScript ด้วยคำสั่ง:
   ```bash
   node -c transcripts/logs-data.js
   ```
2. ทำการทดสอบ Build และรัน NestJS E2E Test ด้วยคำสั่ง:
   ```bash
   cd backend && npm run test:e2e
   ```
3. หากขั้นตอนใดขั้นตอนหนึ่งล้มเหลว ห้ามทำการ `git commit` โดยเด็ดขาด และต้องทำการแก้ไขข้อผิดพลาดให้ผ่าน 100% ก่อนเสมอ
