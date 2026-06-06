import {
  AlertTriangle,
  AtSign,
  Bell,
  ChevronRight,
  Database,
  FileText,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Mail,
  Palette,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/useAuth";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import EditProfileDialog from "../components/EditProfileDialog";
import AppearanceDialog from "../components/AppearanceDialog";
import NotificationsDialog from "../components/NotificationsDialog";
import PrivacyDialog from "../components/PrivacyDialog";
import StorageDialog from "../components/StorageDialog";
import { cn } from "@/lib/utils";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dialog state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const avatarUrl = user?.avatarUrl || FALLBACK_AVATAR;
  const initials = (user?.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    // TODO: thay bằng deleteAccountApi khi backend sẵn sàng
    toast.error("Tính năng xoá tài khoản chưa khả dụng.");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* ─── HEADER ─── */}
      <header className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Settings
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your account, privacy, and preferences.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setSignOutOpen(true)}
          className="border-white/10 bg-white/3 text-zinc-300 hover:bg-white/5 hover:text-zinc-100"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </header>

      {/* ─── PROFILE SUMMARY CARD ─── */}
      <section className="glass-mac rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-white/10 shrink-0">
          <AvatarImage src={avatarUrl} alt={user?.displayName ?? "avatar"} />
          <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-zinc-100 truncate">
            {user?.displayName ?? "Anonymous"}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">
            @{user?.username ?? "no-username"} · {user?.email ?? "no-email"}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditProfileOpen(true)}
          className="border-white/10 bg-white/3 text-zinc-200 hover:bg-white/5 shrink-0"
        >
          <User className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
      </section>

      {/* ─── ACCOUNT ─── */}
      <Section title="Account" subtitle="Personal info, security, sign-in">
        <SettingRow
          icon={User}
          iconClassName="from-electric-blue to-cyber-purple"
          title="Edit Profile"
          description="Update your name, username, bio, and avatar."
          onClick={() => setEditProfileOpen(true)}
        />
        <SettingRow
          icon={Lock}
          iconClassName="from-neon-pink to-orange-400"
          title="Change Password"
          description="Update the password you use to sign in."
          onClick={() => setChangePasswordOpen(true)}
        />
        <SettingRow
          icon={Mail}
          iconClassName="from-cyber-purple to-electric-blue"
          title="Email"
          description={user?.email ?? "—"}
          onClick={() => setEditProfileOpen(true)}
        />
        <SettingRow
          icon={AtSign}
          iconClassName="from-electric-blue to-neon-pink"
          title="Username"
          description={user?.username ?? "—"}
          onClick={() => setEditProfileOpen(true)}
        />
      </Section>

      {/* ─── PRIVACY & SAFETY ─── */}
      <Section
        title="Privacy & Safety"
        subtitle="Control who can see and interact with you"
      >
        <SettingRow
          icon={Shield}
          iconClassName="from-electric-blue to-cyber-purple"
          title="Privacy"
          description="Private account, mentions, messages, activity status."
          onClick={() => setPrivacyOpen(true)}
        />
        <SettingRow
          icon={Trash2}
          iconClassName="from-neon-pink to-orange-400"
          title="Blocked Users"
          description="Manage the people you've blocked."
          onClick={() => setPrivacyOpen(true)}
        />
      </Section>

      {/* ─── NOTIFICATIONS ─── */}
      <Section
        title="Notifications"
        subtitle="Channels and activity you want to hear about"
      >
        <SettingRow
          icon={Bell}
          iconClassName="from-electric-blue to-cyber-purple"
          title="Notification Settings"
          description="Push, email, in-app, likes, comments, mentions…"
          onClick={() => setNotificationsOpen(true)}
        />
      </Section>

      {/* ─── APPEARANCE ─── */}
      <Section
        title="Appearance"
        subtitle="Theme, language, and display density"
      >
        <SettingRow
          icon={Palette}
          iconClassName="from-electric-blue to-cyber-purple"
          title="Theme & Language"
          description="Switch between dark and light, choose your language."
          onClick={() => setAppearanceOpen(true)}
        />
      </Section>

      {/* ─── STORAGE & DATA ─── */}
      <Section
        title="Storage & Data"
        subtitle="Manage what's stored on this device"
      >
        <SettingRow
          icon={Database}
          iconClassName="from-electric-blue to-cyber-purple"
          title="Storage Usage"
          description="342 MB used · Clear cache or download your data."
          onClick={() => setStorageOpen(true)}
        />
      </Section>

      {/* ─── SUPPORT ─── */}
      <Section title="Support" subtitle="Help, info, and legal">
        <SettingRow
          icon={HelpCircle}
          iconClassName="from-electric-blue to-cyber-purple"
          title="Help Center"
          description="Find answers in our FAQ and support articles."
          onClick={() => toast.info("Help Center is coming soon.")}
        />
        <SettingRow
          icon={Info}
          iconClassName="from-neon-pink to-orange-400"
          title="About"
          description="Lumina Social · v1.0.0 · © 2026 Lumina Inc."
          onClick={() => toast.info("Lumina Social v1.0.0")}
        />
        <SettingRow
          icon={FileText}
          iconClassName="from-cyber-purple to-electric-blue"
          title="Privacy Policy"
          description="Read how we handle your data."
          onClick={() => toast.info("Privacy Policy is coming soon.")}
        />
      </Section>

      {/* ─── DANGER ZONE ─── */}
      <Section
        title="Danger Zone"
        subtitle="Irreversible actions — please be careful"
        danger
      >
        <SettingRow
          icon={AlertTriangle}
          iconClassName="from-red-500 to-rose-500"
          title="Delete Account"
          description="Permanently delete your account and all data."
          onClick={() => setDeleteOpen(true)}
          danger
        />
      </Section>

      {/* ─── FOOTER ─── */}
      <footer className="text-center pt-2">
        <p className="text-[11px] text-zinc-700">
          Lumina Social · v1.0.0 · © 2026
        </p>
      </footer>

      {/* ─── DIALOGS ─── */}
      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
      />
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <NotificationsDialog
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
      <AppearanceDialog
        open={appearanceOpen}
        onOpenChange={setAppearanceOpen}
      />
      <StorageDialog open={storageOpen} onOpenChange={setStorageOpen} />

      <ConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        icon={<LogOut className="h-4 w-4 text-zinc-400" />}
        onConfirm={handleSignOut}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Account"
        description="This will permanently delete your account, posts, and all data. This action cannot be undone."
        confirmText="Delete Account"
        variant="destructive"
        icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Section wrapper                                              */
