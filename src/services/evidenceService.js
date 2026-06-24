import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.js";

/**
 * @param {string} value
 */
export function isStoragePath(value) {
  return Boolean(value) && !value.startsWith("http");
}

/**
 * @param {string} pathOrUrl
 * @returns {Promise<string>}
 */
export async function resolveEvidenceUrl(pathOrUrl) {
  if (!pathOrUrl) {
    throw new Error("Missing evidence path");
  }

  if (!isStoragePath(pathOrUrl)) {
    return pathOrUrl;
  }

  return getDownloadURL(ref(storage, pathOrUrl));
}

/**
 * @param {string[]} pathsOrUrls
 * @returns {Promise<string[]>}
 */
export async function resolveEvidenceUrls(pathsOrUrls) {
  return Promise.all(pathsOrUrls.map((item) => resolveEvidenceUrl(item)));
}
