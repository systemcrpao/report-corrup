/** @typedef {'รอดำเนินการ' | 'กำลังตรวจสอบ' | 'ยุติเรื่อง'} ComplaintStatus */

/**
 * @typedef {Object} ComplaintLocation
 * @property {string} address
 * @property {string} district
 * @property {string} subDistrict
 * @property {string} province
 */

/**
 * @typedef {Object} Complaint
 * @property {string} trackingId
 * @property {string} category
 * @property {string} details
 * @property {ComplaintLocation} location
 * @property {string[]} evidenceUrls
 * @property {string} informantName
 * @property {string} informantContact
 * @property {ComplaintStatus} status
 * @property {string} adminNotes
 * @property {import('firebase/firestore').FieldValue} createdAt
 * @property {import('firebase/firestore').FieldValue} updatedAt
 */

/**
 * @typedef {Object} PublicTrackingResult
 * @property {string} trackingId
 * @property {ComplaintStatus} status
 * @property {import('firebase/firestore').Timestamp | null} updatedAt
 */

export const COMPLAINT_CATEGORIES = [
  "ทุจริต",
  "ละเว้นการปฏิบัติหน้าที่",
  "ประพฤติมิชอบ",
  "อื่นๆ",
];

export const COMPLAINT_STATUS = {
  PENDING: "รอดำเนินการ",
  IN_PROGRESS: "กำลังตรวจสอบ",
  CLOSED: "ยุติเรื่อง",
};

export const COMPLAINT_STATUS_OPTIONS = Object.values(COMPLAINT_STATUS);

export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
