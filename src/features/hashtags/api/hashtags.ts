import api from "@/services/api";

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

export const getTrendingHashtagsApi = async () => {
  const response = await api.get<ApiResponse<TrendingHashtag[]>>("/hashtags/trending");
  return response.data;
};
