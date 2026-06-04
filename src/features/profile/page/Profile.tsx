import { useState, useRef, useEffect } from "react";
import { Settings, Calendar, MapPin, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { mockTabs, tabContents } from "@/features/profile/mock/profile";

export default function Profile() {
  const { user } = useAuth();
  const currentUser = user;
  const [activeTab, setActiveTab] = useState<string>("Posts");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(null);

  // Smoothly move the sliding indicator to the active tab
  useEffect(() => {
    const btn = tabsRef.current?.get(activeTab);
    if (btn) {
      setIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [activeTab]);

  return (
    <div className="space-y-4">
      {/* COVER & AVATAR */}
      <div className="glass-mac rounded-2xl overflow-hidden">
        {/* COVER */}
        <div className="h-40 bg-linear-to-r from-electric-blue/20 via-neon-pink/20 to-cyber-purple/20 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        </div>

        {/* PROFILE INFO */}
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <img
                src={
                  currentUser?.avatarUrl ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
                }
                alt={currentUser?.displayName || "User"}
                className="h-24 w-24 rounded-2xl border-4 border-[#09090b] object-cover shadow-xl"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-[#09090b]"></span>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5 transition">
              <Settings className="h-3.5 w-3.5" />
              Edit Profile
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-bold text-white">
                {currentUser?.displayName || "Alex Rivers"}
              </h1>
              <span className="text-sm text-zinc-500">
                @{currentUser?.username || "arivers"}
              </span>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
              Digital architect & minimalist. Building the future of social
              interactions at Lumina. Currently exploring Web3 design patterns
              and immersive UI experiences.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> San Francisco, CA
              </span>
              <span className="flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5" /> lumina.social
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Joined January 2026
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-200 font-bold">1,247</span>
              <span className="text-zinc-500 text-xs">Following</span>
              <span className="text-zinc-200 font-bold">8,432</span>
              <span className="text-zinc-500 text-xs">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS with sliding indicator */}
      <div className="glass-mac rounded-2xl p-1 relative">
        {/* Sliding background indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-xl bg-linear-to-r from-electric-blue/20 via-electric-blue/10 to-transparent shadow-[inset_0_0_16px_rgba(59,130,246,0.1)] transition-all duration-300 ease-in-out"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />

        <div className="relative flex gap-1">
          {mockTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                ref={(el) => {
                  if (!tabsRef.current) tabsRef.current = new Map();
                  if (el) tabsRef.current.set(tab, el);
                }}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold relative z-10 transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT with fade animation */}
      <div
        key={activeTab}
        className="glass-mac rounded-2xl p-10 text-center animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <div className="max-w-xs mx-auto space-y-3">
          <h3 className="text-sm font-bold text-zinc-400">
            {tabContents[activeTab]?.title}
          </h3>
          <p className="text-xs text-zinc-600">
            {tabContents[activeTab]?.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
