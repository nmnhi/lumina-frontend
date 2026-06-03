import { mockPosts } from "@/mock";
import PostCard from "./PostCard";

export default function PostsFeed() {
  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
