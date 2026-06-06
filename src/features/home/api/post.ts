import api from "@/services/api";
import type { Post } from "@/types";

/** Shape returned by the backend's sendResponse wrapper */
interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

/** Payload for creating a post */
export interface CreatePostData {
  bodyText?: string;
  media?: string[];
}

/** Payload for updating a post */
export interface UpdatePostData {
  bodyText?: string;
  media?: string[];
}

/** Create a new post (multipart/form-data for files) */
export const createPostApi = async (formData: FormData) => {
  const response = await api.post<ApiResponse<Post>>("/post", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

/** Create a new post (text only, no files) */
export const createPostTextApi = async (data: CreatePostData) => {
  const response = await api.post<ApiResponse<Post>>("/post", data);
  return response.data;
};

/** Update an existing post */
export const updatePostApi = async (postId: string, data: UpdatePostData) => {
  const response = await api.patch<ApiResponse<Post>>(`/post/${postId}`, data);
  return response.data;
};

/** Delete a post */
export const deletePostApi = async (postId: string) => {
  const response = await api.delete<ApiResponse<null>>(`/post/${postId}`);
  return response.data;
};

/** Get my posts (for profile) */
export const getMyPostsApi = async () => {
  const response = await api.get<ApiResponse<{ posts: Post[]; nextCursor?: string }>>("/post/me");
  return response.data;
};

/** Get user posts by userId */
export const getUserPostsApi = async (userId: string, cursor?: string) => {
  const params: Record<string, string> = {};
  if (cursor) params.cursor = cursor;
  const query = new URLSearchParams(params).toString();
  const response = await api.get<ApiResponse<{ posts: Post[]; nextCursor?: string }>>(`/post/user/${userId}${query ? `?${query}` : ""}`);
  return response.data;
};
