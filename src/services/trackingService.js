import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { COMPLAINT_STATUS, INITIAL_STATUS_DETAIL } from "../types/complaint.js";

/**
 * @param {unknown} value
 * @returns {import('../types/complaint.js').StatusHistoryEntry[]}
 */
function normalizeStatusHistory(value, currentStatus, updatedAt) {
  if (!Array.isArray(value) || value.length === 0) {
    return [
      {
        status: currentStatus ?? COMPLAINT_STATUS.PENDING,
        detail: INITIAL_STATUS_DETAIL,
        updatedAt: updatedAt ?? null,
      },
    ];
  }

  return value.map((entry) => ({
    status: entry.status,
    detail: entry.detail ?? "",
    updatedAt: entry.updatedAt ?? null,
  }));
}

/**
 * @param {string} trackingIdInput
 * @returns {Promise<import('../types/complaint.js').PublicTrackingResult | null>}
 */
export async function trackComplaint(trackingIdInput) {
  const trackingId = trackingIdInput.trim().toUpperCase();

  const q = query(
    collection(db, "complaints"),
    where("trackingId", "==", trackingId),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();

  return {
    trackingId: data.trackingId,
    status: data.status,
    updatedAt: data.updatedAt ?? null,
    statusHistory: normalizeStatusHistory(data.statusHistory, data.status, data.updatedAt),
  };
}
