import { useState } from "react";

const TABS = ["For You", "Following"] as const;
type Tab = (typeof TABS)[number];

export default function FeedTabs() {
  const [active, setActive] = useState<Tab>("For You");

  return (
    <div className="flex gap-1 glass-mac rounded-2xl p-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
            active === tab
              ? "bg-white/10 text-zinc-200"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
