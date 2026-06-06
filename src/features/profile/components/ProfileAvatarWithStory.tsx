import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, User as UserIcon } from "lucide-react";

import { getActiveStoriesApi } from "@/features/home/api/stories";
import type { Story } from "@/types";
import StoryViewer from "@/features/home/components/StoryViewer";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const STORY_ACTIVE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface ProfileAvatarWithStoryProps {
  userId: string;
  avatarUrl?: string | null;
  displayName: string;
  className?: string;
}

/**
 * Avatar with active-story awareness:
 *  - If the user has a story created within 24h, show an animated gradient ring
 *  - On click, present a chooser dialog: view story or view avatar (full)
 *  - If no active story, simply open the avatar lightbox
 */
export default function ProfileAvatarWithStory({
  userId,
  avatarUrl,
  displayName,
  className
}: ProfileAvatarWithStoryProps) {
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const chooserRef = useRef<HTMLDivElement>(null);

  const fetchMyStories = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getActiveStoriesApi();
      const mine = res.data.filter(
        (s) => s.authorId === userId &&
          Date.now() - new Date(s.createdAt).getTime() < STORY_ACTIVE_WINDOW_MS
      );
      setMyStories(mine);
    } catch {
      // silently fail
    }
  }, [userId]);

  useEffect(() => {
    fetchMyStories();
  }, [fetchMyStories]);

  // Close chooser when clicking outside
  useEffect(() => {
    if (!chooserOpen) return;
    const handler = (e: MouseEvent) => {
      if (chooserRef.current && !chooserRef.current.contains(e.target as Node)) {
        setChooserOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [chooserOpen]);

  const hasActiveStory = myStories.length > 0;

  const handleAvatarClick = () => {
    if (hasActiveStory) {
      setChooserOpen((v) => !v);
    } else {
      setAvatarOpen(true);
    }
  };

  const openStory = () => {
    setChooserOpen(false);
    setViewerOpen(true);
  };

  const openAvatar = () => {
    setChooserOpen(false);
    setAvatarOpen(true);
  };

  const fallback =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80";
  const resolvedAvatar = avatarUrl || fallback;

  return (
    <div className={cn("relative", className)} ref={chooserRef}>
      {/* Animated gradient ring when there's an active story */}
      {hasActiveStory && (
        <div
          aria-hidden
          className="absolute inset-[-3px] rounded-2xl overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "conic-gradient(from 0deg, #3b82f6, #d946ef, #8b5cf6, #3b82f6)",
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              animation: "profile-story-spin 2.4s linear infinite",
              background:
                "conic-gradient(from 90deg, #3b82f6, #d946ef, #8b5cf6, #3b82f6)",
              filter: "blur(6px)",
              opacity: 0.7,
            }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleAvatarClick}
        aria-label={hasActiveStory ? "Story options" : "View avatar"}
        className="relative block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue/60"
      >
        <img
          src={resolvedAvatar}
          alt={displayName}
          className="h-24 w-24 rounded-2xl border-4 border-[#09090b] object-cover shadow-xl"
        />
        {hasActiveStory && (
          <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-neon-pink border-2 border-[#09090b] shadow-[0_0_8px_rgba(255,0,127,0.9)]" />
        )}
      </button>

      {/* Chooser popover */}
      {chooserOpen && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-2 z-30 w-44 rounded-xl bg-[#18181b] border border-white/10 shadow-2xl py-1.5 overflow-hidden"
        >
          <button
            type="button"
            onClick={openStory}
            role="menuitem"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-white/5 transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-electric-blue" />
            <span>Xem Story</span>
          </button>
          <div className="h-px bg-white/5 mx-2" />
          <button
            type="button"
            onClick={openAvatar}
            role="menuitem"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-white/5 transition-colors"
          >
            <UserIcon className="h-3.5 w-3.5 text-neon-pink" />
            <span>Xem Avatar</span>
          </button>
        </div>
      )}

      {/* Story viewer (reuse from home) */}
      {hasActiveStory && (
        <StoryViewer
          stories={myStories}
          initialIndex={0}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* Avatar lightbox */}
      <Dialog open={avatarOpen} onOpenChange={(o) => !o && setAvatarOpen(false)}>
        <DialogContent
          showCloseButton
          className="max-w-none w-screen h-screen max-h-screen sm:max-w-none sm:max-h-screen p-0 bg-black/90 backdrop-blur-md border-0 ring-0 left-0 top-0 translate-x-0 translate-y-0 rounded-none"
        >
          <DialogTitle className="sr-only">Avatar của {displayName}</DialogTitle>
          <div className="w-full h-full flex items-center justify-center p-6">
            <img
              src={resolvedAvatar}
              alt={displayName}
              className="max-w-[min(420px,90vw)] max-h-[min(420px,90vw)] w-full h-full aspect-square rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Local keyframes for the gradient spin */}
      <style>{`
        @keyframes profile-story-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
