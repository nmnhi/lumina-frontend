import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Compass } from "lucide-react";
import { searchApi, type SearchType } from "../api/search";
import SearchInput from "../components/SearchInput";
import SearchResults from "../components/SearchResults";
import ExploreTrending from "../components/ExploreTrending";
import { useDebounced } from "../hooks/useDebounced";

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [tab, setTab] = useState<SearchType>(
    (params.get("type") as SearchType) || "all"
  );
  const debouncedQuery = useDebounced(query, 300);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof searchApi>
  >["data"] | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync URL with state
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (tab !== "all") next.set("type", tab);
    setParams(next, { replace: true });
  }, [query, tab, setParams]);

  // Run search when debounced query or tab changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResult(null);
      return;
    }
    setLoading(true);
    searchApi(debouncedQuery.trim(), tab)
      .then((res) => setResult(res.data))
      .catch(() => setResult({ posts: [], users: [], hashtags: [] }))
      .finally(() => setLoading(false));
  }, [debouncedQuery, tab]);

  const isSearching = debouncedQuery.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="glass-mac flex items-center gap-3 rounded-2xl p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-electric-blue/30 to-cyber-purple/30">
          <Compass className="h-5 w-5 text-electric-blue" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Explore</h1>
          <p className="text-xs text-zinc-500">
            Khám phá bài viết, người dùng và hashtag
          </p>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Tìm kiếm bài viết, người dùng, hashtag..."
        autoFocus
      />

      {/* TABS — chỉ hiện khi đang search */}
      {isSearching && (
        <div className="glass-mac flex items-center rounded-2xl p-1">
          {(
            [
              { key: "all", label: "Tất cả" },
              { key: "users", label: "Người dùng" },
              { key: "hashtags", label: "Hashtag" },
              { key: "posts", label: "Bài viết" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-colors ${
                tab === t.key
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* RESULTS or TRENDING */}
      {isSearching ? (
        <SearchResults
          result={result}
          loading={loading}
          query={debouncedQuery.trim()}
          highlightType={
            tab === "users" || tab === "hashtags" || tab === "posts"
              ? tab
              : undefined
          }
        />
      ) : (
        <>
          <ExploreTrending />
          <ExploreEmptyHint />
        </>
      )}
    </div>
  );
}

function ExploreEmptyHint() {
  return (
    <div className="glass-mac rounded-2xl p-8 text-center text-zinc-500">
      <Search className="mx-auto mb-3 h-8 w-8 opacity-50" />
      <p className="text-sm font-medium">Bắt đầu tìm kiếm</p>
      <p className="mt-1 text-xs">
        Nhập từ khóa để tìm bài viết, người dùng hoặc hashtag.
      </p>
    </div>
  );
}
