import { Link } from "react-router-dom";
import { Hash, User, FileText, Search as SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HashtagMentionText from "@/components/shared/HashtagMentionText";
import type { SearchResult } from "../api/search";

interface SearchResultsProps {
  result: SearchResult | null;
  loading: boolean;
  query: string;
  highlightType?: "users" | "hashtags" | "posts";
}

export default function SearchResults({
  result,
  loading,
  query,
  highlightType,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="glass-mac rounded-2xl p-8 text-center text-sm text-zinc-500">
        Đang tìm kiếm…
      </div>
    );
  }

  if (!result) return null;

  const { posts, users, hashtags } = result;
  const totalCount = posts.length + users.length + hashtags.length;

  if (totalCount === 0) {
    return (
      <div className="glass-mac rounded-2xl py-12 text-center text-zinc-500">
        <SearchIcon className="mx-auto mb-3 h-8 w-8 opacity-50" />
        <p className="text-sm font-medium">
          Không tìm thấy kết quả cho "{query}"
        </p>
        <p className="mt-1 text-xs">Thử từ khóa khác.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.length > 0 && (
        <ResultSection
          title="Người dùng"
          icon={<User className="h-4 w-4" />}
          highlighted={highlightType === "users"}
        >
          {users.map((u) => (
            <Link
              key={u.id}
              to={`/profile/${encodeURIComponent(u.username)}`}
              className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={u.avatarUrl || undefined} alt={u.displayName} />
                <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-xs font-bold">
                  {u.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-zinc-200">
                  {u.displayName}
                </p>
                <p className="truncate text-xs text-zinc-500">@{u.username}</p>
                {u.bio && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-zinc-400">
                    {u.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </ResultSection>
      )}

      {hashtags.length > 0 && (
        <ResultSection
          title="Hashtag"
          icon={<Hash className="h-4 w-4" />}
          highlighted={highlightType === "hashtags"}
        >
          {hashtags.map((h) => (
            <Link
              key={h.id}
              to={`/hashtag/${encodeURIComponent(h.name)}`}
              className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-electric-blue via-neon-pink to-cyber-purple">
                <Hash className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-electric-blue">
                  #{h.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {h._count?.posts ?? 0} {(h._count?.posts ?? 0) === 1 ? "post" : "posts"}
                </p>
              </div>
            </Link>
          ))}
        </ResultSection>
      )}

      {posts.length > 0 && (
        <ResultSection
          title="Bài viết"
          icon={<FileText className="h-4 w-4" />}
          highlighted={highlightType === "posts"}
        >
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/profile/${encodeURIComponent(p.author.username)}`}
              className="block rounded-xl border border-white/5 p-4 transition-colors hover:bg-white/5"
            >
              <div className="mb-1 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={p.author.avatarUrl || undefined}
                    alt={p.author.displayName}
                  />
                  <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-[9px] font-bold text-white">
                    {p.author.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold text-zinc-200">
                  {p.author.displayName}
                </span>
                <span className="text-[10px] text-zinc-500">
                  @{p.author.username}
                </span>
              </div>
              {p.bodyText && (
                <p className="line-clamp-3 text-sm text-zinc-300">
                  <HashtagMentionText text={p.bodyText} />
                </p>
              )}
            </Link>
          ))}
        </ResultSection>
      )}
    </div>
  );
}

function ResultSection({
  title,
  icon,
  highlighted,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`glass-mac rounded-2xl p-4 ${
        highlighted ? "ring-1 ring-electric-blue/40" : ""
      }`}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
