import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { authApi } from "../api/services";

const STORAGE_KEY = "mes.currentUser";
const AuthContext = createContext(null);

const restoreUser = () => {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreUser);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    const nextUser = response?.user;
    if (!nextUser) {
      throw new Error("로그인 사용자 정보가 없습니다.");
    }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth는 AuthProvider 안에서 사용해야 합니다.");
  }
  return value;
};
