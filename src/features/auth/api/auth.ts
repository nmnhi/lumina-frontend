import api from "@/services/api";
import type { User } from "@/types";

/** Shape returned by the backend's sendResponse wrapper */
interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

/** Login: backend returns { user, accessToken } inside data */
interface LoginResult {
  user: User;
  accessToken: string;
}

/** Payload for the register endpoint */
export interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export const loginApi = async (email: string, password: string) => {
  const response = await api.post<ApiResponse<LoginResult>>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const registerApi = async (data: RegisterData) => {
  const response = await api.post<ApiResponse<User>>("/auth/register", data);
  return response.data;
};

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const changePasswordApi = async (data: ChangePasswordData) => {
  const response = await api.patch<ApiResponse<null>>("/auth/change-password", data);
  return response.data;
};

export const forgotPasswordApi = async (email: string) => {
  const response = await api.post<ApiResponse<null>>("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async (token: string, password: string) => {
  const response = await api.post<ApiResponse<null>>(`/auth/reset-password/${token}`, { password });
  return response.data;
};
