import { useState } from "react";
import CreatePostBox from "@/features/home/components/CreatePostBox";
import FeedTabs from "@/features/home/components/FeedTabs";
import PostsFeed from "@/features/home/components/PostsFeed";
import StoriesBar from "@/features/home/components/StoriesBar";
import type { FeedType } from "@/features/home/api/newsfeed";
import { usePostRefresh } from "@/features/home/context/PostRefreshContext";

export default function Home() {
  const { refreshKey } = usePostRefresh();
  const [activeTab, setActiveTab] = useState<FeedType>("forYou");

  return (
    <div className="space-y-4">
      {/* Stories bar sticky trong scroll container của main content */}
      <div className="sticky top-0 z-20 -mx-2 bg-[#09090b]/80 px-2 pb-3 pt-1 backdrop-blur-md">
        <StoriesBar />
      </div>
      <CreatePostBox />
      <FeedTabs activeTab={activeTab} onChange={setActiveTab} />
      <PostsFeed refreshKey={refreshKey} activeTab={activeTab} />
    </div>
  );
}
