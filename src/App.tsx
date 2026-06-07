import { MainLayout } from "@/components/shared/MainLayout";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/AuthContext";
import Login from "@/features/auth/page/Login";
import Register from "@/features/auth/page/Register";
import ForgotPassword from "@/features/auth/page/ForgotPassword";
import ResetPassword from "@/features/auth/page/ResetPassword";
import { useAuth } from "@/features/auth/useAuth";
import Bookmarks from "@/features/bookmarks/page/Bookmarks";
import Chat from "@/features/chat/page/Chat";
import Explore from "@/features/explore/page/Explore";
import HashtagPage from "@/features/hashtags/page/HashtagPage";
import Home from "@/features/home/page/Home";
import Notifications from "@/features/notifications/page/Notifications";
import Profile from "@/features/profile/page/Profile";
import Settings from "@/features/settings/page/Settings";
import PostDetail from "@/features/post/page/PostDetail";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import { UnreadProvider } from "./context/UnreadContext";

// 🛡️ BỘ LỌC BẢO VỆ CHẶT CHẼ: BẮT BUỘC ĐĂNG NHẬP (PROTECTED ROUTE)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay variant="neon-arcs" mode="fullscreen" message="Đang tải..." />;
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
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Chat />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hashtag/:name"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HashtagPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Explore />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Bookmarks />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Notifications />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PostDetail />
              </MainLayout>
            </ProtectedRoute>
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

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
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
        <UnreadProvider>
        <TooltipProvider delayDuration={200}>
          <AppContent />
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
        </UnreadProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
