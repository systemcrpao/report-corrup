import {
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.js";

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

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    trackingId: data.trackingId,
    status: data.status,
    updatedAt: data.updatedAt ?? null,
  };
}
