import { roleRepository } from "@/lib/repositories/roleRepository";
import { userRepository } from "@/lib/repositories/userRepository";

/**
 * Admin service encapsulates dashboard business operations.
 */
export const adminService = {
  /**
   * Fetch users list with pagination and search.
   */
  async getUsers(token: string, page: number, search: string) {
    const response = await userRepository.list(token, page, search);

    if (response.error) {
      throw new Error(response.message);
    }

    return response.data;
  },

  /**
   * Fetch roles list with pagination and search.
   */
  async getRoles(token: string, page: number, search: string) {
    const response = await roleRepository.list(token, page, search);

    if (response.error) {
      throw new Error(response.message);
    }

    return response.data;
  },
};
