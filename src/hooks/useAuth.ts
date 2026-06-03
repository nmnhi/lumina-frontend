import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  // 🛡️ BẢO VỆ AN TOÀN HẠ TẦNG: Ngăn chặn việc gọi Hook sai vùng chỉ định
  if (context === undefined) {
    throw new Error(
      "useAuth bắt buộc phải được đặt bên trong một AuthProvider!"
    );
  }

  return context;
};
