import { Image, Smile, Send, Heart, MessageSquare, Share2, MoreHorizontal, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { mockStories, mockPosts } from "@/mock";
import { useAuth } from "@/hooks/useAuth";
const tabs = ["For You", "Following"] as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const currentUserId = "me";

  return (
    <div className="space-y-4">
      {/* STORIES BAR */}
      <div className="relative group/stories">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-[#09090b] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition shadow-lg opacity-0 group-hover/stories:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-[#09090b] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition shadow-lg opacity-0 group-hover/stories:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing touch-pan-x">
          {mockStories.map((story) => {
            const isYou = story.author.id === currentUserId;
            return (
              <button
                key={story.id}
                className="shrink-0 group relative w-[118px] snap-start"
              >
                <div
                  className={`relative h-[190px] w-full rounded-2xl overflow-hidden ${
                    isYou ? "" : "p-[2px] bg-linear-to-br from-electric-blue via-neon-pink to-cyber-purple"
                  }`}
                >
                  <div className={`h-full w-full rounded-2xl overflow-hidden relative ${isYou ? "" : "bg-[#09090b]"}`}>
                    <img
                      src={story.mediaUrl}
                      alt={story.author.displayName}
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    <div className={`absolute z-10 ${
                      isYou
                        ? "inset-0 flex flex-col items-center justify-center gap-2"
                        : "bottom-3 left-3 flex items-center gap-2"
                    }`}>
                      {isYou ? (
                        <>
                          <div className="h-10 w-10 rounded-full bg-zinc-800/90 border-2 border-dashed border-zinc-500 flex items-center justify-center">
                            <svg className="h-5 w-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-white drop-shadow-lg">
                            {story.author.displayName}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
                            <img
                              src={story.author.avatarUrl}
                              alt={story.author.displayName}
                              className="h-full w-full object-cover"
                            />
                          </div>
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
      </div>

      {/* CREATE POST BOX */}
      <div className="glass-mac rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
            alt="Your avatar"
            className="h-10 w-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="Share your thoughts..."
              className="w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-zinc-500 hover:text-electric-blue transition">
              <Image className="h-4 w-4" />
              <span className="text-xs font-medium">Media</span>
            </button>
            <button className="flex items-center gap-2 text-zinc-500 hover:text-neon-pink transition">
              <Smile className="h-4 w-4" />
              <span className="text-xs font-medium">Feeling</span>
            </button>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-linear-to-r from-electric-blue to-neon-pink px-4 py-1.5 text-xs font-bold text-white hover:brightness-110 transition">
            <Send className="h-3.5 w-3.5" />
            Post
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 glass-mac rounded-2xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
              tab === "For You"
                ? "bg-white/10 text-zinc-200"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* POSTS FEED */}
      {mockPosts.map((post) => (
        <div key={post.id} className="glass-mac rounded-2xl overflow-hidden">
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

          <div className="px-5 pb-3">
            <p className="text-sm text-zinc-300 leading-relaxed">{post.bodyText}</p>
          </div>

          {post.media && (
            <div className="px-0">
              <img
                src={post.media}
                alt="Post content"
                className="w-full h-64 object-cover"
              />
            </div>
          )}

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
      ))}
    </div>
  );
}