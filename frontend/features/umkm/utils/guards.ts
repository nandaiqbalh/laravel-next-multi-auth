import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { RoleName } from "@/features/umkm/types/umkm";
import { normalizeRoleSlug, resolveRoleHomePath } from "@/features/umkm/utils/roleRouting";

/**
 * requireRole ensures user has one of allowed roles and returns session token context.
 * @param allowed Allowed role names.
 * @returns Authenticated context containing role and token.
 *
 * Usage:
 * const ctx = await requireRole(["UMKM_ADMIN"]);
 */
export async function requireRole(allowed: RoleName[]) {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const currentRole = session.user.role as RoleName;
  const currentRoleSlug = normalizeRoleSlug(session.user.roleSlug, currentRole);
  const allowedTokens = allowed.map((item) => String(item).toLowerCase());
  const isAllowed = allowedTokens.includes(String(currentRole).toLowerCase()) || allowedTokens.includes(currentRoleSlug);

  if (!isAllowed) {
    redirect(resolveRoleHomePath(currentRoleSlug, currentRole));
  }

  return {
    role: currentRole,
    roleSlug: currentRoleSlug,
    token: session.token,
    user: session.user,
  };
}
