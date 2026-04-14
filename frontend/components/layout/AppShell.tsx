"use client";

import { signOut, useSession } from "next-auth/react";
import { type ReactNode, useMemo, useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AppSidebar, SidebarItem } from "@/components/layout/AppSidebar";

/**
 * App shell builds responsive dashboard layout with role sidebar.
 */
export function AppShell({
  children,
  role,
}: {
  children: ReactNode;
  role: "admin" | "user";
}) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, startLogout] = useTransition();

  const items = useMemo<SidebarItem[]>(() => {
    if (role === "admin") {
      return [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/roles", label: "Roles" },
      ];
    }

    return [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/user/profile", label: "Profile" },
    ];
  }, [role]);

  const currentTitle = role === "admin" ? "Admin Workspace" : "User Workspace";

  function handleLogoutConfirm() {
    startLogout(async () => {
      await signOut({ callbackUrl: "/login" });
    });
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden min-h-screen w-60 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col lg:sticky lg:top-0">
        <AppSidebar
          title={currentTitle}
          items={items}
          profileName={session?.user?.name}
          profileEmail={session?.user?.email}
          onLogout={() => setLogoutDialogOpen(true)}
          logoutLoading={loggingOut}
        />
      </aside>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl">
            <AppSidebar
              title={currentTitle}
              items={items}
              onClose={() => setMobileOpen(false)}
              profileName={session?.user?.name}
              profileEmail={session?.user?.email}
              onLogout={() => setLogoutDialogOpen(true)}
              logoutLoading={loggingOut}
            />
          </div>
        </>
      )}

      <div className="flex-1">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Buka navigasi"
          >
            ☰
          </button>
          <span className="text-sm font-bold text-green-800">{currentTitle}</span>
          <div className="w-9" />
        </div>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        title="Konfirmasi logout"
        description="Kamu yakin ingin keluar dari akun ini?"
        confirmLabel="Ya, logout"
        loading={loggingOut}
        onCancel={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
