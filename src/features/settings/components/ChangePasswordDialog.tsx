import { Eye, EyeOff, Lock } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import MiniSpinner from "@/components/shared/MiniSpinner";
import { Separator } from "@/components/ui/separator";
import { changePasswordApi } from "@/features/auth/api/auth";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      setSubmitting(true);
      await changePasswordApi({
        oldPassword: currentPassword,
        newPassword,
      });
      toast.success("Đã đổi mật khẩu thành công 🔒");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Đổi mật khẩu thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && !submitting) reset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-mac border-white/10 bg-[#09090b] text-zinc-100 sm:max-w-md p-0 gap-0 ring-1 ring-white/10">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-electric-blue" />
            Change Password
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Use a strong password to keep your account safe.
          </DialogDescription>
        </DialogHeader>

        <Separator className="bg-white/5" />

        <div className="p-5 space-y-4">
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showPassword}
            onToggle={() => setShowPassword((s) => !s)}
            disabled={submitting}
          />
          <PasswordField
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            show={showPassword}
            onToggle={() => setShowPassword((s) => !s)}
            disabled={submitting}
          />
          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showPassword}
            onToggle={() => setShowPassword((s) => !s)}
            disabled={submitting}
          />

          <p className="text-xs text-zinc-500 leading-relaxed">
            Password must be at least 6 characters. We recommend using a mix of
            letters, numbers and symbols.
          </p>
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
            onClick={handleSave}
            disabled={submitting}
            className="btn-lumina rounded-full bg-linear-to-r from-electric-blue via-neon-pink to-cyber-purple px-6 h-9 text-sm font-bold text-white shadow-lg cursor-pointer hover:opacity-90"
          >
            {submitting && <MiniSpinner size={14} />}
            {submitting ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  disabled,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold tracking-wide text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="••••••••"
          className="h-auto rounded-xl bg-white/3 border-white/10 py-2.5 pl-3 pr-10 text-sm text-zinc-100 placeholder-zinc-600 dark:bg-transparent"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-1 top-1/2 -translate-y-1/2 size-auto p-2 text-zinc-500 hover:text-zinc-300 hover:bg-transparent"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
