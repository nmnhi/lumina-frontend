import CreatePostBox from "@/features/home/components/CreatePostBox";
import PostsFeed from "@/features/home/components/PostsFeed";
import StoriesBar from "@/features/home/components/StoriesBar";
import { usePostRefresh } from "@/features/home/context/PostRefreshContext";

export default function Home() {
  const { refreshKey } = usePostRefresh();

  return (
    <div className="space-y-4">
      <StoriesBar />
      <CreatePostBox />
      <PostsFeed refreshKey={refreshKey} />
    </div>
  );
}
