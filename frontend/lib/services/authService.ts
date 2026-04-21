import { authRepository, LoginPayload, RegisterPayload } from "@/lib/repositories/authRepository";

/**
 * Auth service encapsulates frontend auth business logic.
 */
export const authService = {
  /**
   * Login user and normalize session payload.
   */
  async login(payload: LoginPayload) {
    const response = await authRepository.login(payload);

    if (response.error) {
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Login response data is empty");
    }

    return {
      id: String(response.data.user.id),
      nik: response.data.user.nik,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role?.name ?? "UMKM_USER",
      roleSlug: response.data.user.role?.slug ?? "umkm-user",
      token: response.data.token,
    };
  },

  /**
   * Register user account through backend API.
   */
  async register(payload: RegisterPayload) {
    const response = await authRepository.register(payload);

    if (response.error) {
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Register response data is empty");
    }

    return response;
  },
};
