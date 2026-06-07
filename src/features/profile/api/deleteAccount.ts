import api from "@/services/api";

/** Delete my account permanently */
export const deleteAccountApi = async () => {
  const response = await api.delete<{ status: string; message: string; data: null }>("/users/me");
  return response.data;
};
