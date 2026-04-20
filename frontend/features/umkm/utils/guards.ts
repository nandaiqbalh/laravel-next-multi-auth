import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { RoleName } from "@/features/umkm/types/umkm";

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

  if (!allowed.includes(currentRole)) {
    if (currentRole === "SUPERADMIN") {
      redirect("/superadmin/dashboard");
    }

    if (currentRole === "UMKM_ADMIN") {
      redirect("/admin/umkm/dashboard");
    }

    redirect("/user-umkm/dashboard");
  }

  return {
    role: currentRole,
    token: session.token,
    user: session.user,
  };
}
