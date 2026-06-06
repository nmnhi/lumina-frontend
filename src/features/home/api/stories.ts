import api from "@/services/api";
import type { Story } from "@/types";

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export const getActiveStoriesApi = async () => {
  const response = await api.get<ApiResponse<Story[]>>("/stories");
  return response.data;
};

export const createStoryApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ApiResponse<Story>>("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};
