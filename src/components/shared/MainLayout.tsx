import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/useAuth";
import { PostRefreshProvider } from "@/features/home/context/PostRefreshContext";
import { navItems, type NavItem } from "@/mock";
import { Bell, LogOut, Search, Menu, X } from "lucide-react";
import { useUnread } from "@/context/UnreadContext";
import { useSocket } from "@/hooks/useSocket";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getConversationsApi } from "@/features/chat/api/chat";
import ActiveConnections from "./ActiveConnections";
import TrendingNow from "./TrendingNow";
import WhoToFollow from "@/features/follow/components/WhoToFollow";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { unreadTotal, setUnreadTotal } = useUnread();

  const isActive = (path: string) => location.pathname === path;

  // Hàm helper: gọi API conversations và tính lại tổng unread
  const refreshUnread = () => {
    getConversationsApi()
      .then((res) => {
        const total = res.data.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0);
        setUnreadTotal(total);
      })
      .catch(() => {});
  };

  // Fetch unread count on mount (so badge shows before user visits /chat)
  useEffect(() => {
    refreshUnread();
  }, []);

  // Refetch unread count khi nhận realtime new_message
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = () => {
      refreshUnread();
    };
    socket.on("new_message", handleNewMessage);
    return () => { socket.off("new_message", handleNewMessage); };
  }, [socket]);

  // Refetch khi người nhận đọc tin nhắn (cập nhật trạng thái tổng unread)
  useEffect(() => {
    if (!socket) return;
    const handleSeen = () => {
      refreshUnread();
    };
    socket.on("message_seen", handleSeen);
    return () => { socket.off("message_seen", handleSeen); };
  }, [socket]);

  const navContent = (
    <nav className="space-y-1">
      {navItems.map((item: NavItem) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Button
            key={item.path}
            variant="ghost"
            onClick={() => {
              navigate(item.path);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 h-auto ${
              active
                ? "bg-linear-to-r from-electric-blue/15 via-electric-blue/8 to-transparent text-white shadow-[inset_0_0_20px_rgba(59,130,246,0.06)]"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-electric-blue/20 text-electric-blue shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                    : "text-zinc-500"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={active ? "font-semibold" : ""}>
                {item.label}
              </span>
            </div>
            {(item.badge || (item.label === "Messages" && unreadTotal > 0)) && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  active
                    ? "bg-neon-pink text-white shadow-[0_0_8px_rgba(255,0,127,0.4)]"
                    : "bg-neon-pink/20 text-neon-pink"
                }`}
              >
                {item.label === "Messages" ? unreadTotal : item.badge}
              </span>
            )}
          </Button>
        );
      })}
    </nav>
  );

  const userCard = (
    <div className="glass-mac flex items-center justify-between rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <img
          src={
            user?.avatarUrl ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
          }
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col min-w-0">
          <span className="truncate text-sm font-bold text-zinc-200">
            {user?.displayName || "Alex Rivers"}
          </span>
          <span className="truncate text-xs text-zinc-500">
            @{user?.username || "arivers"}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        className="rounded-lg text-zinc-500 hover:text-red-400"
        title="Đăng xuất"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex h-dvh w-full flex-col bg-[#09090b] text-[#f4f4f5] overflow-hidden font-sans">
      {/* ─── HEADER TOP BAR ─── */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/5 bg-[#09090b]/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          {/* Hamburger menu — only on <md */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden rounded-lg text-zinc-400 hover:text-zinc-300"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-xl sm:text-2xl font-black tracking-wider text-gradient">
            Lumina
          </span>
        </div>

        {/* SEARCH — hidden on mobile */}
        <div className="relative w-full max-w-96 min-w-0 hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search experiences..."
            className="h-auto rounded-full bg-zinc-900/50 py-2 pl-10 pr-4 text-sm border-white/5 text-zinc-200 placeholder-zinc-500 transition focus:border-zinc-700 focus:bg-zinc-900 dark:bg-zinc-900/50"
          />
        </div>

        {/* NOTIFICATION + AVATAR */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-zinc-400 hover:text-zinc-300"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-neon-pink"></span>
          </Button>
          <img
            src={
              user?.avatarUrl ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
            }
            alt="Me"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-white/20 object-cover"
          />
        </div>
      </header>

      {/* ─── MAIN 3-COLUMN BODY ─── */}
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden px-2 sm:px-3 md:px-4 lg:px-6 py-4 gap-3 md:gap-4 lg:gap-6 justify-center">
        <div className="flex min-w-0 w-full max-w-[1400px] gap-3 md:gap-4 lg:gap-6">
          {/* ─── LEFT SIDEBAR (desktop) ─── */}
          <aside className="hidden md:flex w-64 lg:w-72 xl:w-80 shrink-0 flex-col justify-between">
            <div className="glass-mac rounded-2xl p-3 space-y-6">
              {navContent}
            </div>
            <div className="hidden lg:block">{userCard}</div>
          </aside>

          {/* ─── MOBILE SIDEBAR DRAWER ─── */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Drawer */}
              <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#09090b] border-r border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black tracking-wider text-gradient">
                    Lumina
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-lg text-zinc-400 hover:text-zinc-300"
                    aria-label="Close sidebar"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-none">
                  <div className="glass-mac rounded-2xl p-3 space-y-6">
                    {navContent}
                  </div>
                </div>
                {userCard}
              </aside>
            </div>
          )}

          {/* ─── MAIN CONTENT ─── */}
          <main className="min-w-0 flex-1 max-w-2xl overflow-y-auto overflow-x-hidden scrollbar-none">
            <PostRefreshProvider>{children}</PostRefreshProvider>
          </main>

          {/* ─── RIGHT SIDEBAR ─── */}
          <aside className="hidden lg:block w-80 xl:w-96 shrink-0 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-none">
            <ActiveConnections />
            <TrendingNow />
            <WhoToFollow />
          </aside>
        </div>
      </div>
    </div>
  );
};
