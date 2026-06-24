# แนวทางร่วมพัฒนา (Contributing)

## เริ่มต้น

```powershell
git clone https://github.com/YOUR_ORG/report-corrup.git
cd report-corrup
npm ci
copy .env.example .env.local
# แก้ไข .env.local ใส่ค่า Firebase จากผู้ดูแลโปรเจกต์
npm run dev
```

## กฎสำคัญ

1. **ห้าม commit** `.env.local`, service account, หรือข้อมูลส่วนบุคคล
2. UI เป็นภาษาไทย — ตัวแปร/ฟังก์ชันในโค้ดเป็นภาษาอังกฤษ
3. ใช้ Firebase Modular SDK v9+ เท่านั้น
4. รัน `npm run build` ก่อนเปิด PR

## ฟอนต์

| บริบท | ฟอนต์ |
|-------|-------|
| UI ทั้งระบบ | Kanit |
| เอกสารรายงาน (พิมพ์/PDF) | Sarabun |

## Branch & PR

1. สร้าง branch จาก `main`
2. commit ข้อความสั้น ชัดเจน (ภาษาไทยหรืออังกฤษได้)
3. เปิด Pull Request — รอ review จาก maintainer

## Deploy rules

หลังแก้ `firestore.rules` หรือ `storage.rules`:

```powershell
firebase deploy --only firestore:rules,storage:rules
```

อ่านเพิ่มเติม: [SECURITY.md](./SECURITY.md), [README.md](./README.md)
