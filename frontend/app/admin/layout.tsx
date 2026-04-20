import { auth } from "@/auth";
import { ChartLine, ShieldCheck, ShieldStar, Users } from "@phosphor-icons/react";
import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Admin layout protects admin pages and injects shell.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "UMKM_ADMIN" && session.user.role !== "SUPERADMIN") {
    redirect("/user-umkm/dashboard");
  }

  return (
    <AppShell
      sidebarTitle="Portal UMKM"
      sidebarSubtitle={session.user.role === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN"}
      items={[
        { href: "/admin/dashboard", label: "Dashboard", icon: ChartLine },
        {
          label: "Manajemen",
          icon: ShieldCheck,
          children: [
            { href: "/admin/users", label: "Users", icon: Users },
            { href: "/admin/roles", label: "Roles", icon: ShieldStar },
          ],
        },
      ]}
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </AppShell>
  );
}
