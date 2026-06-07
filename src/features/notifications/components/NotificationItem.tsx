import { Link } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Share2, AtSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils";
import type { NotificationItem as NotifItem } from "../api/notifications";

interface NotificationRowProps {
  notif: NotifItem;
}

const TYPE_META: Record<
  NotifItem["type"],
  { icon: React.ReactNode; label: (name: string) => string; color: string }
> = {
  LIKE: {
    icon: <Heart className="h-3.5 w-3.5" fill="currentColor" />,
    label: (n) => `${n} đã thích bài viết của bạn`,
    color: "text-neon-pink",
  },
  COMMENT: {
    icon: <MessageCircle className="h-3.5 w-3.5" fill="currentColor" />,
    label: (n) => `${n} đã bình luận bài viết của bạn`,
    color: "text-electric-blue",
  },
  FOLLOW: {
    icon: <UserPlus className="h-3.5 w-3.5" />,
    label: (n) => `${n} đã bắt đầu theo dõi bạn`,
    color: "text-cyber-purple",
  },
  SHARE: {
    icon: <Share2 className="h-3.5 w-3.5" />,
    label: (n) => `${n} đã chia sẻ bài viết của bạn`,
    color: "text-emerald-400",
  },
  MENTION: {
    icon: <AtSign className="h-3.5 w-3.5" />,
    label: (n) => `${n} đã nhắc đến bạn`,
    color: "text-amber-400",
  },
};

export default function NotificationItem({ notif }: NotificationRowProps) {
  const meta = TYPE_META[notif.type] ?? TYPE_META.LIKE;

  return (
    <Link
      to={
        notif.type === "FOLLOW"
          ? `/profile/${encodeURIComponent(notif.sender.username)}`
          : `/profile/${encodeURIComponent(notif.sender.username)}`
      }
      className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
        notif.read ? "hover:bg-white/3" : "bg-electric-blue/5 hover:bg-electric-blue/10"
      }`}
    >
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={notif.sender.avatarUrl || undefined}
            alt={notif.sender.displayName}
          />
          <AvatarFallback className="bg-linear-to-br from-cyber-purple to-electric-blue text-white text-[10px] font-bold">
            {notif.sender.displayName
              .split(" ")
              .map((n) => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#09090b] ring-2 ring-[#09090b] ${meta.color}`}
        >
          {meta.icon}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-200">
          <span className="font-bold">{notif.sender.displayName}</span>{" "}
          <span className="text-zinc-400">
            {meta.label(notif.sender.displayName)}
          </span>
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">
          {timeAgo(notif.createdAt)}
        </p>
      </div>

      {!notif.read && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-electric-blue shadow-[0_0_8px_rgba(0,210,255,0.6)]" />
      )}
    </Link>
  );
}
