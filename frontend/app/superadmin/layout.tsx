import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { resolveRoleHomePath, resolveRoleScope } from "@/features/umkm/utils/roleRouting";

/**
 * Superadmin layout protects all superadmin pages.
 */
export default async function SuperadminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (resolveRoleScope(session.user.roleSlug, session.user.role) !== "superadmin") {
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
