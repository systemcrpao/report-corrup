import { ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase.js";
import { generateTrackingId } from "../utils/trackingId.js";
import { CHIANG_RAI_PROVINCE } from "../data/chiangrai-locations.js";
import { COMPLAINT_STATUS, INITIAL_STATUS_DETAIL } from "../types/complaint.js";

/**
 * @param {File} file
 * @param {string} trackingId
 * @returns {Promise<string>}
 */
function resolveContentType(file) {
  if (file.type) return file.type;

  const ext = file.name.split(".").pop()?.toLowerCase();
  const types = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    pdf: "application/pdf",
  };

  return types[ext] ?? "application/octet-stream";
}

async function uploadEvidenceFile(file, trackingId) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `complaints/${trackingId}-${safeName}`);

  await uploadBytes(storageRef, file, {
    contentType: resolveContentType(file),
  });

  return `complaints/${trackingId}-${safeName}`;
}

/**
 * @param {{
 *   category: string,
 *   details: string,
 *   location: { address: string, district: string, subDistrict: string },
 *   informantName: string,
 *   informantContact: string,
 *   isAnonymous: boolean,
 *   files: File[],
 * }} formData
 * @returns {Promise<string>}
 */
export async function submitComplaint(formData) {
  const trackingId = generateTrackingId();
  const evidenceUrls = [];

  for (const file of formData.files) {
    const url = await uploadEvidenceFile(file, trackingId);
    evidenceUrls.push(url);
  }

  /** @type {import('../types/complaint.js').Complaint} */
  const payload = {
    trackingId,
    category: formData.category,
    details: formData.details.trim(),
    location: {
      address: formData.location.address.trim(),
      district: formData.location.district,
      subDistrict: formData.location.subDistrict,
      province: CHIANG_RAI_PROVINCE,
    },
    evidenceUrls,
    informantName: formData.isAnonymous ? "" : formData.informantName.trim(),
    informantContact: formData.isAnonymous ? "" : formData.informantContact.trim(),
    status: COMPLAINT_STATUS.PENDING,
    adminNotes: "",
    statusHistory: [
      {
        status: COMPLAINT_STATUS.PENDING,
        detail: INITIAL_STATUS_DETAIL,
        updatedAt: Timestamp.now(),
      },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await addDoc(collection(db, "complaints"), payload);
  return trackingId;
}
