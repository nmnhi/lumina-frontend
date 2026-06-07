import { Bookmark } from "lucide-react";
import PostsFeed from "@/features/home/components/PostsFeed";
import { getBookmarksApi } from "../api/bookmarks";

export default function Bookmarks() {
  const fetchBookmarks = (cursor?: string) =>
    getBookmarksApi(cursor).then((res) => ({
      data: {
        posts: res.data.posts,
        nextCursor: res.data.nextCursor,
      },
    }));

  return (
    <div className="space-y-4">
      <div className="glass-mac flex items-center gap-3 rounded-2xl p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-electric-blue/30 to-cyber-purple/30">
          <Bookmark className="h-5 w-5 text-electric-blue" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Đã lưu</h1>
          <p className="text-xs text-zinc-500">
            Tất cả bài viết bạn đã bookmark
          </p>
        </div>
      </div>
      <PostsFeed
        fetchFn={fetchBookmarks}
        emptyMessage="Bạn chưa lưu bài viết nào."
      />
    </div>
  );
}
