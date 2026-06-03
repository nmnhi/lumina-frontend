import { Image, Smile, Video } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

export default function CreatePostBox() {
  const { user } = useAuth();

  const avatarUrl = user?.avatarUrl || FALLBACK_AVATAR;
  const firstName = (user?.displayName || "there").split(" ")[0];

  return (
    <div className="glass-mac rounded-2xl p-4 space-y-4">
      {/* Avatar + Pill input */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt="Your avatar"
          className="h-11 w-11 rounded-full object-cover shrink-0 ring-1 ring-white/10"
        />
        <div className="flex-1">
          <input
            type="text"
            placeholder={`What's on your mind, ${firstName}?`}
            className="w-full rounded-full border border-white/10 bg-white/3 px-5 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
          />
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-1">
          <PostAction
            label="Media"
            icon={<Image className="h-3 w-3 text-white" strokeWidth={2.5} />}
            iconClassName="bg-linear-to-br from-cyber-purple to-electric-blue"
          />
          <PostAction
            label="Live"
            icon={<Video className="h-3 w-3 text-white" strokeWidth={2.5} />}
            iconClassName="bg-linear-to-br from-neon-pink to-orange-400"
          />
          <PostAction
            label="Feeling"
            icon={<Smile className="h-3 w-3 text-zinc-900" strokeWidth={2.5} />}
            iconClassName="bg-linear-to-br from-amber-400 to-yellow-500"
          />
        </div>
        <button className="rounded-full bg-gradient-to-r from-cyber-purple to-neon-pink px-6 py-2 text-sm font-bold text-white shadow-lg shadow-cyber-purple/30 hover:brightness-110 hover:shadow-cyber-purple/50 transition">
          Post
        </button>
      </div>
    </div>
  );
}

interface PostActionProps {
  label: string;
  icon: React.ReactNode;
  iconClassName: string;
}

function PostAction({ label, icon, iconClassName }: PostActionProps) {
  return (
    <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 transition">
      <span className={`flex h-5 w-5 items-center justify-center rounded-md ${iconClassName}`}>
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
