"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { RoleName } from "@/features/umkm/types/umkm";

/**
 * PortalShell wraps protected portal pages with role-aware navigation.
 * @param role Current authenticated role.
 * @param userName Authenticated user display name.
 * @param userEmail Authenticated user email.
 * @param children Page content.
 * @returns JSX element.
 *
 * Usage:
 * <PortalShell role="UMKM_ADMIN" userName="Admin" userEmail="a@x.com">...</PortalShell>
 */
export function PortalShell({
  role,
  userName,
  userEmail,
  children,
}: {
  role: RoleName;
  userName?: string;
  userEmail?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuByRole: Record<RoleName, Array<{ href: string; label: string }>> = {
    UMKM_USER: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/profil-umkm", label: "Profil UMKM" },
      { href: "/pengajuan", label: "Pengajuan" },
    ],
    UMKM_ADMIN: [
      { href: "/admin/umkm/dashboard", label: "Dashboard" },
      { href: "/admin/umkm/data-umkm", label: "Data UMKM" },
      { href: "/admin/umkm/pengajuan", label: "Pengajuan" },
      { href: "/admin/umkm/rekap", label: "Rekap" },
      { href: "/admin/umkm/user", label: "User" },
      { href: "/admin/umkm/audit-trail", label: "Audit Trail" },
    ],
    SUPERADMIN: [
      { href: "/superadmin/dashboard", label: "Dashboard" },
      { href: "/superadmin/roles", label: "Roles" },
      { href: "/superadmin/users", label: "Users" },
      { href: "/superadmin/audit-trail", label: "Audit Trail" },
    ],
  };

  /**
   * Trigger logout and redirect to login page.
   * @param void
   * @returns Promise<void>
   *
   * Usage:
   * await handleLogout();
   */
  async function handleLogout() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-border p-4">
          <Card className="h-full border-border">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle>Portal UMKM</CardTitle>
              <CardDescription className="text-primary-foreground/80">{role.replace("_", " ")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {menuByRole[role].map((item) => {
                const active = pathname === item.href;

                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={active ? "default" : "outline"}
                    className={cn("w-full justify-start", active ? "bg-primary text-primary-foreground" : "")}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                );
              })}

              <Separator />

              <div className="space-y-1">
                <p className="font-medium">{userName ?? "User"}</p>
                <p className="text-muted-foreground">{userEmail ?? "-"}</p>
              </div>

              <Button type="button" variant="destructive" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
