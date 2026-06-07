import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { getTrendingHashtagsApi } from "@/features/hashtags/api/hashtags";
import { TrendItemSkeleton } from "@/components/shared/PostCardSkeleton";

interface TrendItem {
  id: string;
  name: string;
  _count?: { posts: number };
}

export default function ExploreTrending() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingHashtagsApi()
      .then((res) => setTrends(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-mac rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-electric-blue/30 to-cyber-purple/30">
          <TrendingUp className="h-4 w-4 text-electric-blue" />
        </div>
        <h2 className="text-base font-black text-white">Trending Now</h2>
      </div>
      {loading ? (
        <TrendItemSkeleton count={6} />
      ) : trends.length === 0 ? (
        <p className="text-xs text-zinc-600">Chưa có hashtag thịnh hành.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {trends.map((trend, i) => (
            <Link
              key={trend.id}
              to={`/hashtag/${encodeURIComponent(trend.name)}`}
              className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 p-3 transition hover:border-white/10 hover:bg-white/5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xs font-black text-zinc-500 group-hover:text-electric-blue">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-zinc-200 group-hover:text-electric-blue transition">
                  #{trend.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {trend._count?.posts ?? 0}{" "}
                  {(trend._count?.posts ?? 0) === 1 ? "post" : "posts"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
