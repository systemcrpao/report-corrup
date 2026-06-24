/**
 * @param {import('firebase/firestore').Timestamp | null | undefined} timestamp
 * @returns {Date | null}
 */
export function toDate(timestamp) {
  if (!timestamp?.toDate) return null;
  return timestamp.toDate();
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function formatThaiDateTime(date) {
  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * @param {number} year
 * @param {number} month 1-12
 */
export function getMonthKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/**
 * @param {Date} date
 */
export function getQuarterKey(date) {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${quarter}`;
}

/**
 * @param {Date} date
 */
export function getYearKey(date) {
  return String(date.getFullYear() + 543);
}

/**
 * @param {Array<{ createdAt?: import('firebase/firestore').Timestamp | null, status?: string, category?: string, location?: { district?: string } }>} complaints
 */
export function buildComplaintStats(complaints) {
  const monthly = {};
  const quarterly = {};
  const yearly = {};
  const byStatus = {};
  const byCategory = {};
  const byDistrict = {};

  for (const item of complaints) {
    const date = toDate(item.createdAt);
    if (!date) continue;

    const monthKey = getMonthKey(date.getFullYear(), date.getMonth() + 1);
    const quarterKey = getQuarterKey(date);
    const yearKey = getYearKey(date);

    monthly[monthKey] = (monthly[monthKey] ?? 0) + 1;
    quarterly[quarterKey] = (quarterly[quarterKey] ?? 0) + 1;
    yearly[yearKey] = (yearly[yearKey] ?? 0) + 1;

    const status = item.status ?? "ไม่ระบุ";
    byStatus[status] = (byStatus[status] ?? 0) + 1;

    const category = item.category ?? "ไม่ระบุ";
    byCategory[category] = (byCategory[category] ?? 0) + 1;

    const district = item.location?.district ?? "ไม่ระบุ";
    byDistrict[district] = (byDistrict[district] ?? 0) + 1;
  }

  const sortDesc = (entries) =>
    entries.sort((a, b) => b[0].localeCompare(a[0], undefined, { numeric: true }));

  return {
    total: complaints.length,
    monthly: sortDesc(Object.entries(monthly)),
    quarterly: sortDesc(Object.entries(quarterly)),
    yearly: sortDesc(Object.entries(yearly)),
    byStatus: sortDesc(Object.entries(byStatus)),
    byCategory: sortDesc(Object.entries(byCategory)),
    byDistrict: sortDesc(Object.entries(byDistrict)),
  };
}

/**
 * @param {string} monthKey e.g. 2026-03
 */
export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("th-TH", { year: "numeric", month: "long" });
}

/**
 * @param {string} quarterKey e.g. 2026-Q1
 */
export function formatQuarterLabel(quarterKey) {
  const [year, quarter] = quarterKey.split("-Q");
  return `ไตรมาสที่ ${quarter} ปี ${Number(year) + 543}`;
}
