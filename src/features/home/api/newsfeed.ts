import api from "@/services/api";
import type { Post } from "@/types";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface NewsfeedResult {
  posts: Post[];
  nextCursor?: string;
}

export type FeedType = "forYou" | "following";

export const getNewsfeedApi = async (
  cursor?: string,
  type: FeedType = "forYou"
) => {
  const params: Record<string, string> = { type };
  if (cursor) params.cursor = cursor;
  const query = new URLSearchParams(params).toString();
  const response = await api.get<ApiResponse<NewsfeedResult>>(
    `/newsfeed${query ? `?${query}` : ""}`
  );
  return response.data;
};
