import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import { getNewsfeedApi } from "@/features/home/api/newsfeed";
import PostCard from "./PostCard";
import MediaLightbox from "./MediaLightbox";
import { Loader2 } from "lucide-react";
import { PostCardSkeleton } from "@/components/shared/PostCardSkeleton";

interface PostsFeedProps {
  activeTab?: "For You" | "Following";
  refreshKey?: number;
}

function normalizeMedia(raw: Post["media"]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw))
    return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

export default function PostsFeed({ activeTab: _activeTab, refreshKey }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (cursorVal?: string, keep?: boolean) => {
    if (!cursorVal) setLoading(true);
    try {
      const res = await getNewsfeedApi(cursorVal);
      const newPosts = res.data.posts;
      if (keep) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      setCursor(res.data.nextCursor);
      if (!res.data.nextCursor) setHasMore(false);
    } catch (err) {
      console.error("Failed to fetch newsfeed:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Only watch refreshKey — fetch on mount and when refreshKey changes
  const keyRef = useRef(refreshKey);
  useEffect(() => {
    if (refreshKey !== keyRef.current) {
      keyRef.current = refreshKey;
      setCursor(undefined);
      setHasMore(true);
    }
    fetchPosts();
  }, [refreshKey, fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    if (loadingMore || !hasMore || loading) return;
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 400 && hasMore && !loadingMore) {
        setLoadingMore(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, loading]);

  useEffect(() => {
    if (loadingMore && hasMore) {
      fetchPosts(cursor);
    }
  }, [loadingMore]);

  // 🖼️ State cho lightbox
  const [lightbox, setLightbox] = useState<{
    urls: string[];
    index: number;
  } | null>(null);

  const openLightbox = useCallback((post: Post, mediaIndex: number) => {
    const urls = normalizeMedia(post.media);
    if (urls.length === 0) return;
    setLightbox({ urls, index: mediaIndex });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const handlePostUpdated = useCallback((updated: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  }, []);

  const handlePostDeleted = useCallback((deletedId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  }, []);

  return (
    <div className="space-y-4">
      {loading ? (
        <>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </>
      ) : posts.length === 0 ? (
        <div className="glass-mac rounded-2xl py-16 text-center text-zinc-500">
          <p className="text-sm font-medium">No posts yet</p>
          <p className="text-xs mt-1">Follow people to see their posts here.</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onMediaClick={(idx) => openLightbox(post, idx)}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))}
          {loadingMore && (
            <>
              <PostCardSkeleton />
            </>
          )}
        </>
      )}

      <MediaLightbox
        urls={lightbox?.urls ?? []}
        initialIndex={lightbox?.index ?? 0}
        isOpen={lightbox !== null}
        onClose={closeLightbox}
      />
    </div>
  );
}
