import api from "./api";
import type { User } from "@/types";

interface LoginResponse {
  token: string;
  user: User;
}

/**
 * 🌟 GỌI API ĐĂNG NHẬP
 * POST /auth/login → { token, user }
 */
export const loginApi = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password
  });
  return response.data;
};