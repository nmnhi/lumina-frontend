import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton placeholder cho 1 PostCard trong feed */
export function PostCardSkeleton() {
  return (
    <article className="glass-mac rounded-2xl overflow-hidden p-5 space-y-4">
      {/* Header: avatar + name + username + timestamp */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>

      {/* Body text — 3 lines */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-[78%]" />
      </div>

      {/* Media placeholder */}
      <Skeleton className="h-64 w-full rounded-xl" />

      {/* Stats + actions */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <Skeleton className="h-8 flex-1 rounded-lg" />
        <Skeleton className="h-8 flex-1 rounded-lg" />
        <Skeleton className="h-8 flex-1 rounded-lg" />
      </div>
    </article>
  );
}

/** Skeleton placeholder cho danh sách user (WhoToFollow, ActiveConnections, ...) */
export function UserRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="h-7 w-16 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton cho conversation item trong chat sidebar */
export function ConversationRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-10" />
            </div>
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton cho message bubble trong chat */
export function MessageBubbleSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`flex items-end gap-2 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          {i % 2 === 1 && <Skeleton className="h-6 w-6 rounded-full shrink-0" />}
          <div className={`flex flex-col gap-1.5 ${i % 2 === 0 ? "items-end" : "items-start"}`}>
            <Skeleton className={`h-9 ${i === 1 ? "w-40" : i === 2 ? "w-56" : i === 3 ? "w-32" : "w-48"} rounded-2xl`} />
            <Skeleton className="h-2 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton cho profile cover/avatar/info */
export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="glass-mac rounded-2xl overflow-hidden">
        {/* Cover */}
        <Skeleton className="h-40 w-full rounded-none" />
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <Skeleton className="h-24 w-24 rounded-2xl border-4 border-[#09090b]" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="h-3.5 w-full max-w-md" />
            <div className="flex gap-4">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <Skeleton className="h-12 w-full rounded-2xl" />
      {/* Posts */}
      <PostCardSkeleton />
    </div>
  );
}

/** Skeleton cho trend item (TrendingNow) */
export function TrendItemSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
