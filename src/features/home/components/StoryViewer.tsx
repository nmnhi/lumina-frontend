import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import type { Story } from "@/types";

const STORY_DURATION_MS = 5_000; // 5 seconds per story
const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i;
const isVideoUrl = (url: string) => VIDEO_EXT.test(url);

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
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

export default function StoryViewer({
  stories,
  initialIndex,
  isOpen,
  onClose,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const progressRef = useRef(0);

  // Sync initialIndex when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      progressRef.current = 0;
      setPaused(false);
      pausedRef.current = false;
    }
  }, [isOpen, initialIndex]);

  const currentStory = stories[currentIndex];
  const isLastStory = currentIndex === stories.length - 1;
  const isFirstStory = currentIndex === 0;

  const goNext = useCallback(() => {
    if (isLastStory) {
      onClose();
    } else {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
      progressRef.current = 0;
    }
  }, [isLastStory, onClose]);

  const goPrev = useCallback(() => {
    if (!isFirstStory) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
      progressRef.current = 0;
    }
  }, [isFirstStory]);

  // Auto-progress timer
  useEffect(() => {
    if (!isOpen || paused) return;

    const step = 50; // update every 50ms
    timerRef.current = setInterval(() => {
      progressRef.current += (step / STORY_DURATION_MS) * 100;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        clearInterval(timerRef.current!);
        // Auto-advance after short delay to show full progress
        setTimeout(() => goNext(), 80);
      }
      setProgress(progressRef.current);
    }, step);

    return () => {
      clearInterval(timerRef.current!);
    };
  }, [isOpen, currentIndex, paused, goNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, goNext, goPrev, onClose]);

  // Touch / swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
    pausedRef.current = true;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setPaused(false);
    pausedRef.current = false;
  };

  // Click left/right halves to navigate
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const half = rect.width / 2;
    if (x < half) goPrev();
    else goNext();
  };

  const handleMouseDown = () => {
    setPaused(true);
    pausedRef.current = true;
  };
  const handleMouseUp = () => {
    setPaused(false);
    pausedRef.current = false;
  };

  if (!isOpen || !currentStory) return null;

  const initials = getInitials(currentStory.author.displayName);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-none w-screen h-screen max-h-screen sm:max-w-none sm:max-h-screen",
          "p-0 bg-black/90 backdrop-blur-md border-0 ring-0",
          "left-0 top-0 translate-x-0 translate-y-0 rounded-none"
        )}
      >
        <DialogTitle className="sr-only">Story viewer</DialogTitle>
        <div
          className="relative w-full h-full flex items-center justify-center select-none"
          onClick={handleBackdropClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-5 right-5 z-30 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
        aria-label="Đóng"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Prev arrow */}
      {!isFirstStory && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
          aria-label="Trước"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {/* Next arrow */}
      {!isLastStory && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
          aria-label="Sau"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      {/* Story card */}
      <div
        className="relative w-full max-w-[420px] h-[90vh] max-h-[780px] rounded-2xl overflow-hidden bg-black select-none"
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-3">
          {stories.map((s, i) => (
            <div
              key={s.id}
              className="flex-1 h-[3px] rounded-full bg-white/20 overflow-hidden"
            >
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    i < currentIndex
                      ? "100%"
                      : i === currentIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Author info */}
        <div className="absolute top-6 left-0 right-0 z-20 flex items-center gap-3 px-4">
          <Avatar size="sm" className="ring-2 ring-white/40 shrink-0">
            <AvatarImage
              src={currentStory.author.avatarUrl}
              alt={currentStory.author.displayName}
            />
            <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold text-white truncate">
              {currentStory.author.displayName}
            </span>
            <span className="text-xs text-white/50 shrink-0">
              {timeAgo(currentStory.createdAt)}
            </span>
          </div>
        </div>

        {/* Story media (image or video) */}
        {isVideoUrl(currentStory.mediaUrl) ? (
          <video
            key={currentStory.id}
            src={currentStory.mediaUrl}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onError={(e) => {
              console.error("[StoryViewer] Failed to load video:", currentStory.mediaUrl);
              (e.target as HTMLVideoElement).style.display = "none";
            }}
          />
        ) : (
          <img
            key={currentStory.id}
            src={currentStory.mediaUrl}
            alt={`Story by ${currentStory.author.displayName}`}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
            onError={(e) => {
              console.error("[StoryViewer] Failed to load image:", currentStory.mediaUrl);
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
      </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
