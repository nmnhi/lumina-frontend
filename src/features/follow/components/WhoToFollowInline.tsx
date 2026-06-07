import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, UserCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MiniSpinner from "@/components/shared/MiniSpinner";
import {
  getSuggestedUsersApi,
  toggleFollowApi,
  type SuggestedUser,
} from "@/features/follow/api/follow";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

/**
 * Compact horizontal "Suggested for you" card to embed between posts
 * in the feed (Twitter-style). Shows up to 3 users with follow buttons.
 */
export default function WhoToFollowInline() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuggestedUsersApi(3)
      .then((res) => setUsers(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleFollow = async (user: SuggestedUser) => {
    if (pendingId) return;
    setPendingId(user.id);
    try {
      const res = await toggleFollowApi(user.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isFollowing: res.data.isFollowing } : u
        )
      );
    } catch {
      // ignore
    } finally {
      setPendingId(null);
    }
  };

  if (loading || users.length === 0) return null;

  return (
    <div className="glass-mac rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-electric-blue" />
        <h3 className="text-sm font-bold text-zinc-200">Gợi ý cho bạn</h3>
      </div>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Link to={`/profile/${user.username}`} className="shrink-0">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.avatarUrl || undefined}
                  alt={user.displayName}
                />
                <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-[10px] font-bold">
                  {user.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link
              to={`/profile/${user.username}`}
              className="min-w-0 flex-1 truncate"
            >
              <p className="truncate text-sm font-bold text-zinc-200 hover:text-electric-blue transition">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-zinc-500">@{user.username}</p>
            </Link>
            <Button
              variant={user.isFollowing ? "outline" : "default"}
              size="sm"
              onClick={() => handleToggleFollow(user)}
              disabled={pendingId === user.id}
              className={`shrink-0 h-auto px-3 py-1.5 text-xs font-medium rounded-lg ${
                user.isFollowing
                  ? "border-white/10 text-zinc-300 hover:bg-white/5"
                  : "bg-electric-blue text-white hover:bg-electric-blue/90"
              }`}
            >
              {pendingId === user.id ? (
                <MiniSpinner size={12} />
              ) : user.isFollowing ? (
                <UserCheck className="h-3 w-3" />
              ) : (
                <UserPlus className="h-3 w-3" />
              )}
              <span className="ml-1.5">
                {user.isFollowing ? "Đang follow" : "Follow"}
              </span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
