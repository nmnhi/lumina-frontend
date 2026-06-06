import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deletePostApi } from "@/features/home/api/post";

interface DeletePostConfirmDialogProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (deletedId: string) => void;
}

export default function DeletePostConfirmDialog({
  postId,
  open,
  onOpenChange,
  onSuccess,
}: DeletePostConfirmDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await deletePostApi(postId);
      toast.success("Đã xóa bài viết.");
      onOpenChange(false);
      onSuccess?.(postId);
    } catch {
      toast.error("Xóa bài viết thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-sm p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-400" />
            Delete Post
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/5 bg-transparent">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
            className="rounded-full px-6 h-9 text-sm font-bold cursor-pointer"
          >
            {submitting && (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            )}
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
