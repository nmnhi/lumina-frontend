import { mockTrends } from "@/mock";

export default function TrendingNow() {
  return (
    <div className="glass-mac rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-200">Trending Now</h3>
      </div>
      <div className="space-y-4">
        {mockTrends.map((trend, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-[11px] text-zinc-500 font-medium">
              {trend.category}
            </span>
            <span className="text-sm font-bold text-zinc-200 hover:text-electric-blue cursor-pointer transition">
              {trend.tag}
            </span>
            <span className="text-xs text-zinc-500 mt-0.5">
              {trend.posts}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
