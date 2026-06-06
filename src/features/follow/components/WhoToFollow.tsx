import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, UserPlus, UserCheck } from "lucide-react";
import {
  getSuggestedUsersApi,
  toggleFollowApi,
  type SuggestedUser
} from "@/features/follow/api/follow";
import { UserRowSkeleton } from "@/components/shared/PostCardSkeleton";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

export default function WhoToFollow() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const limit = expanded ? 10 : 5;
      const res = await getSuggestedUsersApi(limit);
      setUsers(res.data);
    } catch {
      console.error("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }, [expanded]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleToggleFollow = async (user: SuggestedUser) => {
    try {
      setPendingId(user.id);
      const res = await toggleFollowApi(user.id);
      // Update local state — either remove from list (if unfollowed) or update flag
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isFollowing: res.data.isFollowing } : u
        )
      );
    } catch {
      console.error("Failed to toggle follow");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="glass-mac rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-200">Who to follow</h3>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={fetchSuggestions}
          disabled={loading}
          className="rounded-lg text-zinc-500 hover:text-zinc-300"
          aria-label="Refresh suggestions"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading && users.length === 0 ? (
          <UserRowSkeleton count={4} />
        ) : users.length === 0 ? (
          <p className="text-xs text-zinc-600 text-center py-4">
            No suggestions right now.
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3"
            >
              {/* Avatar — clickable to profile */}
              <Link
                to={`/profile/${user.username}`}
                className="shrink-0"
                aria-label={`View ${user.displayName}'s profile`}
              >
                <img
                  src={user.avatarUrl || FALLBACK_AVATAR}
                  alt={user.displayName}
                  className="h-10 w-10 rounded-full object-cover transition hover:opacity-80"
                />
              </Link>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/${user.username}`}
                  className="block text-sm font-bold text-zinc-200 truncate hover:text-electric-blue transition"
                >
                  {user.displayName}
                </Link>
                <p className="text-xs text-zinc-500 truncate">
                  @{user.username}
                </p>
                {user.mutualCount > 0 && (
                  <p className="text-[10px] text-electric-blue/80 mt-0.5 truncate">
                    Followed by {user.mutualCount}{" "}
                    {user.mutualCount === 1 ? "person" : "people"} you follow
                  </p>
                )}
              </div>

              {/* Follow / Following button */}
              <Button
                variant={user.isFollowing ? "outline" : "default"}
                size="sm"
                onClick={() => handleToggleFollow(user)}
                disabled={pendingId === user.id}
                className={`shrink-0 h-auto px-3 py-1.5 text-xs font-medium rounded-lg ${
                  user.isFollowing
                    ? "border-white/10 text-zinc-300 hover:bg-white/5 hover:border-red-400 hover:text-red-400"
                    : "bg-electric-blue text-white hover:bg-electric-blue/90"
                }`}
              >
                {pendingId === user.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : user.isFollowing ? (
                  <UserCheck className="h-3.5 w-3.5" />
                ) : (
                  <UserPlus className="h-3.5 w-3.5" />
                )}
                <span className="ml-1.5">
                  {user.isFollowing ? "Following" : "Follow"}
                </span>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Show more / less */}
      {!loading && users.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 text-center">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-medium text-electric-blue hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
}
