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
    <div className="relative flex min-h-screen bg-transparent">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(22,101,52,0.12)_0%,transparent_36%),radial-gradient(circle_at_90%_0%,rgba(34,197,94,0.1)_0%,transparent_30%)]" />
      <aside className="relative hidden min-h-screen w-64 shrink-0 border-r border-[var(--sidebar-border)] bg-[linear-gradient(180deg,#f7fbf8_0%,#eff7f1_100%)] lg:sticky lg:top-0 lg:flex lg:flex-col">
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
          <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--sidebar-border)] bg-[linear-gradient(180deg,#f7fbf8_0%,#eff7f1_100%)] shadow-2xl">
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

      <div className="relative flex-1">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-white/90 px-4 py-3 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-[var(--surface-soft)] hover:text-slate-900"
            aria-label="Buka navigasi"
          >
            ☰
          </button>
          <span className="text-sm font-bold text-green-800">{currentTitle}</span>
          <div className="w-9" />
        </div>

        <main className="relative p-4 md:p-8">
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
