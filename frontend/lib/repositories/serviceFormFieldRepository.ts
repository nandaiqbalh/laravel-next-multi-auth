import axios from "axios";
import { httpClient } from "@/lib/repositories/httpClient";
import { ApiResponse, ServiceFormField } from "@/lib/types";

function formatApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return String(error.response?.data?.message ?? error.message);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan saat memproses field layanan.";
}

export const serviceFormFieldRepository = {
  async list(token: string, serviceId: number) {
    try {
      const response = await httpClient.get<ApiResponse<ServiceFormField[]>>(`/umkm/admin/services/${serviceId}/fields`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async create(
    token: string,
    serviceId: number,
    payload: {
      label: string;
      name: string;
      type: string;
      is_required?: boolean;
      options?: string[];
      order: number;
      placeholder?: string;
    },
  ) {
    try {
      const response = await httpClient.post<ApiResponse<ServiceFormField>>(
        `/umkm/admin/services/${serviceId}/fields`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async update(
    token: string,
    fieldId: number,
    payload: Partial<{
      label: string;
      name: string;
      type: string;
      is_required: boolean;
      options: string[];
      order: number;
      placeholder: string;
    }>,
  ) {
    try {
      const response = await httpClient.patch<ApiResponse<ServiceFormField>>(`/umkm/admin/service-fields/${fieldId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async remove(token: string, fieldId: number) {
    try {
      const response = await httpClient.delete<ApiResponse<null>>(`/umkm/admin/service-fields/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async reorder(token: string, serviceId: number, fields: Array<{ id: number; order: number }>) {
    try {
      const response = await httpClient.patch<ApiResponse<ServiceFormField[]>>(
        `/umkm/admin/services/${serviceId}/fields/reorder`,
        { fields },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },

  async listPublic(serviceId: number) {
    try {
      const response = await httpClient.get<ApiResponse<ServiceFormField[]>>(`/public/layanan/${serviceId}/fields`);
      return response.data;
    } catch (error) {
      throw new Error(formatApiError(error));
    }
  },
};
