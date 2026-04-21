import { httpClient } from "@/lib/repositories/httpClient";
import { ApiResponse, PaginatedData, Role } from "@/lib/types";

/**
 * Role repository handles role API requests.
 */
export const roleRepository = {
  /**
   * Fetch paginated roles with optional search query.
   */
  async list(token: string, page: number, search: string) {
    const response = await httpClient.get<ApiResponse<PaginatedData<Role>>>("/roles", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, search },
    });

    return response.data;
  },

  /**
   * Create role through admin endpoint.
   */
  async create(token: string, payload: Pick<Role, "name" | "slug" | "perangkat_daerah_id">) {
    const response = await httpClient.post<ApiResponse<Role>>("/roles", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  /**
   * Update role through admin endpoint.
   */
  async update(token: string, id: number, payload: Pick<Role, "name" | "slug" | "perangkat_daerah_id">) {
    const response = await httpClient.put<ApiResponse<Role>>(`/roles/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  /**
   * Delete role through admin endpoint.
   */
  async remove(token: string, id: number) {
    const response = await httpClient.delete<ApiResponse<null>>(`/roles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },
};
