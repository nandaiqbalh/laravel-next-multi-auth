import axios from "axios";
import { httpClient } from "@/lib/repositories/httpClient";
import { ApiResponse, User } from "@/lib/types";

/**
 * Login payload contract.
 */
export type LoginPayload = {
  email: string;
  password: string;
};

/**
 * Register payload contract.
 */
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

/**
 * Authentication repository handles auth API calls.
 */
export const authRepository = {
  /**
   * Execute login request to backend credentials endpoint.
   */
  async login(payload: LoginPayload) {
    try {
      const response = await httpClient.post<ApiResponse<{ user: User & { role: { name: string } }; token: string }>>("/login", payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("[authRepository.login] Axios error:", {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code,
        });
        return {
          error: true,
          message:
            error.response?.data?.message ??
            `Login request failed: ${error.message}`,
          data: null,
        };
      }

      console.error("[authRepository.login] Non-axios error:", error);
      return { error: true, message: String(error), data: null };
    }
  },

  /**
   * Execute register request for normal user role.
   */
  async register(payload: RegisterPayload) {
    try {
      const response = await httpClient.post<ApiResponse<{ user: User; token: string }>>("/register", payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          error: true,
          message:
            error.response?.data?.message ??
            `Register request failed: ${error.message}`,
          data: null,
        };
      }

      return { error: true, message: String(error), data: null };
    }
  },
};
