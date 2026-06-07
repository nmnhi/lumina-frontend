import api from "@/services/api";
import type { Post, User } from "@/types";

export type SearchType = "all" | "posts" | "users" | "hashtags";

export interface SearchResultHashtag {
  id: string;
  name: string;
  _count?: { posts: number };
}

export interface SearchResultUser
  extends Pick<User, "id" | "username" | "displayName" | "avatarUrl" | "bio"> {}

export interface SearchResult {
  posts: Post[];
  users: SearchResultUser[];
  hashtags: SearchResultHashtag[];
}

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export const searchApi = async (
  query: string,
  type: SearchType = "all"
) => {
  const params = new URLSearchParams({ q: query, type });
  const response = await api.get<ApiResponse<SearchResult>>(
    `/search?${params.toString()}`
  );
  return response.data;
};
