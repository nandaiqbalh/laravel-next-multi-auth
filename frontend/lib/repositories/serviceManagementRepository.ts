import axios from "axios";
import { httpClient } from "@/lib/repositories/httpClient";
import { ApiResponse, ManagedService, PaginatedData } from "@/lib/types";

function formatApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return String(error.response?.data?.message ?? error.message);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan saat memproses data layanan.";
}

export const serviceManagementRepository = {
  async list(token: string, page: number, search: string, perangkatDaerahId?: number) {
    try {
      const response = await httpClient.get<ApiResponse<PaginatedData<ManagedService>>>("/umkm/admin/services", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          search,
          perangkat_daerah_id: perangkatDaerahId,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async create(token: string, payload: { code: string; name: string; perangkat_daerah_id: number; is_active?: boolean }) {
    try {
      const response = await httpClient.post<ApiResponse<ManagedService>>("/umkm/admin/services", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async find(token: string, id: number) {
    try {
      const response = await httpClient.get<ApiResponse<ManagedService>>(`/umkm/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async update(token: string, id: number, payload: { code: string; name: string; perangkat_daerah_id: number; is_active?: boolean }) {
    try {
      const response = await httpClient.put<ApiResponse<ManagedService>>(`/umkm/admin/services/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async remove(token: string, id: number) {
    try {
      const response = await httpClient.delete<ApiResponse<null>>(`/umkm/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async listPublicBySlug(slug: string) {
    try {
      const response = await httpClient.get<ApiResponse<ManagedService[]>>(`/public/layanan/${slug}`);
      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },
};
