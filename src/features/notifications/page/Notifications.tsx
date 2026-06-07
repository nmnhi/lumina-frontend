import { useCallback, useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NotificationItem from "../components/NotificationItem";
import {
  getNotificationsApi,
  markAllAsReadApi,
  type NotificationItem as NotifItem,
} from "../api/notifications";

export default function Notifications() {
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotificationsApi();
      setNotifs(res.data.notifications ?? []);
    } catch {
      toast.error("Không thể tải thông báo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllAsReadApi();
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      toast.error("Không thể đánh dấu đã đọc.");
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="glass-mac flex items-center justify-between gap-3 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-electric-blue/30 to-cyber-purple/30">
            <Bell className="h-5 w-5 text-electric-blue" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Thông báo</h1>
            <p className="text-xs text-zinc-500">
              {unreadCount > 0
                ? `${unreadCount} chưa đọc`
                : "Bạn đã xem tất cả thông báo"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAll}
            disabled={markingAll}
            variant="ghost"
            size="sm"
            className="text-xs text-zinc-300 hover:bg-white/5"
          >
            <Check className="mr-1 h-3.5 w-3.5" />
            Đánh dấu đã đọc
          </Button>
        )}
      </div>

      <div className="glass-mac rounded-2xl p-2">
        {loading ? (
          <div className="space-y-1 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl p-3"
              >
                <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
                  <div className="h-2 w-1/3 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : notifs.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-500">
            Chưa có thông báo nào.
          </p>
        ) : (
          <div className="space-y-1">
            {notifs.map((n) => (
              <NotificationItem key={n.id} notif={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
