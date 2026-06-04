import { Heart, MessageSquare, Share2, MoreHorizontal, Play, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, timeAgo } from "@/lib/utils";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onMediaClick: (index: number) => void;
}

// 🎬 Nhận diện video qua phần mở rộng URL
const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i;
const isVideoUrl = (url: string) => VIDEO_EXT.test(url);

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function normalizeMedia(raw: Post["media"]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

export default function PostCard({ post, onMediaClick }: PostCardProps) {
  const media = useMemo(() => normalizeMedia(post.media), [post.media]);
  const initials = getInitials(post.author.displayName);

  return (
    <article className="glass-mac rounded-2xl overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.displayName} />
            <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-200 truncate">
                {post.author.displayName}
              </span>
              <span className="text-xs text-zinc-600 shrink-0">
                @{post.author.username}
              </span>
            </div>
            <span className="text-xs text-zinc-600">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              aria-label="Thêm"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Thêm</TooltipContent>
        </Tooltip>
      </header>

      {/* BODY */}
      {post.bodyText && (
        <div className="px-5 pb-3">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {post.bodyText}
          </p>
        </div>
      )}

      {/* MEDIA GRID */}
      {media.length > 0 && <MediaGrid urls={media} onMediaClick={onMediaClick} />}

      <Separator className="bg-white/5" />

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

      <Separator className="bg-white/5" />

      {/* ACTIONS */}
      <div className="flex items-center">
        <ActionButton
          label="Like"
          icon={<Heart className="h-4 w-4" />}
          hoverColor="hover:text-neon-pink"
        />
        <ActionButton
          label="Comment"
          icon={<MessageSquare className="h-4 w-4" />}
          hoverColor="hover:text-electric-blue"
          bordered
        />
        <ActionButton
          label="Share"
          icon={<Share2 className="h-4 w-4" />}
          hoverColor="hover:text-cyber-purple"
        />
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* ACTION BUTTON — shadcn Button (ghost) cho 3 nút               */
/* ──────────────────────────────────────────────────────────── */

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
  bordered?: boolean;
}

function ActionButton({ label, icon, hoverColor, bordered }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex-1 h-11 rounded-none gap-2 text-xs font-medium text-zinc-500 hover:bg-white/5",
        hoverColor,
        bordered && "border-x border-white/5"
      )}
    >
      {icon}
      {label}
    </Button>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* MEDIA GRID — 1 / 2 / 1+2 / 2x2                                */
/* ──────────────────────────────────────────────────────────── */

interface MediaGridProps {
  urls: string[];
  onMediaClick: (index: number) => void;
}

function MediaGrid({ urls, onMediaClick }: MediaGridProps) {
  if (urls.length === 0) return null;

  if (urls.length === 1) {
    return (
      <MediaItem
        url={urls[0]}
        onClick={() => onMediaClick(0)}
        className="w-full max-h-[520px] aspect-4/3 object-cover cursor-pointer"
      />
    );
  }

  if (urls.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 bg-black/40">
        {urls.map((u, i) => (
          <MediaItem
            key={u + i}
            url={u}
            onClick={() => onMediaClick(i)}
            className="w-full aspect-square object-cover cursor-pointer"
          />
        ))}
      </div>
    );
  }

  if (urls.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 bg-black/40 aspect-4/3">
        <MediaItem
          url={urls[0]}
          onClick={() => onMediaClick(0)}
          className="w-full h-full object-cover row-span-2 cursor-pointer"
        />
        <MediaItem
          url={urls[1]}
          onClick={() => onMediaClick(1)}
          className="w-full h-full object-cover cursor-pointer"
        />
        <MediaItem
          url={urls[2]}
          onClick={() => onMediaClick(2)}
          className="w-full h-full object-cover cursor-pointer"
        />
      </div>
    );
  }

  const visible = urls.slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-0.5 bg-black/40 aspect-square">
      {visible.map((u, i) => (
        <MediaItem
          key={u + i}
          url={u}
          onClick={() => onMediaClick(i)}
          className="w-full h-full object-cover cursor-pointer"
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* MEDIA ITEM — <img> hoặc <video autoPlay muted loop>           */
/* • IntersectionObserver: pause khi ra khỏi viewport             */
/* ──────────────────────────────────────────────────────────── */

interface MediaItemProps {
  url: string;
  className?: string;
  onClick: () => void;
}

function MediaItem({ url, className = "", onClick }: MediaItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVideoUrl(url)) return;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay có thể bị chặn — bỏ qua */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [url]);

  if (isVideoUrl(url)) {
    return (
      <div ref={containerRef} className="relative bg-black" onClick={onClick}>
        <video
          ref={videoRef}
          src={url}
          muted
          loop
          playsInline
          preload="metadata"
          className={className}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
          </div>
        </div>
        <div className="pointer-events-none absolute top-2 left-2 h-6 w-6 rounded-md bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <VolumeX className="h-3 w-3 text-white" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="post media"
      className={className}
      loading="lazy"
      onClick={onClick}
    />
  );
}
