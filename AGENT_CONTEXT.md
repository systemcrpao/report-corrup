# AI AGENT DEVELOPMENT CONTEXT

## 1. Project Overview

**Project Name:** Whistleblower & Complaint Management System (ระบบร้องเรียนการทุจริต องค์การบริหารส่วนจังหวัดเชียงราย)
**Project Year:** 2026 (พ.ศ. 2569)
**Objective:** A secure, serverless web application for citizens to report corruption, misconduct, or negligence.
**Repository:** Public GitHub (collaborators) — see `SECURITY.md` for secret handling.

## 2. Technology Stack

- **Frontend:** React.js (Functional Components, Hooks), Vite
- **Fonts:** Kanit (UI), Sarabun (print reports only)
- **Deployment:** Vercel
- **Backend & Database:** Firebase Cloud Firestore (NoSQL)
- **File Storage:** Firebase Storage
- **Auth:** Firebase Auth (admin) + Firestore `admins/{UID}` whitelist
- **Admin session:** 6-hour localStorage expiry, auto logout (`sessionManager.js`)
- **Firebase SDK:** Modular SDK v9+ only

---

## 3. Database Schema (Firestore)

**Collection:** `complaints`

```typescript
interface Complaint {
  trackingId: string; // 'CR-' + timestamp
  category: string;
  details: string;
  evidenceUrls: string[]; // Storage paths (not public URLs) — resolved by admin via evidenceService
  informantName: string;
  informantContact: string;
  location: {
    address: string;
    district: string; // อำเภอ
    subdistrict: string; // ตำบล
  };
  status: "รอดำเนินการ" | "กำลังตรวจสอบ" | "ยุติเรื่อง";
  adminNotes: string;
  statusHistory: Array<{ status: string; detail: string; updatedAt: Timestamp }>;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}
```

**Collection:** `admins/{firebaseUid}`

```typescript
interface Admin {
  email: string;
  name?: string;
  active: boolean;
}
```

---

## 4. File Storage (Firebase Storage)

- **Path:** `complaints/{trackingId}-{original_filename}`
- Store **storage path** in `evidenceUrls`; admin reads via signed/getDownloadURL in `evidenceService.js`

---

## 5. Core Workflows

### 5.1 Public submission
Anti-spam (5 per 3h via localStorage) → upload files → create Firestore doc → show trackingId.

### 5.2 Public tracking
Query by `trackingId`; return `trackingId`, `status`, `updatedAt`, `adminNotes`, `statusHistory`.

### 5.3 Admin dashboard
- Year filter (พ.ศ.) via `yearFilter.js` — cards/stats/recent table filter by selected year
- Summary cards: `SummaryCards.jsx`
- Print report: `complaintReport.js` + hidden iframe (`printDocument.js`) — Sarabun font
- Delete complaint: `deleteComplaint()` — removes Firestore doc + Storage evidence (admin only)
- Status change: require `adminNotes` → append to `statusHistory` (shown on track page as staff opinion)

### 5.4 Admin auth & session
- Login via Firebase Auth; verify `admins/{uid}` or email fallback
- Session expires 6 hours after login; checked every minute
- Keys: `adminSessionExpiry` in localStorage

---

## 6. AI Agent Coding Guidelines

1. **Firebase v9+ modular syntax only**
2. **Functional components + hooks**
3. **Thai UI text**, English code identifiers
4. **Never commit** `.env.local`, service accounts, or PII
5. **Security:** Rules enforce access; never expose admin fields on public pages
6. **Print reports:** Use `printComplaintReport()` (async, iframe) — not `window.open` for primary flow

---

## 7. Location Data

Chiang Rai districts/tambons: `src/data/chiangrai-locations.json` (18 districts, 124 tambons)
