# 🛠 SKILL & TECHNOLOGY STACK
**Project:** ระบบร้องเรียนการประพฤติมิชอบ / การละเว้นการปฏิบัติหน้าที่ / การกระทำทุจริต 
**Year:** 2026 (พ.ศ. 2569)

This document outlines the core technologies, frameworks, and technical skills utilized to build and deploy the Whistleblower & Complaint Management System.

## 1. Frontend Development (User Interface)
* **React.js:** Core library for building a dynamic and interactive user interface.
* **State Management:** Utilizing React Hooks (`useState`, `useEffect`) for managing form data, loading states, and file handling.
* **Browser Storage:** Implementing `LocalStorage` for client-side rate limiting (Spam prevention).

## 2. Backend as a Service (Firebase)
* **Cloud Firestore (NoSQL):** * Designing document-based database schemas.
    * Implementing server-side timestamps to prevent data tampering.
* **Firebase Storage:** * Handling multipart file uploads (images/evidence).
    * Generating secure, downloadable URLs for frontend integration.
* **Firebase Security Rules:** * Implementing Role-Based Access Control (RBAC).
    * Restricting `read`/`write` access to ensure public users can only submit data, while only authorized admins can review complaints and view evidence.

## 3. Hosting, Deployment & CI/CD
* **Vercel:** Cloud platform for static site hosting and Serverless Functions.
* **GitHub / Git:** Source code version control and seamless integration with Vercel for continuous deployment (CI/CD pipelines).

## 4. Architecture & Technical Concepts
* **Serverless Architecture:** Completely abstracting backend server management by leveraging Firebase and Vercel.
* **Data Security & Privacy:** Adhering to strict data protection standards suitable for government whistleblower systems (anonymous submissions, secure evidence storage).
* **Anti-Spam Implementations:** Client-side rate limiting (Max 5 submissions per 3 hours) and preparation for reCAPTCHA/App Check integration to prevent bot abuse.