import api from "@/services/api";
import type { Post } from "@/types";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface BookmarksResult {
  posts: Post[];
  nextCursor?: string;
}

export const toggleBookmarkApi = async (postId: string) => {
  const response = await api.post<ApiResponse<{ isBookmarked: boolean }>>(
    `/bookmarks/toggle/${postId}`
  );
  return response.data;
};

export const getBookmarksApi = async (cursor?: string) => {
  const params: Record<string, string> = {};
  if (cursor) params.cursor = cursor;
  const query = new URLSearchParams(params).toString();
  const response = await api.get<ApiResponse<BookmarksResult>>(
    `/bookmarks${query ? `?${query}` : ""}`
  );
  return response.data;
};
