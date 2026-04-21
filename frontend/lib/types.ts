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
  slug: string;
  perangkat_daerah_id?: number | null;
  perangkat_daerah?: PerangkatDaerah | null;
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

/**
 * Perangkat daerah entity contract.
 */
export type PerangkatDaerah = {
  id: number;
  name: string;
  description?: string | null;
  slug: string;
};

/**
 * Service entity contract with perangkat daerah relation.
 */
export type ManagedService = {
  id: number;
  code: string;
  name: string;
  perangkat_daerah_id?: number | null;
  is_active: boolean;
  perangkat_daerah?: PerangkatDaerah | null;
};

/**
 * Dynamic form field entity contract.
 */
export type ServiceFormField = {
  id: number;
  service_id: number;
  label: string;
  name: string;
  type: string;
  is_required: boolean;
  options?: string[] | Array<{ label?: string; value?: string }> | null;
  order: number;
  placeholder?: string | null;
};
