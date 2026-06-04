import CreatePostBox from "@/features/home/components/CreatePostBox";
import PostsFeed from "@/features/home/components/PostsFeed";
import StoriesBar from "@/features/home/components/StoriesBar";

export default function Home() {
  return (
    <div className="space-y-4">
      <StoriesBar />
      <CreatePostBox />
      <PostsFeed />
    </div>
  );
}
