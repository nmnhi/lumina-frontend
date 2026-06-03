import { useSocket } from "@/hooks/useSocket";
import { mockFriends } from "@/mock";

export default function ActiveConnections() {
  const { onlineUsers } = useSocket();

  return (
    <div className="glass-mac rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-200">Active Connections</h3>
        <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300">
          View All
        </a>
      </div>
      <div className="space-y-4">
        {mockFriends.map((friend) => {
          const isOnline = onlineUsers.includes(friend.id) || true;
          return (
            <div key={friend.id} className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={friend.avatarUrl}
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
        })}
      </div>
    </div>
  );
}