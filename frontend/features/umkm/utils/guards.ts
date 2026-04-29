import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { RoleName } from "@/features/umkm/types/umkm";
import { normalizeRoleSlug, resolveRoleHomePath, resolveRoleScope } from "@/features/umkm/utils/roleRouting";

/**
 * requireRole ensures user has one of allowed roles and returns session token context.
 * @param allowed Allowed role names.
 * @returns Authenticated context containing role and token.
 *
 * Usage:
 * const ctx = await requireRole(["UMKM_ADMIN"]);
 */
export async function requireRole(allowed: RoleName[], callbackUrl?: string) {
  const session = await auth();

  if (!session?.token) {
    if (callbackUrl) {
      redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
    redirect("/login");
  }

  const currentRole = session.user.role as RoleName;
  const currentRoleSlug = normalizeRoleSlug(session.user.roleSlug, currentRole);
  const currentRoleScope = resolveRoleScope(currentRoleSlug, currentRole);
  const allowedTokens = allowed.map((item) => String(item).toLowerCase());
  const isUserScopeAllowed = currentRoleScope === "user" && allowedTokens.some((token) => ["user", "umkm_user", "umkm-user", "umkm_user"].includes(token));
  const isAllowed =
    allowedTokens.includes(String(currentRole).toLowerCase()) ||
    allowedTokens.includes(currentRoleSlug) ||
    isUserScopeAllowed;

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
