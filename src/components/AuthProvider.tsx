"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import { getCurrentUser, login as authLogin, register as authRegister, logout as authLogout } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (loginId: string, password: string) => Promise<User>;
  register: (loginId: string, password: string, fullName: string, email?: string, phone?: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Load current user from session
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const publicPages = ["/login"];
    const isPublicPage = publicPages.includes(pathname);

    if (!user && !isPublicPage) {
      router.push("/login");
    } else if (user && isPublicPage) {
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  const login = async (loginId: string, password: string) => {
    setLoading(true);
    try {
      const u = await authLogin(loginId, password);
      setUser(u);
      router.push("/dashboard");
      return u;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const register = async (
    loginId: string,
    password: string,
    fullName: string,
    email?: string,
    phone?: string
  ) => {
    setLoading(true);
    try {
      const u = await authRegister(loginId, password, fullName, email, phone);
      setUser(u);
      router.push("/dashboard");
      return u;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
