import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i;
const isVideoUrl = (url: string) => VIDEO_EXT.test(url);

interface MediaLightboxProps {
  urls: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 🌌 Lightbox xem ảnh / video full màn hình với overlay blur
 * - ESC để đóng
 * - ← / → để chuyển media
 * - Click backdrop để đóng
 * - Video trong lightbox autoplay với âm thanh, có controls
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

  // Reset index khi mở lại với post khác
  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
      setPaused(false);
    }
  }, [isOpen, initialIndex]);

  // Khóa scroll body khi mở
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + urls.length) % urls.length);
    setPaused(false);
  }, [urls.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % urls.length);
    setPaused(false);
  }, [urls.length]);

  // Phím tắt
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen || urls.length === 0) return null;

  const currentUrl = urls[index];
  const currentIsVideo = isVideoUrl(currentUrl);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition z-10"
        aria-label="Đóng"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      {urls.length > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-medium z-10">
          {index + 1} / {urls.length}
        </div>
      )}

      {/* Prev */}
      {urls.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition z-10"
          aria-label="Trước"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next */}
      {urls.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition z-10"
          aria-label="Sau"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Media container */}
      <div
        className="relative max-w-[92vw] max-h-[88vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {currentIsVideo ? (
          <div className="relative">
            <video
              key={currentUrl /* force re-mount khi đổi media */}
              src={currentUrl}
              autoPlay
              muted={muted}
              controls
              playsInline
              className="max-w-[92vw] max-h-[88vh] rounded-lg shadow-2xl"
            />

            {/* Custom overlay controls (nhỏ, không che controls gốc) */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              <button
                onClick={() => setPaused((p) => !p)}
                className="h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center transition"
                aria-label={paused ? "Phát" : "Tạm dừng"}
              >
                {paused ? <Play className="h-4 w-4 ml-0.5" /> : <Pause className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setMuted((m) => !m)}
                className="h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center transition"
                aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ) : (
          <img
            key={currentUrl}
            src={currentUrl}
            alt=""
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
          />
        )}
      </div>

      {/* Thumbnail strip (nếu nhiều media) */}
      {urls.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-[92vw] overflow-x-auto px-2 py-1 z-10">
          {urls.map((u, i) => (
            <button
              key={u + i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
                setPaused(false);
              }}
              className={`shrink-0 h-12 w-12 rounded-md overflow-hidden border-2 transition ${
                i === index
                  ? "border-white scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
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
    </div>
  );
}
