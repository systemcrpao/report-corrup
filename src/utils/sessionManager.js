const SESSION_EXPIRY_KEY = "adminSessionExpiry";
export const ADMIN_SESSION_MS = 6 * 60 * 60 * 1000;

export function extendAdminSession() {
  localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + ADMIN_SESSION_MS));
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}

export function hasAdminSession() {
  return Boolean(localStorage.getItem(SESSION_EXPIRY_KEY));
}

export function isAdminSessionExpired() {
  const raw = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!raw) return false;
  return Date.now() >= Number(raw);
}

/**
 * @returns {number | null}
 */
export function getSessionRemainingMs() {
  const expiry = Number(localStorage.getItem(SESSION_EXPIRY_KEY));
  if (!expiry) return null;
  return Math.max(0, expiry - Date.now());
}
