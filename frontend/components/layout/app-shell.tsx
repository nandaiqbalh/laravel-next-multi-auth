"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Sidebar, type SidebarNavItem } from "@/components/layout/sidebar";

/**
 * Application shell component.
 * Composes responsive sidebar, sticky header, and content container for protected pages.
 *
 * Usage:
 * <AppShell sidebarTitle="Portal" sidebarSubtitle="Admin" items={items}>...</AppShell>
 */
export function AppShell({
  children,
  sidebarTitle,
  sidebarSubtitle,
  items,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  sidebarTitle: string;
  sidebarSubtitle: string;
  items: SidebarNavItem[];
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutLoading, startLogout] = useTransition();

  const pageTitle = useMemo(() => {
    const allNodes: SidebarNavItem[] = [];

    function collect(entry: SidebarNavItem) {
      allNodes.push(entry);
      entry.children?.forEach(collect);
    }

    items.forEach(collect);

    const active = allNodes.find((entry) => entry.href && isActivePath(pathname, entry.href));

    return active?.label ?? "Dashboard";
  }, [items, pathname]);

  function handleLogout() {
    startLogout(async () => {
      await signOut({ callbackUrl: "/login" });
    });
  }

  return (
    <div className="min-h-screen bg-[#f8fbff]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(58,159,245,0.12)_0%,transparent_34%),radial-gradient(circle_at_92%_14%,rgba(125,211,252,0.22)_0%,transparent_32%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[270px_1fr]">
        <aside className="hidden border-r border-[var(--border)] bg-white lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar
              title={sidebarTitle}
              subtitle={sidebarSubtitle}
              items={items}
              pathname={pathname}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
              logoutLoading={logoutLoading}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <Header
            title={pageTitle}
            userName={userName}
            userEmail={userEmail}
            showMobileMenuToggle
            onToggleMobileMenu={() => setMobileOpen(true)}
            onLogout={handleLogout}
            logoutLoading={logoutLoading}
          />
          <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title={sidebarTitle}
        subtitle={sidebarSubtitle}
        items={items}
        pathname={pathname}
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
        logoutLoading={logoutLoading}
      />
    </div>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
