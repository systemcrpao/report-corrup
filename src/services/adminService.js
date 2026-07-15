import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase.js";
import { isStoragePath } from "./evidenceService.js";

/**
 * @typedef {import('../types/complaint.js').Complaint & { id: string, createdAt: import('firebase/firestore').Timestamp | null, updatedAt: import('firebase/firestore').Timestamp | null }} AdminComplaint
 */

/**
 * @returns {Promise<AdminComplaint[]>}
 */
export async function fetchAllComplaints() {
  const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/**
 * @param {string} id
 * @param {{ status?: string, adminNotes?: string, statusHistory?: import('../types/complaint.js').StatusHistoryEntry[] }} updates
 */
export async function updateComplaint(id, updates) {
  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, "complaints", id), payload);
}

/**
 * @param {string} id
 * @param {string[]} [evidenceUrls]
 */
export async function deleteComplaint(id, evidenceUrls = []) {
  for (const pathOrUrl of evidenceUrls) {
    if (!isStoragePath(pathOrUrl)) continue;

    try {
      await deleteObject(ref(storage, pathOrUrl));
    } catch (err) {
      console.warn("Failed to delete evidence file:", pathOrUrl, err);
    }
  }

  await deleteDoc(doc(db, "complaints", id));
}
