import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import { Socket, io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ĐẦU RA CỦA SOCKET CONTEXT
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[]; // Mảng chứa ID của các user đang online thực tế phát ra từ BE
}

// KHỞI TẠO KHUÔN ĐÚC CONTEXT
export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

// 2. NHÀ MÁY QUẢN LÝ ĐƯỜNG TRUYỀN WEBSOCKET (PROVIDER COMPONENT)
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Triệu hồi thông tin AuthContext để biết khi nào có User đăng nhập
  const auth = useContext(AuthContext);

  // 🌟 LẮNG NGHE BIẾN ĐỘNG TRẠNG THÁI ĐĂNG NHẬP ĐỂ BẬT/TẮT SÓNG REAL-TIME
  useEffect(() => {
    // ĐIỀU KIỆN 1: Nếu User đã đăng nhập thành công và có Token hợp lệ
    if (auth?.user && auth.token) {
      // 🚀 KÍCH NỔ KẾT NỐI WEBSOCKET LÊN DOCKER BACKEND
      const newSocket = io("http://localhost:5001", {
        auth: { token: auth.token }, // Bắn kèm token lên phục vụ dòng socket.handshake.auth?.token ở Backend Middleware
        transports: ["websocket"] // Ép buộc dùng thẳng giao thức WebSocket, bỏ qua bước Polling để tối ưu tốc độ
      });

      setSocket(newSocket);

      // 👂 LẮNG NGHE SỰ KIỆN: Danh sách ID của những người dùng đang Online thực tế
      newSocket.on("get_online_users", (users: string[]) => {
        setOnlineUsers(users);
      });

      // 🧹 CLEANUP FUNCTION: Ngắt kết nối khi Component bị hủy hoặc User đăng xuất
      return () => {
        newSocket.close();
      };
    } else {
      // ĐIỀU KIỆN 2: Nếu không có User (hoặc User vừa bấm Logout)
      if (socket) {
        socket.close(); // Đóng ống dẫn lập tức để giải phóng tài nguyên RAM hệ thống
        setSocket(null);
        setOnlineUsers([]); // Dọn sạch danh sách online khi ngắt kết nối an toàn
      }
    }
  }, [auth?.user, auth?.token]); // Bổ sung auth.token vào mảng phụ thuộc để đảm bảo tính nhất quán dữ liệu

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
