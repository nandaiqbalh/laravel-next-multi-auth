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
import { normalizeRoleSlug, resolveRoleScope } from "@/features/umkm/utils/roleRouting";

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
  roleSlug,
  userName,
  userEmail,
  children,
}: {
  role: RoleName;
  roleSlug?: string;
  userName?: string;
  userEmail?: string;
  children: React.ReactNode;
}) {
  const menuForUser: SidebarNavItem[] = [
      { href: "/user/dashboard", label: "Dashboard", icon: ChartLine },
      { href: "/user/profil-umkm", label: "Profil Usaha", icon: Buildings },
      { href: "/user/pengajuan", label: "Pengajuan", icon: ClipboardText },
    ];

  const menuForAdmin: SidebarNavItem[] = [
      { href: "/admin/dashboard", label: "Dashboard", icon: ChartLine },
      { href: "/admin/services", label: "Layanan", icon: AddressBook },
      {
        label: "Profil",
        icon: Buildings,
        children: [
          { href: "/admin/validasi-profil", label: "Validasi Profil", icon: IdentificationCard },
          { href: "/admin/data-umkm", label: "Data Pelaku Usaha", icon: Buildings },
        ],
      },
      { href: "/admin/pengajuan", label: "Daftar Pengajuan", icon: ClipboardText },
      { href: "/admin/rekap", label: "Rekap", icon: Stack },
      {
        label: "Sistem",
        icon: ShieldCheck,
        children: [
          { href: "/admin/user", label: "User", icon: Users },
          { href: "/admin/audit-trail", label: "Audit Trail", icon: FileText },
        ],
      },
    ];

  const menuForSuperadmin: SidebarNavItem[] = [
      { href: "/superadmin/dashboard", label: "Dashboard", icon: ChartLine },
      {
        label: "Manajemen Akses",
        icon: ShieldCheck,
        children: [
          { href: "/superadmin/roles", label: "Roles", icon: ShieldStar },
          { href: "/superadmin/users", label: "Users", icon: User },
        ],
      },
      { href: "/superadmin/perangkat-daerah", label: "Perangkat Daerah", icon: Buildings },
      { href: "/superadmin/audit-trail", label: "Audit Trail", icon: IdentificationCard },
    ];

  const menuForAdminLayanan: SidebarNavItem[] = [
      { href: "/admin/services", label: "Layanan", icon: AddressBook },
      { href: "/admin/rekap", label: "Rekap", icon: Stack },
      {
        label: "Sistem",
        icon: ShieldCheck,
        children: [
          { href: "/admin/audit-trail", label: "Audit Trail", icon: FileText },
        ],
      },
    ];

  const normalizedRoleSlug = normalizeRoleSlug(roleSlug, role);
  const roleScope = resolveRoleScope(normalizedRoleSlug, role);
  const items =
    normalizedRoleSlug === "admin-layanan"
      ? menuForAdminLayanan
      : roleScope === "superadmin"
        ? menuForSuperadmin
        : roleScope === "admin"
          ? menuForAdmin
          : menuForUser;

  return (
    <AppShell
      sidebarTitle="Portal Layanan"
      sidebarSubtitle={normalizedRoleSlug || String(role).replace(/_/g, " ")}
      items={items}
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </AppShell>
  );
}
