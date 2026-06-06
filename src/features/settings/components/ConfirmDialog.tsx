import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  onConfirm: () => Promise<void> | void;
}

/** Reusable confirm dialog — used for Sign Out, Delete Account, etc. */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  icon,
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-sm p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-6 pt-5 pb-4">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="-mx-4 -mb-4 mt-0 flex flex-row items-center justify-end gap-2 rounded-b-xl border-t border-white/5 bg-white/2 px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-9 px-4 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-100"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "h-9 min-w-24 rounded-full px-5 text-sm font-bold text-white shadow-sm cursor-pointer transition",
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600"
                : "btn-lumina bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple hover:opacity-90"
            )}
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
            {loading ? "Working..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
