import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase.js";
import {
  clearAdminSession,
  extendAdminSession,
  hasAdminSession,
  isAdminSessionExpired,
} from "../utils/sessionManager.js";

/**
 * @typedef {'NOT_ADMIN' | 'PERMISSION_DENIED' | 'AUTH_INVALID' | 'AUTH_DISABLED' | 'AUTH_TOO_MANY' | 'UNKNOWN'} AuthErrorCode
 */

/**
 * @param {AuthErrorCode} code
 * @param {string} [detail]
 */
export function createAuthError(code, detail) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  return error;
}

/**
 * @param {import('firebase/auth').User} user
 */
export async function verifyAdminUser(user) {
  if (!user?.uid) {
    return { ok: false, reason: "NOT_ADMIN" };
  }

  try {
    const uidDoc = await getDoc(doc(db, "admins", user.uid));
    if (uidDoc.exists() && uidDoc.data()?.active !== false) {
      return { ok: true, source: "uid" };
    }

    if (user.email) {
      const emailQuery = query(
        collection(db, "admins"),
        where("email", "==", user.email),
        limit(1)
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty && emailSnapshot.docs[0].data()?.active !== false) {
        return { ok: true, source: "email", docId: emailSnapshot.docs[0].id };
      }
    }

    return { ok: false, reason: "NOT_ADMIN" };
  } catch (err) {
    console.error("verifyAdminUser failed:", err);
    return {
      ok: false,
      reason: err?.code === "permission-denied" ? "PERMISSION_DENIED" : "UNKNOWN",
      detail: err?.message,
    };
  }
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function loginAdmin(email, password) {
  let credential;

  try {
    credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  } catch (err) {
    throw mapFirebaseAuthError(err);
  }

  const result = await verifyAdminUser(credential.user);

  if (!result.ok) {
    await signOut(auth);
    clearAdminSession();
    throw createAuthError(result.reason, result.detail);
  }

  extendAdminSession();

  if (result.source === "email" && result.docId !== credential.user.uid) {
    console.warn(
      `[admin setup] พบเอกสาร admins/${result.docId} แต่ควรใช้ admins/${credential.user.uid} เป็น Document ID`
    );
  }

  return credential.user;
}

/**
 * @param {unknown} error
 */
function mapFirebaseAuthError(error) {
  const code = error?.code ?? "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return createAuthError("AUTH_INVALID");
    case "auth/user-disabled":
      return createAuthError("AUTH_DISABLED");
    case "auth/too-many-requests":
      return createAuthError("AUTH_TOO_MANY");
    default:
      return createAuthError("UNKNOWN", error?.message);
  }
}

export async function logoutAdmin() {
  clearAdminSession();
  await signOut(auth);
}

/**
 * @param {(user: import('firebase/auth').User | null, isAdmin: boolean) => void} callback
 */
export function subscribeToAdminAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      clearAdminSession();
      callback(null, false);
      return;
    }

    if (isAdminSessionExpired()) {
      await signOut(auth);
      clearAdminSession();
      callback(null, false);
      return;
    }

    const result = await verifyAdminUser(user);
    if (!result.ok) {
      callback(null, false);
      return;
    }

    if (!hasAdminSession()) {
      extendAdminSession();
    }

    callback(user, true);
  });
}

/**
 * @param {AuthErrorCode} code
 */
export function getAuthErrorMessage(code) {
  switch (code) {
    case "NOT_ADMIN":
      return {
        title: "บัญชีนี้ยังไม่ได้รับสิทธิ์เจ้าหน้าที่",
        detail:
          "ตรวจสอบว่าใน Firestore มี collection `admins` และ Document ID ต้องเป็น User UID จาก Firebase Authentication (ไม่ใช่อีเมล)",
      };
    case "PERMISSION_DENIED":
      return {
        title: "ไม่สามารถตรวจสอบสิทธิ์ได้",
        detail: "กรุณา deploy Firestore Rules ล่าสุดด้วยคำสั่ง firebase deploy --only firestore:rules",
      };
    case "AUTH_INVALID":
      return {
        title: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        detail: "ตรวจสอบอีเมล/รหัสผ่าน และยืนยันว่าเปิด Email/Password ใน Firebase Authentication แล้ว",
      };
    case "AUTH_DISABLED":
      return {
        title: "บัญชีนี้ถูกปิดใช้งาน",
        detail: "ติดต่อผู้ดูแลระบบเพื่อเปิดใช้งานบัญชี",
      };
    case "AUTH_TOO_MANY":
      return {
        title: "ลองเข้าสู่ระบบบ่อยเกินไป",
        detail: "กรุณารอสักครู่แล้วลองใหม่อีกครั้ง",
      };
    default:
      return {
        title: "เข้าสู่ระบบไม่สำเร็จ",
        detail: "กรุณาลองใหม่อีกครั้ง หรือตรวจสอบการตั้งค่า Firebase",
      };
  }
}
