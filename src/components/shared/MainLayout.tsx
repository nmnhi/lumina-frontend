import { useAuth } from "@/features/auth/useAuth";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, Search } from "lucide-react";
import { navItems, type NavItem } from "@/mock";
import ActiveConnections from "./ActiveConnections";
import TrendingNow from "./TrendingNow";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-screen flex-col bg-[#09090b] text-[#f4f4f5] overflow-hidden font-sans">
      {/* ─── HEADER TOP BAR ─── */}
      <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#09090b]/80 px-8 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-wider text-gradient">
            Lumina
          </span>
        </div>

        {/* SEARCH BAR WITH LUCIDE ICON */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search experiences..."
            className="w-full rounded-full bg-zinc-900/50 py-2 pl-10 pr-4 text-sm border border-white/5 text-zinc-200 outline-none transition focus:border-zinc-700 focus:bg-zinc-900"
          />
        </div>

        {/* NOTIFICATION WITH LUCIDE ICON */}
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-zinc-900 transition">
            <Bell className="h-4 w-4 text-zinc-400" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-neon-pink"></span>
          </button>
          <img
            src={
              user?.avatarUrl ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
            }
            alt="Me"
            className="h-8 w-8 rounded-full border border-white/20 object-cover"
          />
        </div>
      </header>

      {/* ─── MAIN 3-COLUMN BODY ─── */}
      <div className="flex flex-1 overflow-hidden px-6 py-4 gap-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="flex w-64 flex-col justify-between">
          <div className="glass-mac rounded-2xl p-3 space-y-6">
            <nav className="space-y-1">
              {navItems.map((item: NavItem) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
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
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          active
                            ? "bg-neon-pink text-white shadow-[0_0_8px_rgba(255,0,127,0.4)]"
                            : "bg-neon-pink/20 text-neon-pink"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <button className="w-full btn-lumina rounded-xl bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple py-3 text-sm font-bold text-white shadow-lg">
              Create Post
            </button>
          </div>

          {/* BOX USER INFO WITH LUCIDE LOGOUT */}
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
            <button
              onClick={logout}
              className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-red-400 transition"
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </aside>

        {/* CỘT GIỮA: SCROLLABLE VIEW — nền trong suốt, chỉ card mới có glass-mac */}
        <main className="flex-1 overflow-auto scrollbar-none">
          {children}
        </main>

        {/* CỘT PHẢI: ACTIVE & TRENDS */}
        <aside className="w-80 space-y-6 overflow-y-auto scrollbar-none">
          <ActiveConnections />
          <TrendingNow />
        </aside>
      </div>
    </div>
  );
};
