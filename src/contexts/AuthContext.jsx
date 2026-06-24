import { createContext, useContext, useEffect, useState } from "react";
import {
  loginAdmin as loginAdminRequest,
  logoutAdmin as logoutAdminRequest,
  subscribeToAdminAuth,
} from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((nextUser, admin) => {
      setUser(nextUser);
      setIsAdmin(admin);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    const authUser = await loginAdminRequest(email, password);
    setUser(authUser);
    setIsAdmin(true);
    return authUser;
  }

  async function logout() {
    await logoutAdminRequest();
    setUser(null);
    setIsAdmin(false);
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
