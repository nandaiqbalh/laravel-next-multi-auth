import { httpClient } from "@/lib/repositories/httpClient";
import { ApiResponse, PaginatedData, User } from "@/lib/types";

/**
 * User repository handles user API requests.
 */
export const userRepository = {
  /**
   * Fetch paginated users with optional search query.
   */
  async list(token: string, page: number, search: string) {
    const response = await httpClient.get<ApiResponse<PaginatedData<User>>>("/users", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, search },
    });

    return response.data;
  },

  /**
   * Create user through admin endpoint.
   */
  async create(token: string, payload: Partial<User> & { password: string }) {
    const response = await httpClient.post<ApiResponse<User>>("/users", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  /**
   * Update user through admin endpoint.
   */
  async update(token: string, id: number, payload: Partial<User> & { password?: string }) {
    const response = await httpClient.put<ApiResponse<User>>(`/users/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  /**
   * Delete user through admin endpoint.
   */
  async remove(token: string, id: number) {
    const response = await httpClient.delete<ApiResponse<null>>(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },
};
