import { ArrowLeft, MessageSquare, UserX } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import PostCard from "@/features/home/components/PostCard";
import { PostCardSkeleton } from "@/components/shared/PostCardSkeleton";
import CommentDialog from "@/features/interactions/components/CommentDialog";
import { getPostByIdApi } from "@/features/home/api/post";
import type { Post } from "@/types";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getPostByIdApi(id);
      setPost(res.data);
      setCommentCount(res.data._count?.comments ?? 0);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError("Post not found");
      } else {
        setError("Failed to load post");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 p-4">
        <PostCardSkeleton />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="glass-mac rounded-2xl p-10 text-center space-y-4">
          <UserX className="h-12 w-12 text-zinc-600 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-300">{error || "Post not found"}</h3>
            <p className="text-sm text-zinc-500">
              This post may have been deleted or the link is broken.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-electric-blue hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Post card */}
      <PostCard
        post={post}
        onMediaClick={() => {}}
        onPostUpdated={(updated) => {
          setPost(updated);
          setCommentCount(updated._count?.comments ?? 0);
        }}
        onPostDeleted={() => {
          toast.success("Post deleted");
          window.history.back();
        }}
      />

      {/* Comments section */}
      <div className="glass-mac rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-200">
              Comments
            </h2>
            {commentCount > 0 && (
              <span className="text-xs text-zinc-600 bg-white/5 rounded-full px-2 py-0.5">
                {commentCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setCommentOpen(true)}
            className="text-xs text-electric-blue hover:underline"
          >
            View all
          </button>
        </div>

        {commentCount === 0 ? (
          <p className="text-sm text-zinc-600 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-4">
            Open the comment dialog to view and reply to comments.
          </p>
        )}
      </div>

      {/* Comment dialog */}
      <CommentDialog
        postId={post.id}
        open={commentOpen}
        onOpenChange={setCommentOpen}
        onCommentCountChange={(delta) =>
          setCommentCount((c) => Math.max(0, c + delta))
        }
      />
    </div>
  );
}
