# Security Policy — ระบบร้องเรียนการทุจริต อบจ.เชียงราย

## ขอบเขต

โปรเจกต์นี้เป็น **Public GitHub repository** สำหรับพัฒนาร่วมกัน โค้ดฝั่ง frontend เปิดเผยได้ แต่ **ค่าลับและข้อมูลส่วนบุคคลต้องไม่ถูก commit**

## สิ่งที่ห้าม commit

| ประเภท | ตัวอย่าง |
|--------|----------|
| Environment secrets | `.env.local`, `.env`, `.env.production` |
| Firebase Admin SDK | `serviceAccount*.json`, private keys |
| ข้อมูลส่วนบุคคล | รายชื่อผู้ร้องเรียน, ไฟล์หลักฐานจริง, dump ฐานข้อมูล |
| Credentials อื่น | `.pem`, `.key`, API tokens |

ใช้ `.env.example` เป็น template — คัดลอกเป็น `.env.local` ในเครื่อง dev เท่านั้น

## การจัดการ secrets สำหรับ Collaborators

1. **Local dev:** สร้าง `.env.local` จาก `.env.example` (ไฟล์นี้ถูก `.gitignore` แล้ว)
2. **Vercel:** ตั้งค่า Environment Variables ใน dashboard — ไม่ hardcode ในโค้ด
3. **Firebase:** ความปลอดภัยหลักอยู่ที่ `firestore.rules`, `storage.rules`, และ collection `admins/{UID}`
4. **ก่อน push:** รัน `git status` และตรวจว่าไม่มีไฟล์ลับ

## Firebase Web API Keys

ค่า `VITE_FIREBASE_*` จะอยู่ใน browser bundle ซึ่งเป็นรูปแบบมาตรฐานของ Firebase client SDK — การป้องกันจริงอยู่ที่ Security Rules และ Admin Auth ไม่ใช่การซ่อน API key

## Admin Session

- Session เจ้าหน้าที่หมดอายุ **6 ชั่วโมง** หลัง login แล้ว logout อัตโนมัติ
- สร้าง admin ได้เฉพาะผู้ที่มี document ใน Firestore `admins/{Firebase UID}` และ `active: true`

## รายงานความเสี่ยง (Report a vulnerability)

หากพบช่องโหว่ด้านความปลอดภัย:

1. **อย่า** เปิด public issue ที่มีรายละเอียด exploit
2. แจ้งผู้ดูแลโปรเจกต์ / หน่วยงาน อบจ.เชียงราย โดยตรง
3. รอการยืนยันก่อนเผยแพร่รายละเอียด

## Checklist ก่อน merge / deploy

- [ ] ไม่มี `.env*` หรือ service account ใน diff
- [ ] CI ผ่าน (build + secret scan)
- [ ] Firestore/Storage rules deploy แล้วบน Firebase production
- [ ] Authorized domains ใน Firebase Auth ครบ (localhost + Vercel domain)
