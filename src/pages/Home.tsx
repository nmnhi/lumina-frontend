import CreatePostBox from "@/components/home/CreatePostBox";
import PostsFeed from "@/components/home/PostsFeed";
import StoriesBar from "@/components/home/StoriesBar";

export default function Home() {
  return (
    <div className="space-y-4">
      <StoriesBar />
      <CreatePostBox />
      <PostsFeed />
    </div>
  );
}
