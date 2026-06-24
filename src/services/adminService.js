import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js";

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
 * @param {{ status?: string, adminNotes?: string }} updates
 */
export async function updateComplaint(id, updates) {
  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, "complaints", id), payload);
}
