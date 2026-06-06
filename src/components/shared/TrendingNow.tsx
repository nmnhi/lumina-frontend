import { useEffect, useState } from "react";
import { getTrendingHashtagsApi } from "@/features/hashtags/api/hashtags";
import { TrendItemSkeleton } from "./PostCardSkeleton";

interface TrendItem {
  name: string;
  _count?: { posts: number };
}

export default function TrendingNow() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingHashtagsApi()
      .then((res) => setTrends(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-mac rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-200">Trending Now</h3>
      </div>
      <div className="space-y-4">
        {loading ? (
          <TrendItemSkeleton count={4} />
        ) : trends.length === 0 ? (
          <p className="text-xs text-zinc-600">No trending topics yet.</p>
        ) : (
          trends.map((trend, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-[11px] text-zinc-500 font-medium">Technology • Trending</span>
              <span className="text-sm font-bold text-zinc-200 hover:text-electric-blue cursor-pointer transition">
                #{trend.name}
              </span>
              <span className="text-xs text-zinc-500 mt-0.5">
                {trend._count?.posts ?? 0} {trend._count?.posts === 1 ? "post" : "posts"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
