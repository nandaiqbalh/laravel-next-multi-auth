import { auth } from "@/auth";
import { ChartLine, UserCircle } from "@phosphor-icons/react";
import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/**
 * User layout protects user pages and injects shell.
 */
export default async function UserLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "SUPERADMIN") {
    redirect("/superadmin/dashboard");
  }

  if (session.user.role === "UMKM_ADMIN") {
    redirect("/admin/umkm/dashboard");
  }

  return (
    <AppShell
      sidebarTitle="Portal UMKM"
      sidebarSubtitle="USER"
      items={[
        { href: "/user/dashboard", label: "Dashboard", icon: ChartLine },
        { href: "/user/profile", label: "Profil", icon: UserCircle },
      ]}
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </AppShell>
  );
}
