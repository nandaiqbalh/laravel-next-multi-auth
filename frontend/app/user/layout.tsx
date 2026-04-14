import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
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

  if (session.user.role === "admin") {
    redirect("/admin/dashboard");
  }

  return <AppShell role="user">{children}</AppShell>;
}
