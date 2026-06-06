import api from "@/services/api";
import type { User } from "@/types";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

/** Payload for updating profile */
export interface UpdateProfileData {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
}

/** Get my own profile */
export const getMeApi = async () => {
  const response = await api.get<ApiResponse<User>>("/users/me");
  return response.data;
};

/** Update my profile */
export const updateProfileApi = async (data: UpdateProfileData) => {
  const response = await api.put<ApiResponse<User>>("/users/me", data);
  return response.data;
};

/** Get a user profile by username */
export const getUserByUsernameApi = async (username: string) => {
  const response = await api.get<ApiResponse<User>>(`/users/${username}`);
  return response.data;
};

/** Toggle follow / unfollow a user. Returns the new follow state. */
export const toggleFollowApi = async (followingId: string) => {
  const response = await api.post<ApiResponse<{ isFollowing: boolean }>>(
    "/follows/toggle",
    { followingId }
  );
  return response.data;
};
