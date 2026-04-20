/**
 * Generic API response contract from Laravel backend.
 */
export type ApiResponse<T> = {
  error: boolean;
  message: string;
  data: T;
};

/**
 * Role entity contract.
 */
export type Role = {
  id: number;
  name: string;
};

/**
 * User entity contract.
 */
export type User = {
  id: string;
  nik: string;
  name: string;
  email: string;
  role_id: number;
  role?: Role;
};

/**
 * Standard paginated payload contract.
 */
export type PaginatedData<T> = {
  items: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};
