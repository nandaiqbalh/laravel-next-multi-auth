import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalShell } from "@/features/umkm/components/PortalShell";

/**
 * Superadmin layout protects all superadmin pages.
 */
export default async function SuperadminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "SUPERADMIN") {
    if (session.user.role === "UMKM_ADMIN") {
      redirect("/umkm-admin/dashboard");
    }

    redirect("/umkm-user/dashboard");
  }

  return (
    <PortalShell role="SUPERADMIN" userName={session.user.name} userEmail={session.user.email}>
      {children}
    </PortalShell>
  );
}
