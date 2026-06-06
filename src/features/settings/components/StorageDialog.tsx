import { Database, Download, HardDrive, Image, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface StorageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StorageItem {
  label: string;
  icon: typeof Image;
  size: string;
  color: string;
}

const storageItems: StorageItem[] = [
  { label: "Photos & videos", icon: Image, size: "248 MB", color: "from-electric-blue to-cyber-purple" },
  { label: "Cache & previews", icon: Database, size: "82 MB", color: "from-neon-pink to-orange-400" },
  { label: "Other app data", icon: HardDrive, size: "12 MB", color: "from-amber-400 to-yellow-500" },
];

const totalSize = "342 MB";
const totalLimit = "2 GB";
const usagePercent = Math.round((342 / 2048) * 100);

export default function StorageDialog({ open, onOpenChange }: StorageDialogProps) {
  const [clearing, setClearing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleClearCache = async () => {
    try {
      setClearing(true);
      await new Promise((r) => setTimeout(r, 900));
      toast.success("Đã xoá cache 🧹");
    } catch {
      toast.error("Xoá cache thất bại.");
    } finally {
      setClearing(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Đã gửi liên kết tải dữ liệu qua email 📦");
    } catch {
      toast.error("Tải dữ liệu thất bại.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-lg p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-electric-blue" />
            Storage &amp; Data
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Manage what's stored on this device.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-5">
          {/* Usage bar */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{totalSize}</p>
                <p className="text-xs text-zinc-500 mt-0.5">of {totalLimit} used</p>
              </div>
              <span className="text-xs font-semibold text-electric-blue">
                {usagePercent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            {storageItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 p-3"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br ${item.color}`}
                >
                  <item.icon className="h-4 w-4 text-white" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200">
                    {item.label}
                  </p>
                </div>
                <span className="text-sm font-bold text-zinc-300">
                  {item.size}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={clearing || downloading}
              className="h-10 justify-center rounded-xl border-white/10 bg-white/3 text-zinc-200 hover:bg-white/5"
            >
              {clearing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {clearing ? "Clearing..." : "Clear Cache"}
            </Button>

            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={downloading || clearing}
              className="h-10 justify-center rounded-xl border-white/10 bg-white/3 text-zinc-200 hover:bg-white/5"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {downloading ? "Requesting..." : "Download My Data"}
            </Button>
          </div>

          <p className="text-[11px] text-zinc-600 leading-relaxed text-center">
            Clearing cache will not delete your posts or account data.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
