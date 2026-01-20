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

const API_BASE_URL = "https://dpi-news.vercel.app/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = useCallback(async ({ email, password }: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/jwt/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Djoser/SimpleJWT commonly accepts "email" OR "username" depending on config
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUser(null);
        setError(data?.detail || data?.message || "Login failed");
        return false;
      }

      // data should contain: { access: "...", refresh: "..." }
      // If you want to store tokens client-side (not ideal), you could store them here.
      // For now we just mark the user as logged in.
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