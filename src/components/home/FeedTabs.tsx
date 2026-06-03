import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TABS = ["For You", "Following"] as const;

interface FeedTabsProps {
  value: (typeof TABS)[number];
  onChange: (v: (typeof TABS)[number]) => void;
}

export default function FeedTabs({ value, onChange }: FeedTabsProps) {
  return (
    <div className="glass-mac rounded-2xl p-1">
      <Tabs
        value={value}
        onValueChange={(v) => onChange(v as (typeof TABS)[number])}
        className="w-full"
      >
        <TabsList
          variant="line"
          className={cn(
            "w-full bg-transparent h-auto p-0 gap-1"
          )}
        >
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="flex-1 h-9 rounded-xl text-xs font-bold text-zinc-500 data-active:bg-white/10 data-active:text-zinc-200 hover:text-zinc-300"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
