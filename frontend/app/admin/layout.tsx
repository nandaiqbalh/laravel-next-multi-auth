import { auth } from "@/auth";
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
    redirect("/dashboard");
  }

  return children;
}
