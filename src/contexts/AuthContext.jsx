import { createContext, useContext, useEffect, useState } from "react";
import {
  loginAdmin as loginAdminRequest,
  logoutAdmin as logoutAdminRequest,
  subscribeToAdminAuth,
} from "../services/authService.js";
import {
  extendAdminSession,
  clearAdminSession,
  isAdminSessionExpired,
} from "../utils/sessionManager.js";

const AuthContext = createContext(null);
const SESSION_CHECK_MS = 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function logout() {
    await logoutAdminRequest();
    clearAdminSession();
    setUser(null);
    setIsAdmin(false);
  }

  async function enforceSessionExpiry() {
    if (isAdminSessionExpired()) {
      await logout();
    }
  }

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth(async (nextUser, admin) => {
      if (nextUser && admin && isAdminSessionExpired()) {
        await logout();
        setIsLoading(false);
        return;
      }

      setUser(nextUser);
      setIsAdmin(admin);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAdmin) return undefined;

    const timer = setInterval(() => {
      enforceSessionExpiry();
    }, SESSION_CHECK_MS);

    return () => clearInterval(timer);
  }, [isAdmin]);

  async function login(email, password) {
    const authUser = await loginAdminRequest(email, password);
    extendAdminSession();
    setUser(authUser);
    setIsAdmin(true);
    return authUser;
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
