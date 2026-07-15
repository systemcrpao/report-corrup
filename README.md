# ระบบร้องเรียนการทุจริต | อบจ.เชียงราย

React + Vite + Firebase (Firestore, Storage, Auth) — deploy บน Vercel

## ฟีเจอร์หลัก

- ประชาชน: แจ้งเรื่อง, ติดตามสถานะ, แนบหลักฐาน, เลือก อำเภอ/ตำบล
- เจ้าหน้าที่: Dashboard แยกตามปี, จัดการเรื่อง, พิมพ์รายงาน (Sarabun)
- Session admin หมดอายุอัตโนมัติ **6 ชั่วโมง**
- ฟอนต์ UI: **Kanit** | เอกสารรายงาน: **Sarabun**

---

## ความปลอดภัย (Public Repository)

Repo นี้เป็น **public** เพื่อ collab — อ่าน [SECURITY.md](./SECURITY.md) และ [CONTRIBUTING.md](./CONTRIBUTING.md) ก่อน push

### ไฟล์ที่ห้าม commit

| ไฟล์ | เหตุผล |
|------|--------|
| `.env.local` | Firebase config |
| `.env`, `.env.*.local` | ค่าลับอื่น ๆ |
| `serviceAccount*.json` | Firebase Admin SDK |

### เริ่มต้นพัฒนา

```powershell
npm ci
copy .env.example .env.local
# ใส่ค่า VITE_FIREBASE_* จาก Firebase Console
npm run dev
```

ตรวจสอบก่อน push:

```powershell
git status
git check-ignore -v .env.local
```

---

## Deploy บน Vercel

1. Import repo จาก GitHub
2. Framework: **Vite**
3. ตั้ง **Environment Variables** ทั้ง 6 ตัว:

| Variable | ตัวอย่าง |
|----------|----------|
| `VITE_FIREBASE_API_KEY` | จาก Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `report-corrup-cr.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `report-corrup-cr` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `report-corrup-cr.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ตัวเลขจาก Firebase |
| `VITE_FIREBASE_APP_ID` | จาก Firebase Console |

4. Deploy

---

## Firebase หลัง deploy

### Authorized domains
Authentication → Settings → Authorized domains — เพิ่มโดเมน Vercel

### Deploy Security Rules

```powershell
firebase login
firebase use report-corrup-cr
firebase deploy --only firestore:rules,storage
```

### สร้าง Admin

1. Authentication → เปิด Email/Password → สร้าง user
2. Firestore → collection `admins` → document ID = **Firebase UID**
3. ฟิลด์: `{ email, active: true, name }`

---

## Checklist ความปลอดภัย

- [ ] `.env.local` ไม่ถูก commit (CI secret scan ตรวจด้วย)
- [ ] ตั้ง env vars บน Vercel (ไม่ hardcode)
- [ ] Deploy `firestore.rules` และ `storage.rules`
- [ ] Admin อยู่ใน `admins/{UID}` เท่านั้น
- [ ] Authorized domains ครบ
- [ ] (แนะนำ) Firebase App Check + reCAPTCHA v3

---

## หมายเหตุ

- ค่า `VITE_*` อยู่ใน browser bundle — ปกติของ Firebase Web App
- ความปลอดภัยหลัก: **Firestore Rules**, **Storage Rules**, **Admin Auth**
- การพิมพ์รายงานใช้ hidden iframe (ไม่ต้องอนุญาต popup)
