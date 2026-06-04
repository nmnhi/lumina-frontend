import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { mockStories } from "@/features/home/mock/stories";
import StoryViewer from "./StoryViewer";

const CURRENT_USER_ID = "me";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function StoriesBar() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  /** Only non-"Your Story" items are viewable */
  const viewableStories = mockStories.filter(
    (s) => s.author.id !== CURRENT_USER_ID
  );

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
    <div className="relative group/stories mx-8">
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
        {mockStories.map((story) => {
          const isYou = story.author.id === CURRENT_USER_ID;
          const initials = getInitials(story.author.displayName);
          return (
            <button
              key={story.id}
              className="shrink-0 group relative w-[118px] snap-start outline-none focus:outline-none"
              onClick={() => !isYou && openStory(story.id)}
            >
              <div
                className={`relative h-[190px] w-full rounded-2xl overflow-hidden ${
                  isYou ? "" : "p-[2px] bg-linear-to-br from-electric-blue via-neon-pink to-cyber-purple"
                }`}
              >
                <div
                  className={`h-full w-full rounded-2xl overflow-hidden relative ${
                    isYou ? "" : "bg-[#09090b]"
                  }`}
                >
                  <img
                    src={story.mediaUrl}
                    alt={story.author.displayName}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div
                    className={`absolute z-10 ${
                      isYou
                        ? "inset-0 flex flex-col items-center justify-center gap-2"
                        : "bottom-3 left-3 flex items-center gap-2"
                    }`}
                  >
                    {isYou ? (
                      <>
                        <div className="h-10 w-10 rounded-full bg-zinc-800/90 border-2 border-dashed border-zinc-500 flex items-center justify-center">
                          <Plus className="h-5 w-5 text-zinc-300" />
                        </div>
                        <span className="text-xs font-semibold text-white drop-shadow-lg">
                          {story.author.displayName}
                        </span>
                      </>
                    ) : (
                      <>
                        <Avatar size="sm" className="ring-2 ring-white/30 shrink-0">
                          <AvatarImage src={story.author.avatarUrl} alt={story.author.displayName} />
                          <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-[10px] font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-white drop-shadow-lg truncate max-w-[70px]">
                          {story.author.displayName}
                        </span>
                      </>
                    )}
                  </div>

                  {!isYou && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="h-2 w-2 rounded-full bg-neon-pink shadow-[0_0_6px_rgba(255,0,127,0.8)]" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <StoryViewer
        stories={viewableStories}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}
