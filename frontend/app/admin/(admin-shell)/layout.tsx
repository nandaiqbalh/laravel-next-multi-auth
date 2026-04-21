import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Admin shell layout wraps admin pages with the main admin app shell.
 */
export default async function AdminShellLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell
      sidebarTitle="Portal UMKM"
      sidebarSubtitle={session.user.role === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN"}
      items={[
        { href: "/admin/dashboard", label: "Dashboard", icon: "ChartLine" },
        {
          label: "Manajemen",
          icon: "ShieldCheck",
          children: [
            { href: "/admin/users", label: "Users", icon: "Users" },
            { href: "/admin/roles", label: "Roles", icon: "ShieldStar" },
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
