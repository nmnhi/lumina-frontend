import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, timeAgo } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import { toggleLikeApi } from "@/features/interactions/api/interactions";
import type { Post } from "@/types";
import EditPostDialog from "./EditPostDialog";
import DeletePostConfirmDialog from "./DeletePostConfirmDialog";
import CommentDialog from "@/features/interactions/components/CommentDialog";
import SharePostDialog from "@/features/interactions/components/SharePostDialog";

interface PostCardProps {
  post: Post;
  onMediaClick: (index: number) => void;
  onPostUpdated?: (updated: Post) => void;
  onPostDeleted?: (deletedId: string) => void;
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
  if (Array.isArray(raw))
    return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

export default function PostCard({
  post,
  onMediaClick,
  onPostUpdated,
  onPostDeleted,
}: PostCardProps) {
  const { user } = useAuth();
  const media = useMemo(() => normalizeMedia(post.media), [post.media]);
  const origMedia = useMemo(
    () => (post.originalPost ? normalizeMedia(post.originalPost.media) : []),
    [post.originalPost]
  );
  const initials = useMemo(() => getInitials(post.author.displayName), [post.author.displayName]);
  const isOwner = user?.id === post.authorId;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post._count?.likes ?? 0);
  const [liking, setLiking] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post._count?.comments ?? 0);
  const [shareCount, setShareCount] = useState(post._count?.sharedPosts ?? 0);
  const [shared, setShared] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleLike = async () => {
    // Prevent liking own post
    if (isOwner) {
      toast.info("You can't like your own post");
      return;
    }
    if (liking) return;
    try {
      setLiking(true);
      const res = await toggleLikeApi(post.id);
      if (res.data.liked) {
        setLiked(true);
        setLikeCount((c) => c + 1);
      } else {
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      }
    } catch (error: any) {
      // Only show error for unexpected failures, not for business logic errors
      if (error?.response?.status !== 400) {
        toast.error("Failed to like post.");
      }
    } finally {
      setLiking(false);
    }
  };

  const handleShare = () => {
    if (isOwner) {
      toast.info("You can't share your own post");
      return;
    }
    setShareDialogOpen(true);
  };

  return (
    <>
      <article className="glass-mac rounded-2xl overflow-hidden">
        {/* HEADER */}
        <header className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={`/profile/${post.author.username}`}
              aria-label={`Open ${post.author.displayName}'s profile`}
              className="shrink-0 rounded-full transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f10]"
            >
              <Avatar>
                <AvatarImage
                  src={post.author.avatarUrl}
                  alt={post.author.displayName}
                />
                <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="min-w-0">
              <Link
                to={`/profile/${post.author.username}`}
                aria-label={`Open ${post.author.displayName}'s profile`}
                className="text-sm font-bold text-zinc-200 truncate hover:text-electric-blue transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f10] rounded block"
              >
                {post.author.displayName}
              </Link>
              <span className="text-xs text-zinc-600 block mt-0.5">
                {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>

          {/* More actions dropdown (owner only) */}
          {isOwner && (
            <div className="relative" ref={dropdownRef}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    aria-label="More"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More</TooltipContent>
              </Tooltip>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-white/10 bg-[#121214] p-1.5 shadow-xl backdrop-blur-xl">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setEditOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Post
                  </button>
                  <Separator className="my-1 bg-white/5" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setDeleteOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* BODY */}
        {post.bodyText && (
          <div className="px-5 pb-3">
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {post.bodyText}
            </p>
          </div>
        )}

        {/* SHARED POST EMBED (giống Facebook) */}
        {post.originalPost && (
          <div className="mx-5 mb-3 rounded-xl border border-white/10 bg-white/2 overflow-hidden">
            <Link
              to={`/profile/${post.originalPost.author.username}`}
              className="flex items-center gap-2 px-4 pt-3 pb-1 hover:opacity-80 transition"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.originalPost.author.avatarUrl} alt={post.originalPost.author.displayName} />
                <AvatarFallback className="text-[8px] bg-linear-to-br from-cyber-purple to-electric-blue text-white font-bold">
                  {getInitials(post.originalPost.author.displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold text-zinc-300 truncate">
                {post.originalPost.author.displayName}
              </span>
            </Link>
            {post.originalPost.bodyText && (
              <div className="px-4 pb-2">
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 whitespace-pre-line">
                  {post.originalPost.bodyText}
                </p>
              </div>
            )}
            {origMedia.length > 0 && (
              <div className="max-h-48 overflow-hidden border-t border-white/5">
                {origMedia.length === 1 || isVideoUrl(origMedia[0]) ? (
                  <img src={origMedia[0]} alt="" className="w-full h-48 object-cover" />
                ) : (
                  <div className="grid grid-cols-2 gap-px h-48">
                    {origMedia.slice(0, 2).map((url, i) => (
                      <img key={i} src={url} alt="" className="w-full h-full object-cover" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MEDIA GRID */}
        {media.length > 0 && (
          <MediaGrid urls={media} onMediaClick={onMediaClick} />
        )}

        <Separator className="bg-white/5" />

        {/* ACTIONS */}
        <div className="flex items-center justify-start gap-4 px-5 py-2">
          <ActionButton
            label={likeCount.toString()}
            icon={<Heart className={`h-5 w-5 ${liked ? "fill-neon-pink text-neon-pink" : ""}`} />}
            selected={liked}
            hoverColor="hover:text-neon-pink"
            onClick={handleLike}
            disabled={liking}
          />
          <ActionButton
            label={commentCount.toString()}
            icon={<MessageSquare className="h-5 w-5" />}
            hoverColor="hover:text-electric-blue"
            onClick={() => setCommentOpen(true)}
          />
          <ActionButton
            label={shareCount.toString()}
            icon={<Share2 className={`h-5 w-5 ${shared ? "fill-cyber-purple text-cyber-purple" : ""}`} />}
            selected={shared}
            hoverColor="hover:text-cyber-purple"
            onClick={handleShare}
            disabled={false}
          />
        </div>
      </article>

      {/* Edit Post Dialog */}
      <EditPostDialog
        post={post}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onPostUpdated}
      />

      {/* Delete Post Confirm Dialog */}
      <DeletePostConfirmDialog
        postId={post.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={onPostDeleted}
      />

      {/* Comment Dialog */}
      <CommentDialog
        postId={post.id}
        open={commentOpen}
        onOpenChange={setCommentOpen}
        onCommentCountChange={(delta) =>
          setCommentCount((c) => c + delta)
        }
      />

      {/* Share Post Dialog (Facebook style) */}
      <SharePostDialog
        postId={post.id}
        originalPost={post.originalPost ?? post}
        open={shareDialogOpen}
        onOpenChange={(open) => {
          setShareDialogOpen(open);
        }}
        onShareSuccess={() => {
          setShared(true);
          setShareCount((c) => c + 1);
        }}
        onShareUpdated={() => {
          // Caption updated, no count change needed
        }}
        onShareDeleted={() => {
          setShared(false);
          setShareCount((c) => Math.max(0, c - 1));
        }}
      />
    </>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* ACTION BUTTON                                                 */
/* ──────────────────────────────────────────────────────────── */

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

function ActionButton({ label, icon, hoverColor, selected, onClick, disabled }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-10 px-2 gap-1 text-xs font-medium transition-colors rounded-lg",
        selected
          ? "text-neon-pink"
          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5",
        hoverColor
      )}
    >
      {icon}
      {label}
    </Button>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* MEDIA GRID                                                    */
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
/* MEDIA ITEM                                                     */
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
