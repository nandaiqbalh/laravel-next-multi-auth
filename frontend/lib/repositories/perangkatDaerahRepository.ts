import axios from "axios";
import { httpClient } from "@/lib/repositories/httpClient";
import { ApiResponse, PaginatedData, PerangkatDaerah } from "@/lib/types";

function formatApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return String(error.response?.data?.message ?? error.message);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan saat memproses perangkat daerah.";
}

export const perangkatDaerahRepository = {
  async list(token: string, page: number, search: string) {
    try {
      const response = await httpClient.get<ApiResponse<PaginatedData<PerangkatDaerah>>>("/perangkat-daerah", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async create(token: string, payload: { name: string; description?: string; slug?: string }) {
    try {
      const response = await httpClient.post<ApiResponse<PerangkatDaerah>>("/perangkat-daerah", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async update(token: string, id: number, payload: { name: string; description?: string; slug?: string }) {
    try {
      const response = await httpClient.put<ApiResponse<PerangkatDaerah>>(`/perangkat-daerah/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async remove(token: string, id: number) {
    try {
      const response = await httpClient.delete<ApiResponse<null>>(`/perangkat-daerah/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async listPublic() {
    try {
      const response = await httpClient.get<ApiResponse<PerangkatDaerah[]>>("/public/perangkat-daerah");
      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },
};
