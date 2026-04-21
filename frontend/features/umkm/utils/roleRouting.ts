const ROLE_HOME_BY_SLUG: Record<string, string> = {
  superadmin: "/superadmin/dashboard",
  admin: "/admin/dashboard",
  "umkm-admin": "/admin/dashboard",
  "admin-layanan": "/admin/services",
  user: "/user/dashboard",
  "umkm-user": "/user/dashboard",
};

const ROLE_HOME_BY_NAME: Record<string, string> = {
  SUPERADMIN: "/superadmin/dashboard",
  ADMIN: "/admin/dashboard",
  UMKM_ADMIN: "/admin/dashboard",
  ADMIN_LAYANAN: "/admin/services",
  USER: "/user/dashboard",
  UMKM_USER: "/user/dashboard",
};

export type RoleScope = "superadmin" | "admin" | "user";

export function normalizeRoleSlug(roleSlug?: string | null, roleName?: string | null): string {
  if (roleSlug && roleSlug.trim().length > 0) {
    return roleSlug.trim().toLowerCase();
  }

  if (!roleName) {
    return "";
  }

  return roleName.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

export function isPerinkopAdminRole(roleSlug?: string | null, roleName?: string | null): boolean {
  return normalizeRoleSlug(roleSlug, roleName) === "admin-dinkop";
}

export function resolveRoleScope(roleSlug?: string | null, roleName?: string | null): RoleScope {
  const normalizedSlug = normalizeRoleSlug(roleSlug, roleName);

  if (normalizedSlug.includes("superadmin") || roleName === "SUPERADMIN") {
    return "superadmin";
  }

  if (normalizedSlug.includes("admin") || roleName === "UMKM_ADMIN" || roleName === "ADMIN_LAYANAN") {
    return "admin";
  }

  return "user";
}

export function resolveRoleHomePath(roleSlug?: string | null, roleName?: string | null): string {
  const normalizedSlug = normalizeRoleSlug(roleSlug, roleName);
  const roleScope = resolveRoleScope(roleSlug, roleName);

  if (ROLE_HOME_BY_SLUG[normalizedSlug]) {
    return ROLE_HOME_BY_SLUG[normalizedSlug];
  }

  if (roleName && ROLE_HOME_BY_NAME[roleName]) {
    return ROLE_HOME_BY_NAME[roleName];
  }

  if (roleScope === "superadmin") {
    return "/superadmin/dashboard";
  }

  if (roleScope === "admin") {
    return normalizedSlug === "admin-layanan" ? "/admin/services" : "/admin/dashboard";
  }

  return "/user/dashboard";
}
