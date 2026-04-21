import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { resolveRoleHomePath, resolveRoleScope } from "@/features/umkm/utils/roleRouting";

/**
 * Admin layout ensures only admin scope can access admin routes.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const roleScope = resolveRoleScope(session.user.roleSlug, session.user.role);

  if (roleScope !== "admin") {
    redirect(resolveRoleHomePath(session.user.roleSlug, session.user.role));
  }

  return (
    <PortalShell
      role={session.user.role}
      roleSlug={session.user.roleSlug}
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </PortalShell>
  );
}
