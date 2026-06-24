const STORAGE_KEY = "complaintLogs";
const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 3 * 60 * 60 * 1000;

/**
 * @returns {{ allowed: boolean, remaining: number, retryAfterMs: number }}
 */
export function checkRateLimit() {
  const now = Date.now();
  const logs = getRecentLogs(now);

  if (logs.length >= MAX_SUBMISSIONS) {
    const oldest = Math.min(...logs);
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: WINDOW_MS - (now - oldest),
    };
  }

  return {
    allowed: true,
    remaining: MAX_SUBMISSIONS - logs.length,
    retryAfterMs: 0,
  };
}

export function recordSubmission() {
  const now = Date.now();
  const logs = getRecentLogs(now);
  logs.push(now);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function getRecentLogs(now) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((ts) => typeof ts === "number" && now - ts < WINDOW_MS);
  } catch {
    return [];
  }
}

/**
 * @param {number} ms
 * @returns {string}
 */
export function formatRetryAfter(ms) {
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} ชั่วโมง ${minutes} นาที`;
  }
  if (hours > 0) {
    return `${hours} ชั่วโมง`;
  }
  return `${minutes} นาที`;
}
