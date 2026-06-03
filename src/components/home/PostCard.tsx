import { Heart, MessageSquare, Share2, MoreHorizontal, Play } from "lucide-react";
import { useMemo } from "react";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

// 🎬 Nhận diện video qua phần mở rộng URL
const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i;
const isVideoUrl = (url: string) => VIDEO_EXT.test(url);

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/**
 * 🧩 Đảm bảo media luôn là string[] (tương thích cả khi backend trả string đơn hoặc JSON)
 */
function normalizeMedia(raw: Post["media"]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

export default function PostCard({ post }: PostCardProps) {
  const media = useMemo(() => normalizeMedia(post.media), [post.media]);

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
      {post.bodyText && (
        <div className="px-5 pb-3">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {post.bodyText}
          </p>
        </div>
      )}

      {/* MEDIA GRID */}
      {media.length > 0 && <MediaGrid urls={media} />}

      {/* STATS */}
      {post._count && (
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
      )}

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

/* ──────────────────────────────────────────────────────────── */
/* MEDIA GRID — Facebook / Instagram style: 1 / 2 / 1+2 / 2x2   */
/* ──────────────────────────────────────────────────────────── */

interface MediaGridProps {
  urls: string[];
}

function MediaGrid({ urls }: MediaGridProps) {
  if (urls.length === 0) return null;

  // 1 ảnh: full-width
  if (urls.length === 1) {
    return (
      <MediaItem
        url={urls[0]}
        className="w-full max-h-[520px] aspect-[4/3] object-cover"
      />
    );
  }

  // 2 ảnh: 2 cột
  if (urls.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 bg-black/40">
        {urls.map((u, i) => (
          <MediaItem
            key={u + i}
            url={u}
            className="w-full aspect-square object-cover"
          />
        ))}
      </div>
    );
  }

  // 3 ảnh: 1 lớn trái + 2 xếp dọc phải
  if (urls.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 bg-black/40 aspect-[4/3]">
        <MediaItem
          url={urls[0]}
          className="w-full h-full object-cover row-span-2"
        />
        <MediaItem url={urls[1]} className="w-full h-full object-cover" />
        <MediaItem url={urls[2]} className="w-full h-full object-cover" />
      </div>
    );
  }

  // 4 ảnh (hoặc nhiều hơn — cắt về 4): grid 2x2
  const visible = urls.slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-0.5 bg-black/40 aspect-square">
      {visible.map((u, i) => (
        <MediaItem
          key={u + i}
          url={u}
          className="w-full h-full object-cover"
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* MEDIA ITEM — render <img> hoặc <video> dựa trên đuôi file     */
/* ──────────────────────────────────────────────────────────── */

interface MediaItemProps {
  url: string;
  className?: string;
}

function MediaItem({ url, className = "" }: MediaItemProps) {
  if (isVideoUrl(url)) {
    return (
      <div className="relative bg-black">
        <video
          src={url}
          className={className}
          controls
          playsInline
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Play className="h-5 w-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  return <img src={url} alt="post media" className={className} loading="lazy" />;
}
