import { Image, Plus, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { Separator } from "@/components/ui/separator";
import { createStoryApi } from "@/features/home/api/stories";

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface StoryPreview {
  url: string;
  type: "image" | "video";
  file: File;
}

export default function CreateStoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateStoryDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<StoryPreview | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Story chỉ hỗ trợ ảnh hoặc video.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview.url);
    setPreview({
      url: URL.createObjectURL(file),
      type: isVideo ? "video" : "image",
      file,
    });
  };

  const handleCreate = async () => {
    if (!preview) {
      toast.error("Vui lòng chọn ảnh hoặc video cho story.");
      return;
    }

    try {
      setSubmitting(true);
      await createStoryApi(preview.file);
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Tạo story thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !submitting) resetForm();
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="relative glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-md p-0 gap-0 ring-1 ring-white/10">
        {submitting && <LoadingOverlay message="Đang tạo story..." />}
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white">
            Create Story
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Share a photo or video story with your friends.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-4">
          <div className="relative mx-auto aspect-9/16 max-h-[520px] w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            {preview ? (
              <>
                {preview.type === "image" ? (
                  <img
                    src={preview.url}
                    alt="Story preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={preview.url}
                    className="h-full w-full object-cover"
                    controls
                    muted
                  />
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  onClick={resetForm}
                  disabled={submitting}
                  className="absolute right-3 top-3 h-8 w-8 rounded-full border-0 bg-black/70 text-white hover:bg-black/90"
                  aria-label="Remove selected story media"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-none text-zinc-500 transition hover:bg-transparent hover:text-zinc-300"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-zinc-600 bg-zinc-900/70">
                  <Plus className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold">Add story media</span>
                <span className="text-xs text-zinc-600">Image or video</span>
              </Button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              className="h-9 gap-2 rounded-lg px-3 text-zinc-300 hover:bg-white/5 hover:text-zinc-200"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-linear-to-br from-cyber-purple to-electric-blue">
                <Image className="h-3 w-3 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-xs font-medium">Photo</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              className="h-9 gap-2 rounded-lg px-3 text-zinc-300 hover:bg-white/5 hover:text-zinc-200"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-linear-to-br from-neon-pink to-orange-400">
                <Video className="h-3 w-3 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-xs font-medium">Video</span>
            </Button>
          </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="flex items-center justify-end gap-3 px-5 py-4">
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={submitting}
            className="text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={submitting || !preview}
            className="btn-lumina rounded-full bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple px-6 h-9 text-sm font-bold text-white shadow-lg cursor-pointer hover:opacity-90"
          >
            Create Story
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          hidden
          onChange={(e) => {
            handleFileChange(e.target.files);
            e.target.value = "";
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
