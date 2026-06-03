import StoriesBar from "@/components/home/StoriesBar";
import CreatePostBox from "@/components/home/CreatePostBox";
import FeedTabs from "@/components/home/FeedTabs";
import PostsFeed from "@/components/home/PostsFeed";

export default function Home() {
  return (
    <div className="space-y-4">
      <StoriesBar />
      <CreatePostBox />
      <FeedTabs />
      <PostsFeed />
    </div>
  );
}
