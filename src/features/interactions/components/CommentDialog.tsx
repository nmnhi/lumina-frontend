import { MessageSquare, X as XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCommentsApi,
} from "@/features/interactions/api/interactions";
import type { Comment } from "@/types";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

/* ─── Props ─── */

interface CommentDialogProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentCountChange?: (delta: number) => void;
}

/* ─── Component ─── */

export default function CommentDialog({
  postId,
  open,
  onOpenChange,
  onCommentCountChange,
}: CommentDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; username: string; displayName: string } | null>(null);
  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getCommentsApi(postId);
      setComments(res.data);
    } catch {
      setError(true);
      toast.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  /* Reload comments every time dialog opens — ensures fresh data */
  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, fetchComments]);

  const handleCommentCreated = useCallback(() => {
    /* Refetch to get the correct tree structure + notify parent of new count */
    fetchComments();
    onCommentCountChange?.(1);
  }, [fetchComments, onCommentCountChange]);

  const handleCommentUpdated = useCallback(
    (updated: Comment) => {
      /* Update the comment in the tree */
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === updated.id
            ? {
                ...c,
                content: updated.content,
                createdAt: updated.createdAt,
              }
            : {
                ...c,
                replies: c.replies?.map((r) =>
                  r.id === updated.id
                    ? {
                        ...r,
                        content: updated.content,
                        createdAt: updated.createdAt,
                      }
                    : r
                ),
              }
        )
      );
    },
    []
  );

  const handleCommentDeleted = useCallback((commentId: string) => {
    /* Remove the comment from the tree */
    setComments((prevComments) => {
      return prevComments
        .filter((c) => c.id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies?.filter((r) => r.id !== commentId),
        }));
    });
    onCommentCountChange?.(-1);
  }, [onCommentCountChange]);

  const handleReply = useCallback((comment: Comment) => {
    setReplyTo({ id: comment.id, username: comment.user.username, displayName: comment.user.displayName });
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReplyTo(null);
    }
    onOpenChange(open);
  };

  const totalComments = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length ?? 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-lg p-0 gap-0 ring-1 ring-white/10 max-h-[80vh] flex flex-col"
        showCloseButton={false}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Comments</span>
            {totalComments > 0 && (
              <span className="text-xs text-zinc-600 bg-white/5 rounded-full px-2 py-0.5">
                {totalComments}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenChange(false)}
            className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            aria-label="Close"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* ─── Comment List ─── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
              <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Failed to load comments.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchComments}
                className="mt-2 text-electric-blue hover:text-electric-blue hover:bg-transparent"
              >
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && comments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
              <MessageSquare className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium text-zinc-500">
                No comments yet.
              </p>
              <p className="text-xs text-zinc-700 mt-1">
                Be the first to share your thoughts!
              </p>
            </div>
          )}

          {!loading && !error && comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <CommentItem
                    comment={comment}
                    postId={postId}
                    onReply={handleReply}
                    onCommentUpdated={handleCommentUpdated}
                    onCommentDeleted={handleCommentDeleted}
                    replyTargetId={replyTo?.id ?? null}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-white/5 shrink-0" />

        {/* ─── Input Area ─── */}
        <div className="px-5 py-4 shrink-0">
          <CommentInput
            postId={postId}
            replyTo={replyTo}
            onCancelReply={handleCancelReply}
            onCommentCreated={handleCommentCreated}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
