import api from "@/services/api";
import type { Post } from "@/types";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface TrendingHashtag {
  id: string;
  name: string;
  _count: {
    posts: number;
  };
}

export interface HashtagPostsResult {
  posts: Post[];
  nextCursor?: string;
}

export const getTrendingHashtagsApi = async () => {
  const response = await api.get<ApiResponse<TrendingHashtag[]>>("/hashtags/trending");
  return response.data;
};

export const getPostsByHashtagApi = async (name: string, cursor?: string) => {
  const params: Record<string, string> = {};
  if (cursor) params.cursor = cursor;
  const query = new URLSearchParams(params).toString();
  const encodedName = encodeURIComponent(name);
  const response = await api.get<ApiResponse<HashtagPostsResult>>(
    `/hashtags/${encodedName}/posts${query ? `?${query}` : ""}`
  );
  return response.data;
};
