import api from "@/services/api";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface NotificationItem {
  id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW" | "SHARE";
  senderId: string;
  receiverId: string;
  postId?: string | null;
  commentId?: string | null;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

interface NotificationsResponse {
  notifications: NotificationItem[];
  nextCursor?: string;
}

export const getNotificationsApi = async (cursor?: string) => {
  const params: Record<string, string> = {};
  if (cursor) params.cursor = cursor;
  const query = new URLSearchParams(params).toString();
  const response = await api.get<ApiResponse<NotificationsResponse>>(`/notifications${query ? `?${query}` : ""}`);
  return response.data;
};

export const getUnreadCountApi = async () => {
  const response = await api.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
  return response.data;
};

export const markAsReadApi = async (id: string) => {
  const response = await api.patch<ApiResponse<null>>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsReadApi = async () => {
  const response = await api.patch<ApiResponse<null>>("/notifications/read-all");
  return response.data;
};
