import { useState, useCallback } from "react";
import { mockPosts } from "@/mock";
import type { Post } from "@/types";
import PostCard from "./PostCard";
import MediaLightbox from "./MediaLightbox";

interface PostsFeedProps {
  activeTab?: "For You" | "Following";
}

function normalizeMedia(raw: Post["media"]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

export default function PostsFeed({ activeTab: _activeTab }: PostsFeedProps) {
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

  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onMediaClick={(idx) => openLightbox(post, idx)}
        />
      ))}

      <MediaLightbox
        urls={lightbox?.urls ?? []}
        initialIndex={lightbox?.index ?? 0}
        isOpen={lightbox !== null}
        onClose={closeLightbox}
      />
    </div>
  );
}
