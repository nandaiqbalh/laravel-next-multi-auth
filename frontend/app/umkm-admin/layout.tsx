import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalShell } from "@/features/umkm/components/PortalShell";

/**
 * Admin UMKM layout ensures only UMKM_ADMIN can access admin UMKM routes.
 */
export default async function AdminUmkmLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "SUPERADMIN") {
    redirect("/superadmin/dashboard");
  }

  if (session.user.role !== "UMKM_ADMIN") {
    redirect("/umkm-user/dashboard");
  }

  return (
    <PortalShell role="UMKM_ADMIN" userName={session.user.name} userEmail={session.user.email}>
      {children}
    </PortalShell>
  );
}
