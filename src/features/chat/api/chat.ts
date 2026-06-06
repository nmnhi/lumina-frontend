import api from "@/services/api";
import type { Conversation, Message } from "@/types";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

/** Get all conversations for current user */
export const getConversationsApi = async () => {
  const response = await api.get<ApiResponse<Conversation[]>>("/chats/conversations");
  return response.data;
};

/** Get or create a conversation with a target user */
export const getOrCreateConversationApi = async (targetUserId: string) => {
  const response = await api.post<ApiResponse<Conversation>>("/chats/conversations", { targetUserId });
  return response.data;
};

/** Send a text message */
export const sendMessageApi = async (conversationId: string, content: string) => {
  const response = await api.post<ApiResponse<Message>>(`/chats/conversations/${conversationId}/messages`, { content });
  return response.data;
};

/** Get messages with cursor pagination (scroll up) */
export const getMessagesApi = async (conversationId: string, cursor?: string) => {
  const params: Record<string, string> = { limit: "20" };
  if (cursor) params.cursor = cursor;
  const query = new URLSearchParams(params).toString();
  const response = await api.get<ApiResponse<{ messages: Message[]; nextCursor?: string }>>(`/chats/conversations/${conversationId}/messages?${query}`);
  return response.data;
};

/** Mark messages as seen */
export const markAsSeenApi = async (conversationId: string) => {
  const response = await api.post<ApiResponse<null>>(`/chats/conversations/${conversationId}/seen`);
  return response.data;
};
