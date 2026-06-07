import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SlidingTabItem {
  /** Unique key for the tab */
  key: string;
  /** Display label */
  label: string;
  /** Optional badge (e.g., count) to show next to the label */
  badge?: string | number;
}

interface SlidingTabsProps<T extends string> {
  tabs: ReadonlyArray<{ key: T; label: string; badge?: string | number }>;
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

/**
 * Reusable sliding-pill tab toggle (style used in Home FeedTabs and Profile).
 * Pure controlled component — state lives in the parent.
 */
export default function SlidingTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: SlidingTabsProps<T>) {
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Move the sliding indicator to the active tab
  useLayoutEffect(() => {
    let raf2 = 0;
    const measure = () => {
      const container = tabsContainerRef.current;
      const btn = tabsRef.current?.get(activeTab);
      if (!container || !btn) return;
      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    };
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(measure);
    });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", measure);
    };
  }, [activeTab, tabs]);

  return (
    <div
      className={cn(
        "glass-mac relative flex w-full items-center rounded-2xl p-1",
        className
      )}
    >
      <div className="relative flex w-full gap-1" ref={tabsContainerRef}>
        <div
          className="absolute top-0 bottom-0 rounded-xl bg-linear-to-r from-electric-blue/20 via-neon-pink/15 to-cyber-purple/20 transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                if (!tabsRef.current) tabsRef.current = new Map();
                if (el) tabsRef.current.set(tab.key, el);
              }}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-bold relative z-10 transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-zinc-500"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
