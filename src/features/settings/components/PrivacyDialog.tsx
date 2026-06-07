import { Shield } from "lucide-react";
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

interface PrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PrivacyState {
  privateAccount: boolean;
  showActivityStatus: boolean;
  allowMentions: "everyone" | "followers" | "none";
  allowMessages: "everyone" | "followers" | "none";
  allowStoryReplies: boolean;
  hideLikes: boolean;
}

const initialState: PrivacyState = {
  privateAccount: false,
  showActivityStatus: true,
  allowMentions: "everyone",
  allowMessages: "followers",
  allowStoryReplies: true,
  hideLikes: false,
};

export default function PrivacyDialog({ open, onOpenChange }: PrivacyDialogProps) {
  const [state, setState] = useState<PrivacyState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof PrivacyState>(key: K, value: PrivacyState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Đã cập nhật quyền riêng tư 🔒");
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
            <Shield className="h-4 w-4 text-electric-blue" />
            Privacy &amp; Safety
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Control who can see your content and interact with you.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto scrollbar-none">
          <ToggleRow
            title="Private account"
            description="Only approved followers can see your posts and stories."
            checked={state.privateAccount}
            onChange={(v) => set("privateAccount", v)}
          />

          <ToggleRow
            title="Show activity status"
            description="Let others see when you were last active."
            checked={state.showActivityStatus}
            onChange={(v) => set("showActivityStatus", v)}
          />

          <ToggleRow
            title="Hide like counts"
            description="Don't show the number of likes on your posts."
            checked={state.hideLikes}
            onChange={(v) => set("hideLikes", v)}
          />

          <ToggleRow
            title="Allow story replies"
            description="Let followers reply to your stories."
            checked={state.allowStoryReplies}
            onChange={(v) => set("allowStoryReplies", v)}
          />

          <SelectRow
            title="Who can mention you"
            value={state.allowMentions}
            onChange={(v) => set("allowMentions", v as PrivacyState["allowMentions"])}
            options={[
              { value: "everyone", label: "Everyone" },
              { value: "followers", label: "Followers only" },
              { value: "none", label: "No one" },
            ]}
          />

          <SelectRow
            title="Who can message you"
            value={state.allowMessages}
            onChange={(v) => set("allowMessages", v as PrivacyState["allowMessages"])}
            options={[
              { value: "everyone", label: "Everyone" },
              { value: "followers", label: "Followers only" },
              { value: "none", label: "No one" },
            ]}
          />
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

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ title, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-200">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} ariaLabel={title} />
    </div>
  );
}

interface SelectRowProps {
  title: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

function SelectRow({ title, value, onChange, options }: SelectRowProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-zinc-200">{title}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            variant="outline"
            onClick={() => onChange(opt.value)}
            className={`h-9 rounded-lg border-white/10 text-xs font-medium ${
              value === opt.value
                ? "bg-electric-blue/20 text-white border-electric-blue/40"
                : "bg-white/3 text-zinc-300 hover:bg-white/5"
            }`}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
