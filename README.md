# ระบบร้องเรียนการทุจริต | อบจ.เชียงราย

React + Vite + Firebase (Firestore, Storage, Auth) — deploy บน Vercel

## ความปลอดภัยก่อน push GitHub

ไฟล์เหล่านี้ **ห้าม** commit:

| ไฟล์ | เหตุผล |
|------|--------|
| `.env.local` | Firebase API keys / config |
| `.env`, `.env.*.local` | ค่าลับอื่น ๆ |
| `serviceAccount*.json` | Firebase Admin SDK (สิทธิ์สูง) |

ตรวจสอบก่อน push ทุกครั้ง:

```powershell
git status
git check-ignore -v .env.local
```

ต้องเห็นว่า `.env.local` ถูก ignore

---

## 1) Push ขึ้น GitHub

```powershell
cd "d:\!อบจ เชียงราย\ปีงบประมาณ 2569\report-corrup"

# ตรวจว่าไม่มีไฟล์ลับ
git status

git add .
git commit -m "Initial release: complaint system with admin dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/report-corrup.git
git push -u origin main
```

> แนะนำ: ตั้ง GitHub repo เป็น **Private** สำหรับระบบหน่วยงานรัฐ

---

## 2) Deploy บน Vercel

1. ไปที่ [vercel.com](https://vercel.com) → **Add New Project**
2. Import repo จาก GitHub
3. Framework: **Vite** (auto-detect)
4. ตั้ง **Environment Variables** ทั้ง 6 ตัว (คัดลอกจาก `.env.local`):

| Variable | ตัวอย่าง |
|----------|----------|
| `VITE_FIREBASE_API_KEY` | จาก Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `report-corrup-cr.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `report-corrup-cr` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `report-corrup-cr.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ตัวเลขจาก Firebase |
| `VITE_FIREBASE_APP_ID` | จาก Firebase Console |

5. กด **Deploy**

---

## 3) ตั้งค่า Firebase หลัง deploy

### Authorized domains
Firebase Console → **Authentication** → **Settings** → **Authorized domains**

เพิ่มโดเมน Vercel เช่น:
- `your-project.vercel.app`
- โดเมนจริงของหน่วยงาน (ถ้ามี)

### Deploy Security Rules (ทำจากเครื่อง dev)

```powershell
firebase login
firebase use report-corrup-cr
firebase deploy --only firestore:rules,storage:rules
```

---

## 4) Checklist ความปลอดภัย

- [ ] `.env.local` ไม่ถูก commit
- [ ] GitHub repo เป็น Private (แนะนำ)
- [ ] ตั้ง env vars บน Vercel แล้ว (ไม่ hardcode ในโค้ด)
- [ ] Deploy `firestore.rules` และ `storage.rules` แล้ว
- [ ] สร้าง admin ใน Firebase Auth + collection `admins/{UID}`
- [ ] เปิด Email/Password ใน Authentication
- [ ] เพิ่ม Vercel domain ใน Firebase Authorized domains
- [ ] (แนะนำ) เปิด **Firebase App Check** + reCAPTCHA v3 ภายหลัง

---

## หมายเหตุ

- ค่า `VITE_*` จะอยู่ใน bundle ฝั่ง browser — เป็นเรื่องปกติของ Firebase Web App
- ความปลอดภัยหลักอยู่ที่ **Firestore Rules**, **Storage Rules**, และ **Admin Auth**
- อย่าเก็บ Firebase Admin SDK / service account ใน repo นี้
