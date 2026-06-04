import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i;
const isVideoUrl = (url: string) => VIDEO_EXT.test(url);

interface MediaLightboxProps {
  urls: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 🌌 Lightbox xem ảnh / video full màn hình — dùng shadcn Dialog làm nền
 * - ESC để đóng (Radix xử lý tự động)
 * - ← / → để chuyển media
 * - Body scroll lock tự động (Radix)
 */
export default function MediaLightbox({
  urls,
  initialIndex,
  isOpen,
  onClose
}: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
      setPaused(false);
    }
  }, [isOpen, initialIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + urls.length) % urls.length);
    setPaused(false);
  }, [urls.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % urls.length);
    setPaused(false);
  }, [urls.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, goPrev, goNext]);

  const currentUrl = urls[index];
  const currentIsVideo = currentUrl ? isVideoUrl(currentUrl) : false;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-none w-screen h-screen max-h-screen sm:max-w-none sm:max-h-screen",
          "p-0 bg-black/85 backdrop-blur-md border-0 ring-0",
          "left-0 top-0 translate-x-0 translate-y-0 rounded-none"
        )}
      >
        <DialogTitle className="sr-only">Xem media</DialogTitle>

        {/* Close */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-0 z-20"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Đóng (ESC)</TooltipContent>
        </Tooltip>

        {/* Counter */}
        {urls.length > 1 && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-medium z-20">
            {index + 1} / {urls.length}
          </div>
        )}

        {/* Prev */}
        {urls.length > 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={goPrev}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-0 z-20"
                aria-label="Trước"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>← Trước</TooltipContent>
          </Tooltip>
        )}

        {/* Next */}
        {urls.length > 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={goNext}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-0 z-20"
                aria-label="Sau"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sau →</TooltipContent>
          </Tooltip>
        )}

        {/* Media container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {currentIsVideo ? (
            <div className="relative">
              <video
                key={currentUrl}
                src={currentUrl}
                autoPlay
                muted={muted}
                controls
                playsInline
                className="max-w-[92vw] max-h-[88vh] rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setPaused((p) => !p)}
                  className="h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white border-0"
                  aria-label={paused ? "Phát" : "Tạm dừng"}
                >
                  {paused ? (
                    <Play className="h-4 w-4 ml-0.5" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMuted((m) => !m)}
                  className="h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white border-0"
                  aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <img
              key={currentUrl}
              src={currentUrl}
              alt=""
              className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg shadow-2xl"
            />
          )}
        </div>

        {/* Thumbnail strip */}
        {urls.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-[92vw] overflow-x-auto px-2 py-1 z-20">
            {urls.map((u, i) => (
              <button
                key={u + i}
                onClick={() => {
                  setIndex(i);
                  setPaused(false);
                }}
                className={cn(
                  "shrink-0 h-12 w-12 rounded-md overflow-hidden border-2 transition",
                  i === index
                    ? "border-white scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
                aria-label={`Media ${i + 1}`}
              >
                {isVideoUrl(u) ? (
                  <div className="h-full w-full bg-black flex items-center justify-center">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                ) : (
                  <img src={u} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
