import type { User } from "@/types";
import { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🌟 ĐỒNG BỘ HÓA TRẠNG THÁI NGAY KHI USER VỪA TẢI TRANG (F5)
  useEffect(() => {
    const storedToken = localStorage.getItem("lumina_token");
    const storedUser = localStorage.getItem("lumina_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // Xác nhận đã quét xong ổ cứng, hạ màn hình chờ
  }, []);

  // 🌟 HÀM KÍCH HOẠT ĐĂNG NHẬP THÀNH CÔNG
  const login = (newToken: string, userData: User) => {
    localStorage.setItem("lumina_token", newToken);
    localStorage.setItem("lumina_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // 🌟 HÀM ĐĂNG XUẤT XÓA SẠCH DẤU VẾT
  const logout = () => {
    localStorage.removeItem("lumina_token");
    localStorage.removeItem("lumina_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {/* 🛡️ CHỈ RENDER APP KHI ĐÃ QUÉT XONG LOCALSTORAGE ĐỂ TRÁNH GIẬT GIAO DIỆN */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
