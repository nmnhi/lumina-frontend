import { AlertTriangle, MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, timeAgo } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import {
  updateCommentApi,
  deleteCommentApi,
} from "@/features/interactions/api/interactions";
import type { Comment } from "@/types";

/* ─── Helpers ─── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ─── Props ─── */

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply: (comment: Comment) => void;
  onCommentUpdated?: (updated: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;
  replyTargetId?: string | null;
  isReply?: boolean;
}

/* ─── Component ─── */

export default function CommentItem({
  comment,
  postId,
  onReply,
  onCommentUpdated,
  onCommentDeleted,
  replyTargetId,
  isReply = false,
}: CommentItemProps) {
  const { user } = useAuth();
  const initials = getInitials(comment.user.displayName);
  const isReplying = replyTargetId === comment.id;
  const isOwner = user?.id === comment.userId;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  /* Auto-grow textarea in edit mode */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || !editMode) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [editContent, editMode]);

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await updateCommentApi(postId, comment.id, editContent.trim());
      onCommentUpdated?.(res.data);
      setEditMode(false);
      toast.success("Comment updated!");
    } catch {
      toast.error("Failed to update comment.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCommentApi(postId, comment.id);
      onCommentDeleted?.(comment.id);
      toast.success("Comment deleted!");
    } catch {
      toast.error("Failed to delete comment.");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleConfirmDelete = () => {
    setDropdownOpen(false);
    setConfirmDelete(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditContent(comment.content);
  };

  return (
    <div className="group">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="shrink-0 mt-0.5">
          <AvatarImage
            src={comment.user.avatarUrl || undefined}
            alt={comment.user.displayName}
          />
          <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-[10px] font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-zinc-200">
              {comment.user.displayName}
            </span>

            {/* Owner dropdown (Edit / Delete) */}
            {isOwner && (
              <div className="relative" ref={dropdownRef}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-zinc-600 hover:text-zinc-300 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="More"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>More</TooltipContent>
                </Tooltip>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 z-50 w-32 rounded-lg border border-white/10 bg-[#121214] p-1 shadow-xl backdrop-blur-xl">
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    <Separator className="my-0.5 bg-white/5" />
                    <button
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {editMode ? (
            /* Edit mode */
            <div className="mt-2 space-y-2">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={isUpdating}
                rows={1}
                className="w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-electric-blue/50 transition-colors disabled:opacity-50"
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="text-xs px-2 h-7 text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isUpdating || !editContent.trim()}
                  className="text-xs px-2 h-7 text-electric-blue hover:text-electric-blue hover:bg-electric-blue/10"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            /* View mode */
            <>
              <p className="mt-0.5 text-sm text-zinc-300 leading-relaxed whitespace-pre-line wrap-break-word">
                {comment.content}
              </p>

              <div className="mt-1 flex items-center gap-3">
                <span className="text-[11px] text-zinc-600">
                  {timeAgo(comment.createdAt)}
                </span>
                {/* Only show Reply button for root comments, not for replies */}
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReply(comment)}
                    className={cn(
                      "h-auto p-0 text-[11px] font-medium text-zinc-600 hover:text-electric-blue hover:bg-transparent",
                      isReplying && "text-electric-blue"
                    )}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-2 pl-3 border-l-2 border-white/10 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
              replyTargetId={replyTargetId}
              isReply={true}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-sm p-0 gap-0 ring-1 ring-white/10">
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-white">Delete comment?</DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-end gap-2 px-5 py-4">
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete(false)}
              disabled={isDeleting}
              className="text-xs text-zinc-400 hover:text-zinc-200 h-8 px-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs h-8 px-3 bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
