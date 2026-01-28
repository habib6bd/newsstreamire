"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";

export type User = {
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginUser: (payload: LoginPayload) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = useCallback(async ({ email, password }: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ IMPORTANT: call your Next.js proxy (no CORS)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUser(null);
        setError(data?.detail || data?.message || "Login failed");
        return false;
      }

      // ✅ Option 3: store tokens (simple way)
      if (data?.access) localStorage.setItem("access", data.access);
      if (data?.refresh) localStorage.setItem("refresh", data.refresh);

      // mark logged in
      setUser({ email });
      return true;
    } catch {
      setUser(null);
      setError("Network error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // ✅ clear tokens on logout
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, loginUser, logout }),
    [user, loading, error, loginUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
