import api from "@/services/api";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface FollowUser {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  bio?: string | null;
}

export interface SuggestedUser extends FollowUser {
  isFollowing: boolean;
  mutualCount: number;
  followerCount: number;
}

export interface ToggleFollowResult {
  isFollowing: boolean;
}

/** Toggle follow/unfollow a user */
export const toggleFollowApi = async (followingId: string) => {
  const response = await api.post<ApiResponse<ToggleFollowResult>>("/follows/toggle", { followingId });
  return response.data;
};

/** Get users I am following */
export const getFollowingApi = async () => {
  const response = await api.get<ApiResponse<FollowUser[]>>("/follows/following");
  return response.data;
};

/** Get followers */
export const getFollowersApi = async () => {
  const response = await api.get<ApiResponse<FollowUser[]>>("/follows/followers");
  return response.data;
};

/** Get suggested users to follow (mutual → followers → popular) */
export const getSuggestedUsersApi = async (limit: number = 5) => {
  const response = await api.get<ApiResponse<SuggestedUser[]>>(`/follows/suggested?limit=${limit}`);
  return response.data;
};