/* ──────────────────────────────────────────────────────────── */

interface SectionProps {
  title: string;
  subtitle?: string;
  danger?: boolean;
  children: React.ReactNode;
}

function Section({ title, subtitle, danger, children }: SectionProps) {
  return (
    <section className="glass-mac rounded-2xl overflow-hidden">
      <header className="px-5 pt-5 pb-3">
        <h2
          className={cn(
            "text-xs font-bold uppercase tracking-widest",
            danger ? "text-red-400" : "text-zinc-400"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-zinc-600 mt-1">{subtitle}</p>
        )}
      </header>

      <Separator className="bg-white/5" />

      <div className="divide-y divide-white/5">{children}</div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Setting row                                                  */
/* ──────────────────────────────────────────────────────────── */

interface SettingRowProps {
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  title: string;
  description: string;
  onClick: () => void;
  danger?: boolean;
}

function SettingRow({
  icon: Icon,
  iconClassName,
  title,
  description,
  onClick,
  danger,
}: SettingRowProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="w-full h-auto justify-start gap-4 rounded-none px-5 py-4 text-left text-zinc-300 hover:bg-white/3 hover:text-zinc-100"
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br shadow-inner shrink-0",
          iconClassName
        )}
      >
        <Icon className="h-4 w-4 text-white" />
      </span>
      <div className="flex-1 min-w-0 text-left">
        <p
          className={cn(
            "text-sm font-semibold",
            danger ? "text-red-300" : "text-zinc-200"
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "text-xs mt-0.5 truncate",
            danger ? "text-red-400/60" : "text-zinc-500"
          )}
        >
          {description}
        </p>
      </div>
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0",
          danger ? "text-red-500/60" : "text-zinc-600"
        )}
      />
    </Button>
  );
}
