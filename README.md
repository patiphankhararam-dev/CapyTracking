# Capy Tracking 🐹💗 (Period Tracker)

> เว็บแอปติดตามรอบเดือน (Period Tracker) แบบ Mobile-first ใช้งานง่าย นุ่มนวล ไม่ต้องสมัครสมาชิกหรือ Login ข้อมูลถูกจัดเก็บอย่างปลอดภัย 100% ภายในเครื่องของคุณ (Local Storage) พร้อมนำไป Deploy บน Vercel, Netlify หรือ GitHub Pages ได้ทันที

---

## 🌸 จุดเด่นของแอป (Key Features)

- **🐹 น้องคาปิ (Mascot)**: คาปิบาร่าเพื่อนคู่ใจพร้อมเปลี่ยนอารมณ์ตามบริบท (พักผ่อน, ให้กำลังใจ, แสดงความยินดี, ยิ้มสดใส)
- **🔒 ความเป็นส่วนตัว 100%**: ไม่มีการสร้างบัญชี ไม่ส่งข้อมูลสุขภาพไปยังเซิร์ฟเวอร์ใด ๆ ทั้งสิ้น ทุกอย่างทำงานแบบ Client-side Offline-first
- **⚡ Quick Log (“เปิด → เลื่อน → แตะ → บันทึก”)**: สไลเดอร์ระดับความปวด (0–10), พลังงาน (0–10), อาการ Flow (None, Light, Medium, Heavy), Mood Emojis และบันทึกข้อความสั้น
- **📅 Interactive Calendar**: ปฏิทินรอบเดือนสีพาสเทล พร้อมสัญลักษณ์สถานะ Flow, ความปวด และแตะเพื่อดู/แก้ไขได้ทันที
- **📊 Real Insights & Patterns**: วิเคราะห์สถิติจากข้อมูลจริงของคุณ (ไม่มี Fake Data) พร้อมคำแนะนำที่อ่อนโยนและไม่ตัดสิน
- **💬 Capy Tips & Smart Messages**: ข้อความภาษาไทยกว่า 100+ ข้อความ แบ่งตามระยะรอบเดือน (Menstrual, Follicular, Ovulation, Luteal) และปรับตามระดับความปวด/พลังงานจริง
- **💾 สำรองและกู้คืน (Export / Import JSON)**: ย้ายข้อมูลระหว่างมือถือและคอมพิวเตอร์ได้อย่างอิสระ พร้อมระบบตรวจสอบความปลอดภัยก่อนเขียนทับ

---

## 🛠️ ความต้องการของระบบ (Prerequisites)

- **Node.js**: เวอร์ชัน 18.0.0 ขึ้นไป (แนะนำ Node 20 LTS หรือ 22 LTS)
- **Package Manager**: `npm`, `yarn`, `pnpm` หรือ `bun`

---

## 🚀 คู่มือการใช้งานและการติดตั้ง (Getting Started)

### 1. วิธีติดตั้ง (Install Dependencies)

ดาวน์โหลดหรือโคลนโปรเจกต์ จากนั้นเปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรัน:

```bash
npm install
```

### 2. วิธีรันในเครื่อง (Local Development)

รันเซิร์ฟเวอร์จำลองสำหรับการพัฒนา:

```bash
npm run dev
```

เปิดเว็บเบราว์เซอร์แล้วเข้าไปที่ `http://localhost:3000` (หรือพอร์ตที่ Terminal ระบุ)

### 3. วิธีการ Build สำหรับ Production

คำสั่งนี้จะคอมไพล์ TypeScript และ Tailwind CSS เป็น Static Web Files ในโฟลเดอร์ `dist/`:

```bash
npm run build
```

คุณสามารถทดสอบไฟล์ผลลัพธ์ Production ก่อนขึ้นระบบจริงได้ด้วย:

```bash
npm run preview
```

---

## 🌐 คำแนะนำในการ Deploy สู่บริการ Hosting ภายนอก

โปรเจกต์นี้เป็น **Client-side Single Page Application (SPA)** เต็มรูปแบบ จึงสามารถนำขึ้นโฮสติ้งฟรีระดับโลกได้ทันที:

### 4. วิธี Deploy ไป Vercel

1. สร้างบัญชีที่ [Vercel](https://vercel.com/)
2. กดปุ่ม **"Add New Project"** แล้วเลือก GitHub Repository ของคุณ
3. ในหน้า Configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. โปรเจกต์มีไฟล์ `vercel.json` รวมไว้ให้แล้ว เพื่อป้องกันปัญหา Error 404 เมื่อ Refresh หน้าเว็บ
5. กด **"Deploy"** — เมื่อเสร็จสิ้นคุณจะได้ URL สาธารณะใช้งานได้ทันที

### 5. วิธี Deploy ไป Netlify

1. สร้างบัญชีที่ [Netlify](https://www.netlify.com/)
2. กด **"Add new site"** > **"Import an existing project"**
3. เลือก GitHub Repository ของโปรเจกต์นี้
4. การตั้งค่าระบบ Build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. โปรเจกต์มีไฟล์ `netlify.toml` กำหนดค่า Redirect ไว้พร้อมแล้ว
6. กด **"Deploy Site"**

### 6. วิธี Deploy ไป GitHub Pages

1. ในไฟล์ `vite.config.ts` ให้กำหนด `base: '/<ชื่อ-repo>/'` หากโฮสต์ใน Sub-path
2. รันคำสั่ง Build:
   ```bash
   npm run build
   ```
3. พุชโฟลเดอร์ `dist` ไปยังบรานช์ `gh-pages` หรือตั้งค่า GitHub Actions สำหรับ Static Pages

---

## 🔐 สถาปัตยกรรมความปลอดภัยและความเป็นส่วนตัว (Privacy Architecture)

> “ข้อมูลของคุณถูกเก็บไว้ในอุปกรณ์นี้ และ Capy Tracking ไม่จำเป็นต้องส่งข้อมูลไปยังเซิร์ฟเวอร์เพื่อใช้งาน”

- **No Remote Database**: ไม่ใช้ Firestore, Cloud SQL หรือฐานข้อมูลภายนอก ข้อมูลปลอดภัยอยู่ใน Local Storage ของเบราว์เซอร์
- **No Mock / Fake Data**: เมื่อเริ่มใช้งานครั้งแรก หากยังไม่มีข้อมูล จะแสดง Empty State ที่มีน้องคาปิคอยต้อนรับอย่างอบอุ่น ไม่สร้างตัวเลขสุ่ม
- **Self-Contained**: เมื่อ Deploy แล้ว สามารถทำงานได้ตลอดเวลาโดยไม่ต้องพึ่งพา Google AI Studio

---

## 📄 ลิขสิทธิ์และการใช้งาน

พัฒนาด้วย React 19, TypeScript, Tailwind CSS, และ Lucide Icons
มอบความใส่ใจและอ่อนโยนให้ทุกวันของคุณ 🐹💗
