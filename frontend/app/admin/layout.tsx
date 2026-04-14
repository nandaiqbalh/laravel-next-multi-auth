import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
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

  if (session.user.role !== "admin") {
    redirect("/user/dashboard");
  }

  return <AppShell role="admin">{children}</AppShell>;
}
