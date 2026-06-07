import {
  Camera,
  Image as ImageIcon,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MiniSpinner from "@/components/shared/MiniSpinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import { updateProfileApi } from "@/features/profile/api/user";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function EditProfileDialog({
  open,
  onOpenChange,
  onSuccess,
}: EditProfileDialogProps) {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setDisplayName(user?.displayName ?? "");
      setUsername(user?.username ?? "");
      setBio(user?.bio ?? "");
      setAvatarUrl(user?.avatarUrl ?? "");
      setDragOver(false);
    }
  }, [open, user]);

  const initials = (displayName || user?.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const hasCustomAvatar = !!avatarUrl;

  /** Read a File into a base64 data URL and apply it */
  const applyFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc GIF.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Ảnh không được vượt quá 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === "string") {
        setAvatarUrl(dataUrl);
        toast.success("Đã chọn ảnh mới.");
      }
    };
    reader.onerror = () => toast.error("Không thể đọc file ảnh.");
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
    // Reset input so picking the same file again still fires onChange
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeAvatar = () => {
    setAvatarUrl("");
  };

  const handleSave = async () => {
    if (!displayName.trim() || !username.trim()) {
      toast.error("Tên và username không được để trống.");
      return;
    }
    try {
      setSubmitting(true);
      await updateProfileApi({
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim() || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      toast.success("Đã cập nhật hồ sơ ✨");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-lg p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-electric-blue" />
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Update your public profile information.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-4">
          {/* ─── Avatar picker ─── */}
          <div className="flex items-center gap-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "group relative h-20 w-20 shrink-0 cursor-pointer rounded-full ring-2 ring-white/10 transition focus-visible:outline-none focus-visible:ring-electric-blue/50",
                dragOver && "ring-electric-blue scale-105"
              )}
              aria-label="Upload avatar"
            >
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={avatarUrl || FALLBACK_AVATAR}
                  alt="avatar preview"
                />
                <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-lg font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Hover / drag overlay */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-white transition",
                  dragOver
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
              >
                <Camera className="h-5 w-5" />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Profile picture
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Click the avatar or drag an image here.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting}
                  className="h-8 border-white/10 bg-white/3 text-xs text-zinc-200 hover:bg-white/5"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload from device
                </Button>
                {hasCustomAvatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                    disabled={submitting}
                    className="h-8 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-600 -mt-1">
            JPG, PNG, WEBP or GIF · max 5 MB.
          </p>

          {/* ─── Form fields ─── */}
          <Field label="Display name">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              disabled={submitting}
              className="h-auto rounded-xl bg-white/3 border-white/10 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 dark:bg-transparent"
            />
          </Field>

          <Field label="Username">
            <Input
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()
                )
              }
              placeholder="username"
              disabled={submitting}
              className="h-auto rounded-xl bg-white/3 border-white/10 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 dark:bg-transparent"
            />
          </Field>

          <Field label="Email" hint="Read-only">
            <Input
              value={user?.email ?? ""}
              readOnly
              disabled
              className="h-auto rounded-xl bg-white/3 border-white/10 py-2.5 text-sm text-zinc-500 dark:bg-transparent"
            />
          </Field>

          <Field label="Bio">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              disabled={submitting}
              className="w-full resize-none rounded-xl bg-white/3 border border-white/10 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-white/20 focus:bg-white/6 scrollbar-none"
            />
          </Field>
        </div>

        <Separator className="bg-white/5" />

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
            disabled={submitting}
            className="btn-lumina rounded-full bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple px-6 h-9 text-sm font-bold text-white shadow-lg cursor-pointer hover:opacity-90"
          >
            {submitting && <MiniSpinner size={14} />}
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          hidden
          onChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wide text-zinc-300">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] text-zinc-600 uppercase">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}
