import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { updatePostApi } from "@/features/home/api/post";
import type { Post } from "@/types";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updated: Post) => void;
}

export default function EditPostDialog({
  post,
  open,
  onOpenChange,
  onSuccess,
}: EditPostDialogProps) {
  const [text, setText] = useState(post.bodyText ?? "");
  const [submitting, setSubmitting] = useState(false);

  const initials = (post.author.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Bài viết không được để trống.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await updatePostApi(post.id, { bodyText: trimmed });
      toast.success("Đã cập nhật bài viết ✨");
      onOpenChange(false);
      onSuccess?.(res.data);
    } catch {
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) setText(post.bodyText ?? "");
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-lg p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white">
            Edit Post
          </DialogTitle>
          <DialogDescription className="sr-only">
            Edit your post on Lumina Social
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-4">
          {/* Avatar + Textarea */}
          <div className="flex items-start gap-3">
            <Avatar size="lg" className="ring-1 ring-white/10 shrink-0">
              <AvatarImage
                src={post.author.avatarUrl || FALLBACK_AVATAR}
                alt={post.author.displayName}
              />
              <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-1">
              <p className="text-sm font-semibold text-zinc-200">
                {post.author.displayName}
              </p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={submitting}
                placeholder="What's on your mind?"
                rows={5}
                className="mt-2 w-full resize-none bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none scrollbar-none"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={submitting || text.trim() === (post.bodyText ?? "")}
            className="btn-lumina rounded-full bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple px-6 h-9 text-sm font-bold text-white shadow-lg cursor-pointer hover:opacity-90"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
