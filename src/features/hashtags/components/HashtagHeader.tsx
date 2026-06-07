import { Hash } from "lucide-react";

interface HashtagHeaderProps {
  name: string;
  postCount?: number;
}

export default function HashtagHeader({ name, postCount }: HashtagHeaderProps) {
  return (
    <div className="glass-mac relative overflow-hidden rounded-2xl p-6">
      {/* Decorative gradient blob */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #00d2ff 0%, #ff007f 50%, #9d4edd 100%)",
        }}
      />

      <div className="relative flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-electric-blue via-neon-pink to-cyber-purple shadow-lg shadow-electric-blue/20">
          <Hash className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-black text-white">#{name}</h1>
          {typeof postCount === "number" && (
            <p className="mt-1 text-xs text-zinc-500">
              {postCount.toLocaleString()} {postCount === 1 ? "post" : "posts"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
