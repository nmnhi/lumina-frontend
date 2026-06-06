import { Image, Smile, Video, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import { createPostApi } from "@/features/home/api/post";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

const MAX_FILES = 4;

interface PreviewItem {
  url: string;
  type: "image" | "video";
  file: File;
}

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreatePostDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreatePostDialogProps) {
  const { user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const avatarUrl = user?.avatarUrl || FALLBACK_AVATAR;
  const firstName = (user?.displayName || "there").split(" ")[0];
  const initials = firstName.charAt(0).toUpperCase();

  const addFiles = (files: FileList | null, kind: "image" | "video") => {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);
    const next: PreviewItem[] = [...previews];

    for (const file of incoming) {
      if (next.length >= MAX_FILES) {
        toast.warning(`Tối đa ${MAX_FILES} file cho mỗi bài viết.`);
        break;
      }
      next.push({
        url: URL.createObjectURL(file),
        type: kind,
        file,
      });
    }

    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews(next);
  };

  const removePreview = (idx: number) => {
    const next = [...previews];
    const removed = next.splice(idx, 1)[0];
    if (removed) URL.revokeObjectURL(removed.url);
    setPreviews(next);
  };

  const resetForm = () => {
    setText("");
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
  };

  const handlePost = async () => {
    const hasText = text.trim().length > 0;
    const hasMedia = previews.length > 0;

    if (!hasText && !hasMedia) {
      toast.error("Bài viết phải có chữ hoặc media.");
      return;
    }

    try {
      setSubmitting(true);
      await createPostApi({ bodyText: text.trim() || undefined });
      resetForm();
      onOpenChange(false);
      toast.success("Đã đăng bài thành công ✨");
      onSuccess?.();
    } catch {
      toast.error("Đăng bài thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !submitting) resetForm();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-lg p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white">
            Create Post
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new post on Lumina Social
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-4">
          {/* Avatar + Input */}
          <div className="flex items-start gap-3">
            <Avatar size="lg" className="ring-1 ring-white/10 shrink-0">
              <AvatarImage src={avatarUrl} alt="Your avatar" />
              <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-1">
              <p className="text-sm font-semibold text-zinc-200">
                {user?.displayName || "Anonymous"}
              </p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={submitting}
                placeholder={`What's on your mind, ${firstName}?`}
                rows={4}
                className="mt-2 w-full resize-none bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none scrollbar-none"
              />
            </div>
          </div>

          {/* Preview media */}
          {previews.length > 0 && (
            <div
              className={cn(
                "grid gap-2",
                previews.length === 1 && "grid-cols-1",
                previews.length === 2 && "grid-cols-2",
                previews.length >= 3 && "grid-cols-2 sm:grid-cols-3"
              )}
            >
              {previews.map((p, idx) => (
                <div
                  key={p.url}
                  className="relative group/preview aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40"
                >
                  {p.type === "image" ? (
                    <img
                      src={p.url}
                      alt={`preview-${idx}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={p.url}
                      className="h-full w-full object-cover"
                      controls
                      muted
                    />
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-xs"
                    onClick={() => removePreview(idx)}
                    disabled={submitting}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/70 hover:bg-black/90 text-white border-0"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-white/5" />

        {/* Footer: actions + Post button */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-1">
            <PostAction
              label="Media"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              icon={<Image className="h-3 w-3 text-white" strokeWidth={2.5} />}
              iconClassName="bg-linear-to-br from-cyber-purple to-electric-blue"
            />
            <PostAction
              label="Live"
              onClick={() => videoInputRef.current?.click()}
              disabled={submitting}
              icon={<Video className="h-3 w-3 text-white" strokeWidth={2.5} />}
              iconClassName="bg-linear-to-br from-neon-pink to-orange-400"
            />
            <PostAction
              label="Feeling"
              onClick={() => setText((t) => (t ? `${t} 😊` : "😊 "))}
              disabled={submitting}
              icon={
                <Smile className="h-3 w-3 text-zinc-900" strokeWidth={2.5} />
              }
              iconClassName="bg-linear-to-br from-amber-400 to-yellow-500"
            />
          </div>
          <Button
            onClick={handlePost}
            disabled={submitting}
            className="btn-lumina rounded-full bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple px-6 h-9 text-sm font-bold text-white shadow-lg cursor-pointer hover:opacity-90"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files, "image");
            e.target.value = "";
          }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files, "video");
            e.target.value = "";
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

/* ────────────────────────────────────────────── */
/* PostAction button helper                        */
/* ────────────────────────────────────────────── */

interface PostActionProps {
  label: string;
  icon: React.ReactNode;
  iconClassName: string;
  onClick: () => void;
  disabled?: boolean;
}

function PostAction({
  label,
  icon,
  iconClassName,
  onClick,
  disabled,
}: PostActionProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className="h-9 gap-2 rounded-lg px-3 text-zinc-300 hover:bg-white/5 hover:text-zinc-200"
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-md",
          iconClassName
        )}
      >
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}
