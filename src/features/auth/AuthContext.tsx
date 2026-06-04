import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("lumina_token");
    const savedUser = localStorage.getItem("lumina_user");

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        setToken(savedToken);
        setUser(parsed);
      } catch {
        localStorage.removeItem("lumina_token");
        localStorage.removeItem("lumina_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("lumina_token", newToken);
    localStorage.setItem("lumina_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("lumina_token");
    localStorage.removeItem("lumina_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {/* Chỉ render children khi đã xử lý xong localStorage — tránh flash UI */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth bat buoc phai duoc dat ben trong mot AuthProvider!"
    );
  }
  return context;
}
