import { Bell } from "lucide-react";
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
import MiniSpinner from "@/components/shared/MiniSpinner";
import { Separator } from "@/components/ui/separator";
import { Switch } from "./Switch";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationState {
  push: boolean;
  email: boolean;
  inApp: boolean;
  likes: boolean;
  comments: boolean;
  mentions: boolean;
  follows: boolean;
  messages: boolean;
  stories: boolean;
  marketing: boolean;
}

const initialState: NotificationState = {
  push: true,
  email: false,
  inApp: true,
  likes: true,
  comments: true,
  mentions: true,
  follows: true,
  messages: true,
  stories: false,
  marketing: false,
};

export default function NotificationsDialog({
  open,
  onOpenChange,
}: NotificationsDialogProps) {
  const [state, setState] = useState<NotificationState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof NotificationState>(
    key: K,
    value: NotificationState[K]
  ) => setState((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Đã cập nhật thông báo 🔔");
      onOpenChange(false);
    } catch {
      toast.error("Cập nhật thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-lg p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-electric-blue" />
            Notifications
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Choose what you want to be notified about and how.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto scrollbar-none">
          <Group title="Channels">
            <Row
              title="Push notifications"
              description="Receive notifications on this device."
              checked={state.push}
              onChange={(v) => set("push", v)}
            />
            <Row
              title="Email notifications"
              description="Get a daily digest via email."
              checked={state.email}
              onChange={(v) => set("email", v)}
            />
            <Row
              title="In-app notifications"
              description="Show badges and banners inside the app."
              checked={state.inApp}
              onChange={(v) => set("inApp", v)}
            />
          </Group>

          <Group title="Activity">
            <Row
              title="Likes"
              description="When someone likes your post."
              checked={state.likes}
              onChange={(v) => set("likes", v)}
            />
            <Row
              title="Comments"
              description="When someone comments on your post."
              checked={state.comments}
              onChange={(v) => set("comments", v)}
            />
            <Row
              title="Mentions"
              description="When someone @mentions you."
              checked={state.mentions}
              onChange={(v) => set("mentions", v)}
            />
            <Row
              title="New followers"
              description="When someone starts following you."
              checked={state.follows}
              onChange={(v) => set("follows", v)}
            />
            <Row
              title="Messages"
              description="When you receive a new message."
              checked={state.messages}
              onChange={(v) => set("messages", v)}
            />
            <Row
              title="Stories"
              description="When someone you follow posts a story."
              checked={state.stories}
              onChange={(v) => set("stories", v)}
            />
            <Row
              title="Product updates"
              description="Occasional news about new features."
              checked={state.marketing}
              onChange={(v) => set("marketing", v)}
            />
          </Group>
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
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface GroupProps {
  title: string;
  children: React.ReactNode;
}

function Group({ title, children }: GroupProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {title}
      </p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface RowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Row({ title, description, checked, onChange }: RowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-200">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} ariaLabel={title} />
    </div>
  );
}
