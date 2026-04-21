"use client";

import {
  AddressBook,
  Buildings,
  ChartLine,
  ClipboardText,
  FileText,
  IdentificationCard,
  ShieldCheck,
  ShieldStar,
  Stack,
  User,
  Users,
} from "@phosphor-icons/react";
import { AppShell } from "@/components/layout/app-shell";
import { type SidebarNavItem } from "@/components/layout/sidebar";
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
  const menuByRole: Record<RoleName, SidebarNavItem[]> = {
    UMKM_USER: [
      { href: "/umkm-user/dashboard", label: "Dashboard", icon: ChartLine },
      { href: "/umkm-user/profil-umkm", label: "Profil UMKM", icon: Buildings },
      { href: "/umkm-user/pengajuan", label: "Pengajuan", icon: ClipboardText },
    ],
    UMKM_ADMIN: [
      { href: "/umkm-admin/dashboard", label: "Dashboard", icon: ChartLine },
      {
        label: "Profil",
        icon: Buildings,
        children: [
          { href: "/umkm-admin/validasi-profil", label: "Validasi Profil", icon: IdentificationCard },
          { href: "/umkm-admin/data-umkm", label: "Data UMKM", icon: Buildings },
        ],
      },
      { href: "/umkm-admin/pengajuan", label: "Daftar Pengajuan", icon: ClipboardText },
      { href: "/umkm-admin/rekap", label: "Rekap", icon: Stack },
      {
        label: "Sistem",
        icon: ShieldCheck,
        children: [
          { href: "/umkm-admin/user", label: "User", icon: Users },
          { href: "/umkm-admin/audit-trail", label: "Audit Trail", icon: FileText },
        ],
      },
    ],
    SUPERADMIN: [
      { href: "/superadmin/dashboard", label: "Dashboard", icon: ChartLine },
      {
        label: "Manajemen Akses",
        icon: ShieldCheck,
        children: [
          { href: "/superadmin/roles", label: "Roles", icon: ShieldStar },
          { href: "/superadmin/users", label: "Users", icon: User },
        ],
      },
      { href: "/superadmin/audit-trail", label: "Audit Trail", icon: IdentificationCard },
    ],
  };

  return (
    <AppShell
      sidebarTitle="Portal UMKM"
      sidebarSubtitle={role.replace("_", " ")}
      items={menuByRole[role]}
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </AppShell>
  );
}
