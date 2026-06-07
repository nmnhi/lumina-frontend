import SlidingTabs, { type SlidingTabItem } from "@/components/shared/SlidingTabs";
import type { FeedType } from "../api/newsfeed";

const TABS: ReadonlyArray<SlidingTabItem & { key: FeedType }> = [
  { key: "forYou", label: "For You" },
  { key: "following", label: "Following" },
] as const;

interface FeedTabsProps {
  activeTab: FeedType;
  onChange: (tab: FeedType) => void;
}

/**
 * Pill-style toggle between "For You" and "Following".
 * Pure controlled component — state lives in the parent (Home page).
 */
export default function FeedTabs({ activeTab, onChange }: FeedTabsProps) {
  return <SlidingTabs tabs={TABS} activeTab={activeTab} onChange={onChange} />;
}
