import { toDate } from "./statsUtils.js";

/**
 * @param {Array<{ createdAt?: import('firebase/firestore').Timestamp | null }>} complaints
 */
export function getAvailableYears(complaints) {
  const years = new Set();

  for (const item of complaints) {
    const date = toDate(item.createdAt);
    if (!date) continue;
    years.add(date.getFullYear() + 543);
  }

  const currentBeYear = new Date().getFullYear() + 543;
  years.add(currentBeYear);

  return Array.from(years).sort((a, b) => b - a);
}

/**
 * @param {Array<{ createdAt?: import('firebase/firestore').Timestamp | null }>} complaints
 * @param {number | "all"} beYear
 */
export function filterComplaintsByYear(complaints, beYear) {
  if (beYear === "all") return complaints;

  const gregorianYear = beYear - 543;

  return complaints.filter((item) => {
    const date = toDate(item.createdAt);
    if (!date) return false;
    return date.getFullYear() === gregorianYear;
  });
}
