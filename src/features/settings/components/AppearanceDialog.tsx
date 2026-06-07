import { Palette } from "lucide-react";
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

interface AppearanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Theme = "dark" | "light" | "system";
type Language = "en" | "vi" | "ja" | "fr";
type Density = "comfortable" | "compact";

const themes: { value: Theme; label: string; description: string; preview: string }[] = [
  {
    value: "dark",
    label: "Dark",
    description: "Easy on the eyes, premium feel.",
    preview: "from-[#09090b] to-[#121214]",
  },
  {
    value: "light",
    label: "Light",
    description: "Bright and airy.",
    preview: "from-zinc-100 to-white",
  },
  {
    value: "system",
    label: "System",
    description: "Match your OS preference.",
    preview: "from-zinc-700 to-zinc-300",
  },
];

const languages: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
];

const densities: { value: Density; label: string; description: string }[] = [
  { value: "comfortable", label: "Comfortable", description: "More breathing room" },
  { value: "compact", label: "Compact", description: "See more on the screen" },
];

export default function AppearanceDialog({
  open,
  onOpenChange,
}: AppearanceDialogProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState<Language>("en");
  const [density, setDensity] = useState<Density>("comfortable");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Đã cập nhật giao diện 🎨");
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
            <Palette className="h-4 w-4 text-electric-blue" />
            Appearance
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Customize how Lumina looks and feels.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-none">
          {/* Theme */}
          <section className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTheme(t.value)}
                  className={`group rounded-xl border p-3 text-left transition ${
                    theme === t.value
                      ? "border-electric-blue/50 bg-electric-blue/10"
                      : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`h-12 w-full rounded-md bg-linear-to-br ${t.preview} ring-1 ring-white/10`}
                  />
                  <p className="mt-2 text-xs font-semibold text-zinc-200">
                    {t.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    {t.description}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Language */}
          <section className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Language
            </p>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((l) => (
                <Button
                  key={l.value}
                  type="button"
                  variant="outline"
                  onClick={() => setLanguage(l.value)}
                  className={`h-10 justify-start gap-2 rounded-lg border-white/10 text-sm ${
                    language === l.value
                      ? "bg-electric-blue/15 text-white border-electric-blue/40"
                      : "bg-white/3 text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                </Button>
              ))}
            </div>
          </section>

          {/* Density */}
          <section className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Density
            </p>
            <div className="grid grid-cols-2 gap-2">
              {densities.map((d) => (
                <Button
                  key={d.value}
                  type="button"
                  variant="outline"
                  onClick={() => setDensity(d.value)}
                  className={`h-auto flex-col items-start gap-0.5 rounded-lg border-white/10 py-2.5 ${
                    density === d.value
                      ? "bg-electric-blue/15 text-white border-electric-blue/40"
                      : "bg-white/3 text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm font-semibold">{d.label}</span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    {d.description}
                  </span>
                </Button>
              ))}
            </div>
          </section>
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
