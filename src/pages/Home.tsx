import { useState } from "react";

import StoriesBar from "@/components/home/StoriesBar";
import CreatePostBox from "@/components/home/CreatePostBox";
import FeedTabs from "@/components/home/FeedTabs";
import PostsFeed from "@/components/home/PostsFeed";

const TABS = ["For You", "Following"] as const;
type Tab = (typeof TABS)[number];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("For You");

  return (
    <div className="space-y-4">
      <StoriesBar />
      <CreatePostBox />
      <FeedTabs value={activeTab} onChange={setActiveTab} />
      <PostsFeed activeTab={activeTab} />
    </div>
  );
}
