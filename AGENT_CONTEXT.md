# AI AGENT DEVELOPMENT CONTEXT

## 1. Project Overview

**Project Name:** Whistleblower & Complaint Management System (ระบบร้องเรียนการทุจริต องค์การบริหารส่วนจังหวัดเชียงราย)
**Project Year:** 2026 (พ.ศ. 2569)
**Objective:** A secure, serverless web application for citizens to report corruption, misconduct, or negligence.
**Key Requirements:** High security, data privacy (anonymous option), fast performance, and anti-spam protection.

## 2. Technology Stack

- **Frontend:** React.js (Functional Components, Hooks)
- **Deployment:** Vercel
- **Backend & Database:** Firebase Cloud Firestore (NoSQL)
- **File Storage:** Firebase Storage
- **Firebase SDK Version:** Modular SDK v9+ (e.g., `import { collection, addDoc } from "firebase/firestore"`)

---

## 3. Database Schema (Firestore)

**Collection Name:** `complaints`

Use the following TypeScript interface as the single source of truth for the data structure:

```typescript
interface Complaint {
  trackingId: string; // Primary reference for user (Format: 'CR-' + timestamp)
  category: string; // Dropdown value (e.g., 'ทุจริต', 'ละเว้นการปฏิบัติหน้าที่')
  details: string; // Detailed description of the incident
  evidenceUrls: string[]; // Array of Download URLs from Firebase Storage
  informantName: string; // Can be empty string ('') if anonymous
  informantContact: string; // Email or Phone. Can be empty string ('')
  status: "รอดำเนินการ" | "กำลังตรวจสอบ" | "ยุติเรื่อง"; // Current status
  adminNotes: string; // Internal notes for board members (Hidden from public)
  createdAt: FieldValue; // serverTimestamp() from Firestore
  updatedAt: FieldValue; // serverTimestamp() from Firestore
}
```

---

## 4. File Storage Structure (Firebase Storage)

- **Path Pattern:** `complaints/{trackingId}-{original_filename}`
- **Rule:** Files must be uploaded to Storage _before_ writing to Firestore to ensure we have the `downloadURL` ready for the `evidenceUrls` array.

---

## 5. Core Workflows & Logic

### 5.1 Submission Workflow (Public User)

1. User fills the form and attaches a file (optional).
2. Validate Anti-Spam limits (Client-side rate limiting via LocalStorage).
3. If valid, Generate `trackingId` (e.g., `CR-1718192021`).
4. Upload file(s) to Firebase Storage -> Get `downloadURL`.
5. Create payload matching the `Complaint` interface.
6. Insert document into Firestore `complaints` collection.
7. Return success UI displaying the `trackingId` to the user.

### 5.2 Anti-Spam Logic (Rate Limiting)

- **Rule:** Maximum 5 submissions per 3 hours per user.
- **Implementation:** - Use `localStorage.getItem('complaintLogs')` storing an array of timestamps.
  - Filter timestamps older than 3 hours (3 _ 60 _ 60 \* 1000 ms).
  - Check array length: If `>= 5`, block submission and return error message.
  - If `< 5`, push `Date.now()` and update LocalStorage.

### 5.3 Tracking Workflow (Public User)

1. User inputs `trackingId`.
2. Query Firestore: `collection('complaints')` where `trackingId === input`.
3. Return ONLY `trackingId`, `status`, `updatedAt`.
4. **Strict Constraint:** DO NOT fetch or display `details`, `evidenceUrls`, or `adminNotes` to the public frontend to prevent data leaks.

---

## 6. AI Agent Coding Guidelines

When generating code for this project, the AI Agent MUST follow these rules:

1. **Firebase v9+ Only:** Always use the modular syntax for Firebase (`import { ref, uploadBytes } from 'firebase/storage'`). DO NOT use the compat/namespaced syntax (`firebase.storage()`).
2. **Component Structure:** Use functional components with hooks (`useState`, `useEffect`).
3. **Error Handling:** Wrap all async Firebase operations in `try-catch` blocks and implement loading states (`isLoading`).
4. **Language:** UI text, alerts, and placeholders must be in Thai. Code variables and functions must be in English.
5. **Security First:** Never expose admin-only fields in public components. Assume the frontend is public.
