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
 * @param {string | undefined} currentStatus
 * @param {import('firebase/firestore').Timestamp | null | undefined} updatedAt
 * @param {string | undefined} adminNotes
 * @returns {import('../types/complaint.js').StatusHistoryEntry[]}
 */
function normalizeStatusHistory(value, currentStatus, updatedAt, adminNotes) {
  /** @type {import('../types/complaint.js').StatusHistoryEntry[]} */
  let history;

  if (!Array.isArray(value) || value.length === 0) {
    history = [
      {
        status: currentStatus ?? COMPLAINT_STATUS.PENDING,
        detail: INITIAL_STATUS_DETAIL,
        updatedAt: updatedAt ?? null,
      },
    ];
  } else {
    history = value.map((entry) => ({
      status: entry.status,
      detail: entry.detail ?? "",
      updatedAt: entry.updatedAt ?? null,
    }));
  }

  const trimmedNotes = adminNotes?.trim() ?? "";
  if (!trimmedNotes) return history;

  const last = history[history.length - 1];
  const alreadyLatest =
    last?.status === currentStatus && last?.detail === trimmedNotes;

  if (!alreadyLatest) {
    history = [
      ...history,
      {
        status: currentStatus ?? COMPLAINT_STATUS.PENDING,
        detail: trimmedNotes,
        updatedAt: updatedAt ?? null,
      },
    ];
  }

  return history;
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
  const adminNotes = data.adminNotes?.trim() ?? "";

  return {
    trackingId: data.trackingId,
    status: data.status,
    updatedAt: data.updatedAt ?? null,
    adminNotes,
    statusHistory: normalizeStatusHistory(
      data.statusHistory,
      data.status,
      data.updatedAt,
      adminNotes
    ),
  };
}
