import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostsFeed from "@/features/home/components/PostsFeed";
import HashtagHeader from "../components/HashtagHeader";
import { getPostsByHashtagApi, getTrendingHashtagsApi } from "../api/hashtags";

export default function HashtagPage() {
  const { name = "" } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name);
  const [postCount, setPostCount] = useState<number | undefined>(undefined);

  // Look up total post count from trending list (best-effort) so the header
  // can show a count even before the feed finishes loading.
  useEffect(() => {
    let cancelled = false;
    getTrendingHashtagsApi()
      .then((res) => {
        if (cancelled) return;
        const match = res.data.find(
          (h) => h.name.toLowerCase() === decodedName.toLowerCase()
        );
        if (match) setPostCount(match._count.posts);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [decodedName]);

  // Build a fetcher bound to this hashtag name
  const fetchByHashtag = (cursor?: string) =>
    getPostsByHashtagApi(decodedName, cursor).then((res) => ({
      data: {
        posts: res.data.posts,
        nextCursor: res.data.nextCursor,
      },
    }));

  return (
    <div className="space-y-4">
      <HashtagHeader name={decodedName} postCount={postCount} />
      <PostsFeed
        fetchFn={fetchByHashtag}
        emptyMessage="Chưa có bài viết nào dùng hashtag này."
      />
    </div>
  );
}
