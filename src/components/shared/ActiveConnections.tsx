import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { getFollowingApi, type FollowUser } from "@/features/follow/api/follow";
import { UserRowSkeleton } from "./PostCardSkeleton";

export default function ActiveConnections() {
  const { onlineUsers } = useSocket();
  const [friends, setFriends] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFollowingApi()
      .then((res) => setFriends(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-mac rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-200">Active Connections</h3>
        <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300">
          View All
        </a>
      </div>
      <div className="space-y-4">
        {loading ? (
          <UserRowSkeleton count={3} />
        ) : friends.length === 0 ? (
          <p className="text-xs text-zinc-600">No connections yet.</p>
        ) : (
          friends.map((friend) => {
            const isOnline = onlineUsers.includes(friend.id);
            return (
              <div key={friend.id} className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={friend.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                    alt={friend.displayName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#09090b] animate-pulse"></span>
                  )}
                </div>
                <span className="text-sm font-medium text-zinc-300">
                  {friend.displayName}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}