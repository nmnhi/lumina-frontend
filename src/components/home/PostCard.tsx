import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="glass-mac rounded-2xl overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-200">
                {post.author.displayName}
              </span>
              <span className="text-xs text-zinc-600">@{post.author.username}</span>
            </div>
            <span className="text-xs text-zinc-600">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <button className="p-1 text-zinc-500 hover:text-zinc-300 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* BODY */}
      <div className="px-5 pb-3">
        <p className="text-sm text-zinc-300 leading-relaxed">{post.bodyText}</p>
      </div>

      {/* MEDIA */}
      {post.media && (
        <div className="px-0">
          <img src={post.media} alt="Post content" className="w-full h-64 object-cover" />
        </div>
      )}

      {/* STATS */}
      <div className="flex items-center justify-between px-5 py-3 text-xs text-zinc-600">
        <span className="flex items-center gap-1">
          <span className="flex -space-x-1">
            <span className="h-4 w-4 rounded-full bg-neon-pink flex items-center justify-center">
              <Heart className="h-2 w-2 text-white fill-white" />
            </span>
          </span>
          {post._count.likes} likes
        </span>
        <span>{post._count.comments} comments</span>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center border-t border-white/5">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium text-zinc-500 hover:text-neon-pink transition">
          <Heart className="h-4 w-4" />
          Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium text-zinc-500 hover:text-electric-blue transition border-x border-white/5">
          <MessageSquare className="h-4 w-4" />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium text-zinc-500 hover:text-cyber-purple transition">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  );
}
