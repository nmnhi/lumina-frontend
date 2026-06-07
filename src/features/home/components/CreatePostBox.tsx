import { Image, Smile, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import { usePostRefresh } from "@/features/home/context/PostRefreshContext";
import { createPostApi } from "@/features/home/api/post";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80";

const MAX_FILES = 4;
const MAX_CHARS = 2000;

interface PreviewItem {
  url: string;
  type: "image" | "video";
  file: File;
}

export default function CreatePostBox() {
  const { user } = useAuth();
  const { triggerRefresh } = usePostRefresh();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState("");
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [text]);

  const avatarUrl = user?.avatarUrl || FALLBACK_AVATAR;
  const firstName = (user?.displayName || "there").split(" ")[0];
  const initials = firstName.charAt(0).toUpperCase();
  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.9;

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
        file
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

  const handlePost = async () => {
    const hasText = text.trim().length > 0;
    const hasMedia = previews.length > 0;

    if (!hasText && !hasMedia) {
      toast.error("Bài viết phải có chữ hoặc media.");
      return;
    }
    if (isOverLimit) {
      toast.error(`Bài viết vượt quá ${MAX_CHARS} ký tự.`);
      return;
    }

    try {
      setSubmitting(true);

      // Build FormData for multipart upload
      const formData = new FormData();
      if (text.trim()) formData.append("bodyText", text.trim());
      previews.forEach((p) => formData.append("files", p.file));

      await createPostApi(formData);

      setText("");
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      triggerRefresh();
    } catch {
      toast.error("Đăng bài thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const canPost = !submitting && !isOverLimit && (text.trim().length > 0 || previews.length > 0);

  return (
    <div className="relative glass-mac rounded-2xl p-4 space-y-3">
      {submitting && <LoadingOverlay message="Đang đăng bài..." />}

      {/* Twitter-style compose: avatar ở trên trái, textarea bên cạnh */}
      <div className="flex items-start gap-3">
        <Avatar size="lg" className="ring-1 ring-white/10 shrink-0">
          <AvatarImage src={avatarUrl} alt="Your avatar" />
          <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            placeholder={`What's on your mind, ${firstName}?`}
            rows={3}
            className="w-full resize-none border-0 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none scrollbar-none leading-relaxed"
          />
          {/* Char counter */}
          {(isNearLimit || isOverLimit) && (
            <div className="mt-1 flex justify-end">
              <span
                className={cn(
                  "text-[10px] font-mono tabular-nums",
                  isOverLimit
                    ? "text-red-400 font-bold"
                    : isNearLimit
                      ? "text-amber-400"
                      : "text-zinc-500"
                )}
              >
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          )}
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
                <video src={p.url} className="h-full w-full object-cover" controls muted />
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

      <Separator className="bg-white/5" />

      {/* Hàng 2: actions + Post */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <PostAction
            label="Media"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            icon={<Image className="h-3 w-3 text-white" strokeWidth={2.5} />}
            iconClassName="bg-linear-to-br from-cyber-purple to-electric-blue"
          />
          <PostAction
            label="Video"
            onClick={() => videoInputRef.current?.click()}
            disabled={submitting}
            icon={<Video className="h-3 w-3 text-white" strokeWidth={2.5} />}
            iconClassName="bg-linear-to-br from-neon-pink to-orange-400"
          />
          <PostAction
            label="Feeling"
            onClick={() => setText((t) => (t ? `${t} 😊` : "😊 "))}
            disabled={submitting}
            icon={<Smile className="h-3 w-3 text-zinc-900" strokeWidth={2.5} />}
            iconClassName="bg-linear-to-br from-amber-400 to-yellow-500"
          />
        </div>
        <Button
          onClick={handlePost}
          disabled={!canPost}
          className="rounded-full bg-linear-to-r from-cyber-purple to-neon-pink px-6 h-9 text-sm font-bold text-white shadow-lg shadow-cyber-purple/30 hover:brightness-110 hover:shadow-cyber-purple/50 border-0 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </Button>
      </div>

      {/* Hidden inputs */}
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
    </div>
  );
}

interface PostActionProps {
  label: string;
  icon: React.ReactNode;
  iconClassName: string;
  onClick: () => void;
  disabled?: boolean;
}

function PostAction({ label, icon, iconClassName, onClick, disabled }: PostActionProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className="h-9 gap-2 rounded-lg px-3 text-zinc-300 hover:bg-white/5 hover:text-zinc-200"
    >
      <span className={cn("flex h-5 w-5 items-center justify-center rounded-md", iconClassName)}>
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}
