import axios from "axios";
import { httpClient } from "@/lib/repositories/httpClient";
import { ApiResponse, PaginatedData, User } from "@/lib/types";

function formatApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;
    const validation = error.response?.data?.data;
    const details = Array.isArray(validation)
      ? validation.flatMap((item) => (Array.isArray(item) ? item.map(String) : [String(item)]))
      : validation && typeof validation === "object"
      ? Object.values(validation).flatMap((item) => (Array.isArray(item) ? item.map(String) : [String(item)]))
      : [];

    return [apiMessage, ...details].filter(Boolean).join(" ") || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan saat berkomunikasi dengan server.";
}

/**
 * User repository handles user API requests.
 */
export const userRepository = {
  /**
   * Fetch paginated users with optional search query.
   */
  async list(token: string, page: number, search: string) {
    try {
      const response = await httpClient.get<ApiResponse<PaginatedData<User>>>("/users", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  /**
   * Create user through admin endpoint.
   */
  async create(token: string, payload: Partial<User> & { password: string }) {
    try {
      const response = await httpClient.post<ApiResponse<User>>("/users", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  /**
   * Update user through admin endpoint.
   */
  async update(token: string, id: string, payload: Partial<User> & { password?: string }) {
    try {
      const response = await httpClient.put<ApiResponse<User>>(`/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  /**
   * Delete user through admin endpoint.
   */
  async remove(token: string, id: string) {
    try {
      const response = await httpClient.delete<ApiResponse<null>>(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },
};
