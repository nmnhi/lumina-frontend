import { Share2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HashtagMentionText from "@/components/shared/HashtagMentionText";
import MiniSpinner from "@/components/shared/MiniSpinner";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/useAuth";
import {
  deleteSharePostApi,
  sharePostApi,
  updateSharePostApi,
} from "@/features/interactions/api/interactions";
import { timeAgo } from "@/lib/utils";
import type { Post } from "@/types";

/* ─── Props ─── */

interface SharePostDialogProps {
  postId: string;
  originalPost: Post;          // bài gốc hiển thị preview
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingShare?: Post | null; // nếu đã share thì mở ở edit mode
  onShareSuccess?: () => void; // gọi khi tạo share mới (tăng count)
  onShareUpdated?: () => void; // gọi khi cập nhật caption
  onShareDeleted?: () => void; // gọi khi xoá share (giảm count)
}

/* ─── Helpers ─── */

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m3u8)(\?|$)/i;
const isVideoUrl = (url: string) => VIDEO_EXT.test(url);

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function normalizeMedia(raw: Post["media"]): string[] {
  if (!raw) return [];
  if (Array.isArray(raw))
    return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

/* ─── Component ─── */

export default function SharePostDialog({
  postId,
  originalPost,
  open,
  onOpenChange,
  existingShare,
  onShareSuccess,
  onShareUpdated,
  onShareDeleted,
}: SharePostDialogProps) {
  const { user } = useAuth();
  const isEditMode = !!existingShare;
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset state khi mở/đóng dialog
  useEffect(() => {
    if (open) {
      setText(existingShare?.bodyText ?? "");
      setConfirmDelete(false);
    }
  }, [open, existingShare]);

  const origMedia = normalizeMedia(originalPost.media);
  const authorInitials = getInitials(originalPost.author.displayName);

  const handleShare = async () => {
    try {
      setSubmitting(true);
      if (isEditMode) {
        // Edit mode: cập nhật caption bài share đã tồn tại
        await updateSharePostApi(postId, text.trim());
        toast.success("Đã cập nhật bài chia sẻ ✨");
        onShareUpdated?.();
      } else {
        // Create mode: gọi API share với text
        const res = await sharePostApi(postId, text.trim() || undefined);
        if (res.data.alreadyShared) {
          // Bài đã được share từ trước mà không biết → cập nhật caption
          await updateSharePostApi(postId, text.trim());
          toast.success("Đã cập nhật bài chia sẻ ✨");
          onShareUpdated?.();
        } else {
          toast.success("Đã chia sẻ bài viết 🚀");
          onShareSuccess?.();
        }
      }
      onOpenChange(false);
    } catch {
      toast.error(
        isEditMode
          ? "Cập nhật bài chia sẻ thất bại."
          : "Chia sẻ bài viết thất bại, vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await deleteSharePostApi(postId);
      toast.success("Đã bỏ chia sẻ bài viết.");
      onShareDeleted?.();
      onOpenChange(false);
    } catch {
      toast.error("Bỏ chia sẻ thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-lg p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="h-4 w-4 text-cyber-purple" />
            {isEditMode ? "Chỉnh sửa bài chia sẻ" : "Chia sẻ bài viết"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditMode
              ? "Edit your shared post on Lumina Social"
              : "Share a post to your profile on Lumina Social"}
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-none">
          {/* Avatar + Textarea */}
          <div className="flex items-start gap-3">
            <Avatar size="lg" className="ring-1 ring-white/10 shrink-0">
              <AvatarImage
                src={user?.avatarUrl || FALLBACK_AVATAR}
                alt={user?.displayName || "You"}
              />
              <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white font-bold text-xs">
                {getInitials(user?.displayName || "You")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-1">
              <p className="text-sm font-semibold text-zinc-200">
                {user?.displayName || "You"}
              </p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={submitting}
                placeholder="Viết gì đó khi chia sẻ..."
                rows={3}
                className="mt-2 w-full resize-none bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none scrollbar-none"
              />
            </div>
          </div>

          {/* Preview bài gốc (Facebook style) */}
          <div className="rounded-xl border border-white/10 bg-white/2 overflow-hidden">
            <Link
              to={`/profile/${originalPost.author.username}`}
              className="flex items-center gap-2 px-4 pt-3 pb-1 hover:opacity-80 transition"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={originalPost.author.avatarUrl}
                  alt={originalPost.author.displayName}
                />
                <AvatarFallback className="text-[8px] bg-linear-to-br from-cyber-purple to-electric-blue text-white font-bold">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold text-zinc-300 truncate">
                {originalPost.author.displayName}
              </span>
              <span className="text-[10px] text-zinc-600">
                · {timeAgo(originalPost.createdAt)}
              </span>
            </Link>
            {originalPost.bodyText && (
              <div className="px-4 pb-2">
                <HashtagMentionText
                  text={originalPost.bodyText}
                  className="text-xs text-zinc-400 leading-relaxed line-clamp-3 whitespace-pre-line"
                />
              </div>
            )}
            {origMedia.length > 0 && (
              <div className="max-h-32 overflow-hidden border-t border-white/5">
                {origMedia.length === 1 || isVideoUrl(origMedia[0]) ? (
                  <img
                    src={origMedia[0]}
                    alt=""
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-px h-32">
                    {origMedia.slice(0, 2).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          {isEditMode ? (
            confirmDelete ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="text-xs text-zinc-400">Xác nhận bỏ chia sẻ?</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                    disabled={submitting}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    Huỷ
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 px-4 h-8 text-xs font-semibold"
                  >
                    {submitting && <MiniSpinner size={14} className="mr-1" />}
                    Xoá
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                  disabled={submitting}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Bỏ chia sẻ
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    disabled={submitting}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    Đóng
                  </Button>
                  <Button
                    onClick={handleShare}
                    disabled={submitting || text.trim() === (existingShare?.bodyText ?? "")}
                    className="btn-lumina rounded-full bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple px-6 h-9 text-sm font-bold text-white shadow-lg cursor-pointer hover:opacity-90"
                  >
                    {submitting && <MiniSpinner size={14} className="mr-1" />}
                    {submitting ? "Đang lưu..." : "Cập nhật"}
                  </Button>
                </div>
              </>
            )
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
                className="text-zinc-400 hover:text-zinc-200"
              >
                Huỷ
              </Button>
              <Button
                onClick={handleShare}
                disabled={submitting}
                className="btn-lumina rounded-full bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple px-6 h-9 text-sm font-bold text-white shadow-lg cursor-pointer hover:opacity-90"
              >
                {submitting && <MiniSpinner size={14} className="mr-1" />}
                {submitting ? "Đang đăng..." : "Chia sẻ ngay"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
