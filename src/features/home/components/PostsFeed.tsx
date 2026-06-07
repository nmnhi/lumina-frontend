import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import {
  getNewsfeedApi,
  type FeedType,
  type NewsfeedResult,
} from "@/features/home/api/newsfeed";
import WhoToFollowInline from "@/features/follow/components/WhoToFollowInline";
import PostCard from "./PostCard";
import MediaLightbox from "./MediaLightbox";
import { PostCardSkeleton } from "@/components/shared/PostCardSkeleton";

interface PostsFeedProps {
  /** When using the default fetcher, controls which feed (forYou / following) is fetched. */
  activeTab?: FeedType;
  refreshKey?: number;
  /** Custom fetcher. Defaults to getNewsfeedApi. Useful for hashtag / search / bookmarks. */
  fetchFn?: (cursor?: string) => Promise<{ data: NewsfeedResult }>;
  /** Empty state message override */
  emptyMessage?: string;
}

function normalizeMedia(raw: Post["media"]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw))
    return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

export default function PostsFeed({
  activeTab = "forYou",
  refreshKey,
  fetchFn,
  emptyMessage = "Follow people to see their posts here.",
}: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // If a custom fetcher is provided, activeTab is ignored.
  const isCustom = !!fetchFn;
  const fetcher = useCallback(
    (cursorVal?: string) =>
      isCustom
        ? (fetchFn as NonNullable<typeof fetchFn>)(cursorVal)
        : getNewsfeedApi(cursorVal, activeTab),
    [isCustom, fetchFn, activeTab]
  );

  const fetchPosts = useCallback(
    async (cursorVal?: string, keep?: boolean) => {
      if (!cursorVal) setLoading(true);
      try {
        const res = await fetcher(cursorVal);
        const newPosts = res.data.posts;
        if (keep) {
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        setCursor(res.data.nextCursor);
        if (!res.data.nextCursor) setHasMore(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetcher]
  );

  // Watch refreshKey + activeTab — re-fetch when either changes
  const keyRef = useRef(`${refreshKey}-${activeTab}-${isCustom}`);
  useEffect(() => {
    const currentKey = `${refreshKey}-${activeTab}-${isCustom}`;
    if (keyRef.current !== currentKey) {
      keyRef.current = currentKey;
      setCursor(undefined);
      setHasMore(true);
      setPosts([]);
    }
    fetchPosts();
  }, [refreshKey, activeTab, isCustom, fetchPosts]);

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
          <p className="text-xs mt-1">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {posts.map((post, idx) => (
            <Fragment key={post.id}>
              <PostCard
                post={post}
                onMediaClick={(mediaIdx) => openLightbox(post, mediaIdx)}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
              {/* Chèn "Gợi ý cho bạn" sau mỗi 5 post (chỉ ở newsfeed, không phải hashtag/bookmarks) */}
              {!isCustom && (idx + 1) % 5 === 0 && idx < posts.length - 1 && (
                <WhoToFollowInline />
              )}
            </Fragment>
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
