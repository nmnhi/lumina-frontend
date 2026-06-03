import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export const useSocket = () => {
  const context = useContext(SocketContext);

  // 🛡️ BẢO VỆ AN TOÀN HẠ TẦNG: Chủ động báo lỗi nếu quên bọc Provider ở ngoài App
  if (context === undefined) {
    throw new Error(
      "useSocket bắt buộc phải được đặt bên trong một SocketProvider!"
    );
  }

  return context;
};
