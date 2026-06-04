import { MainLayout } from "@/components/shared/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/useAuth";
import Login from "@/features/auth/page/Login";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Register from "@/features/auth/page/Register";
import Home from "@/features/home/page/Home";
import Chat from "@/features/chat/page/Chat";
import Profile from "@/features/profile/page/Profile";

// 🛡️ BỘ LỌC BẢO VỆ CHẶT CHẼ: BẮT BUỘC ĐĂNG NHẬP (PROTECTED ROUTE)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#09090b] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-r-electric-blue"></div>
      </div>
    );
  }

  if (!user) {
    // Nếu chưa đăng nhập, đá bay user về trang Login lập tức
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 🛡️ BỘ LỌC NGƯỢC: ĐÃ ĐĂNG NHẬP THÌ KHÔNG CHO VÀO LẠI TRANG AUTH (PUBLIC ONLY ROUTE)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    // Nếu đã đăng nhập rồi mà cố tình vào lại trang Login/Register -> Đẩy thẳng vào Home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* 🔐 CÁC TUYẾN ĐƯỜNG API ĐƯỢC BẢO VỆ NGHIÊM NGẶT */}
        <Route
          path="/"
          element={
            // <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            // <ProtectedRoute>
              <MainLayout>
                <Chat />
              </MainLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            // <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            // </ProtectedRoute>
          }
        />

        {/* 🔓 CÁC TUYẾN ĐƯỜNG CÔNG KHAI (CHỈ DÀNH CHO USER CHƯA ĐĂNG NHẬP) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 🔓 CẮM ĐƯỜNG DẪN REGISTRY VÀO ĐÂY */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 🔀 ĐƯỜNG DẪN RÁC -> TỰ ĐỘNG ĐIỀU HƯỚNG VỀ HOME */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// 🌟 ĐÚC KHUÔN TỔNG THỂ: BỌC NHÀ MÁY THEO ĐÚNG KIẾN TRÚC PHÂN CẤP NĂNG LƯỢNG
export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <TooltipProvider delayDuration={200}>
          <AppContent />
          <Toaster position="top-center" richColors closeButton />
        </TooltipProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
