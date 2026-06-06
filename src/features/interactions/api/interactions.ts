import api from "@/services/api";
import type { Post } from "@/types";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface ToggleLikeResult {
  liked: boolean;
}

export interface SharePostResult {
  shared: boolean;
  alreadyShared: boolean;
  sharedPost?: Post | null;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  parentId?: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  replies?: Comment[];
}

/** Toggle like on a post */
export const toggleLikeApi = async (postId: string) => {
  const response = await api.post<ApiResponse<ToggleLikeResult>>(`/interactions/posts/${postId}/like`);
  return response.data;
};

/** Share a post (create new or return existing share) */
export const sharePostApi = async (postId: string, bodyText?: string) => {
  const response = await api.post<ApiResponse<SharePostResult>>(`/interactions/posts/${postId}/share`, { bodyText });
  return response.data;
};

/** Update caption of a shared post */
export const updateSharePostApi = async (postId: string, bodyText: string) => {
  const response = await api.patch<ApiResponse<Post>>(`/interactions/posts/${postId}/share`, { bodyText });
  return response.data;
};

/** Delete a shared post (unshare) */
export const deleteSharePostApi = async (postId: string) => {
  const response = await api.delete<ApiResponse<null>>(`/interactions/posts/${postId}/share`);
  return response.data;
};

/** Create a comment (or reply if parentId is provided) */
export const createCommentApi = async (postId: string, content: string, parentId?: string) => {
  const response = await api.post<ApiResponse<Comment>>(`/interactions/posts/${postId}/comments`, {
    content,
    ...(parentId && { parentId })
  });
  return response.data;
};

/** Get comments for a post */
export const getCommentsApi = async (postId: string) => {
  const response = await api.get<ApiResponse<Comment[]>>(`/interactions/posts/${postId}/comments`);
  return response.data;
};

/** Update a comment */
export const updateCommentApi = async (
  postId: string,
  commentId: string,
  content: string
) => {
  const response = await api.patch<ApiResponse<Comment>>(
    `/interactions/posts/${postId}/comments/${commentId}`,
    { content }
  );
  return response.data;
};

/** Delete a comment */
export const deleteCommentApi = async (postId: string, commentId: string) => {
  const response = await api.delete<ApiResponse<null>>(
    `/interactions/posts/${postId}/comments/${commentId}`
  );
  return response.data;
};
