import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/useAuth";
import { getActiveStoriesApi } from "@/features/home/api/stories";
import type { Story } from "@/types";
import CreateStoryDialog from "./CreateStoryDialog";
import StoryViewer from "./StoryViewer";
import { Skeleton } from "@/components/ui/skeleton";

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i;
const isVideoUrl = (url: string) => VIDEO_EXT.test(url);

function StoryMedia({ url, alt }: { url: string; alt: string }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isVideoUrl(url) || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = 0;
    video.play().catch(() => {});
    return () => {
      video.pause();
    };
  }, [url]);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900">
        <div className="text-zinc-600 text-xs">Media unavailable</div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-0">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
      )}
      {isVideoUrl(url) ? (
        <video
          ref={videoRef}
          src={url}
          muted
          loop
          playsInline
          onError={() => {
            console.error("[StoriesBar] Failed to load video:", url);
            setFailed(true);
            setLoading(false);
          }}
          onLoadedData={() => {
            console.log("[StoriesBar] Video loaded:", url);
            setLoading(false);
          }}
          className={`absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-all duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        />
      ) : (
        <img
          src={url}
          alt={alt}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={() => {
            console.error("[StoriesBar] Failed to load image:", url);
            setFailed(true);
            setLoading(false);
          }}
          onLoad={() => {
            console.log("[StoriesBar] Image loaded:", url);
            setLoading(false);
          }}
          className={`absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-all duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        />
      )}
    </>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Skeleton placeholder cho 1 StoryCard */
function StoryCardSkeleton() {
  return (
    <div className="story-card shrink-0 relative w-[118px] h-[190px] rounded-2xl overflow-hidden bg-zinc-900/50 animate-pulse">
      <Skeleton className="h-10 w-10 rounded-full absolute bottom-3 left-3" />
      <Skeleton className="h-3 w-20 absolute bottom-3 right-3" />
    </div>
  );
}

export default function StoriesBar() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStories = useCallback(async () => {
    try {
      const res = await getActiveStoriesApi();
      setStories(res.data);
    } catch {
      // silently fail — stories are non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh stories on mount
  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Called when a new story is successfully created
  const handleStoryCreated = useCallback(() => {
    fetchStories();
  }, [fetchStories]);

  // Use authenticated user's id to determine which story is "yours"
  const currentUserId = user?.id ?? "";

  // Find current user's latest story for inline display
  const myStories = stories.filter((s) => s.authorId === currentUserId);
  const myLatestStory = myStories.length > 0
    ? myStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  /** Show the current user's latest story first, then all other stories */
  const viewableStories = myLatestStory
    ? [myLatestStory, ...stories.filter((s) => s.authorId !== currentUserId)]
    : stories.filter((s) => s.authorId !== currentUserId);

  const openStory = (storyId: string) => {
    const idx = viewableStories.findIndex((s) => s.id === storyId);
    if (idx === -1) return;
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 260;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative group/stories">
      {canScrollLeft && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="absolute -left-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-[#09090b] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 opacity-0 group-hover/stories:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Trước</TooltipContent>
        </Tooltip>
      )}
      {canScrollRight && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="absolute -right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-[#09090b] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 opacity-0 group-hover/stories:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sau</TooltipContent>
        </Tooltip>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing touch-pan-x"
      >
        {/* Always show "Your Story" button first — with stunning animations */}
        <Button
          variant="ghost"
          className="story-card shrink-0 group relative w-[118px] snap-start outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 rounded-2xl bg-transparent hover:bg-transparent border-0 cursor-pointer overflow-visible"
          onClick={() => setCreateStoryOpen(true)}
        >
          <div className="story-gradient-border relative h-[190px] w-full rounded-2xl overflow-hidden">
            <div className="h-full w-full rounded-2xl overflow-hidden relative bg-zinc-900">
              {/* Lớp nền mờ — gradient neon phát sáng từ dưới */}
              <div className="absolute inset-0 bg-linear-to-br from-electric-blue/5 via-neon-pink/5 to-cyber-purple/5" />
              <div className="absolute inset-0 story-overlay-gradient" />

              {/* Shimmer ánh sáng chạy ngang */}
              <div className="story-shimmer absolute inset-0" />

              {/* Nội dung trung tâm */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                <div className="story-icon-ring story-icon-bounce h-12 w-12 rounded-full bg-zinc-800/80 border-2 border-electric-blue/40 flex items-center justify-center backdrop-blur-sm">
                  <Plus className="h-6 w-6 text-electric-blue drop-shadow-[0_0_8px_rgba(0,210,255,0.7)]" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs font-bold text-white drop-shadow-lg tracking-wide">
                    Your Story
                  </span>
                  <span className="text-[9px] text-zinc-400/70 font-medium">
                    Tap to create
                  </span>
                </div>
              </div>

              {/* Dots trang trí dưới cùng */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                <span className="h-1 w-1 rounded-full bg-electric-blue/60 animate-pulse" style={{ animationDelay: "0s" }} />
                <span className="h-1 w-1 rounded-full bg-neon-pink/60 animate-pulse" style={{ animationDelay: "0.3s" }} />
                <span className="h-1 w-1 rounded-full bg-cyber-purple/60 animate-pulse" style={{ animationDelay: "0.6s" }} />
              </div>
            </div>
          </div>
        </Button>

        {loading ? (
          <>
            <StoryCardSkeleton />
            <StoryCardSkeleton />
            <StoryCardSkeleton />
            <StoryCardSkeleton />
          </>
        ) : (
          viewableStories.map((story) => {
            const initials = getInitials(story.author.displayName);
            return (
              <Button
                key={story.id}
                variant="ghost"
                className="shrink-0 group relative w-[118px] snap-start outline-none focus:outline-none h-auto p-0 rounded-2xl bg-transparent hover:bg-transparent cursor-pointer"
                onClick={() => openStory(story.id)}
              >
                <div className="relative h-[190px] w-full rounded-2xl overflow-hidden p-[2px] bg-linear-to-br from-electric-blue via-neon-pink to-cyber-purple">
                  <div className="h-full w-full rounded-2xl overflow-hidden relative bg-[#09090b]">
                    <StoryMedia url={story.mediaUrl} alt={story.author.displayName} />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute z-10 bottom-3 left-3 flex items-center gap-2">
                      <Avatar size="sm" className="ring-2 ring-white/30 shrink-0">
                        <AvatarImage src={story.author.avatarUrl} alt={story.author.displayName} />
                        <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-[10px] font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold text-white drop-shadow-lg truncate max-w-[70px]">
                        {story.author.displayName}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <div className="h-2 w-2 rounded-full bg-neon-pink shadow-[0_0_6px_rgba(255,0,127,0.8)]" />
                    </div>
                  </div>
                </div>
              </Button>
            );
          })
        )}
      </div>

      <StoryViewer
        stories={viewableStories}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />

      <CreateStoryDialog
        open={createStoryOpen}
        onOpenChange={setCreateStoryOpen}
        onSuccess={handleStoryCreated}
      />
    </div>
  );
}
