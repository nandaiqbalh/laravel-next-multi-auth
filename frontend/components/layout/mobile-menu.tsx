"use client";

import { X } from "@phosphor-icons/react";
import { Sidebar, type SidebarNavItem } from "@/components/layout/sidebar";

/**
 * Mobile menu drawer component.
 * Shows sidebar navigation as a sliding overlay on small screens.
 *
 * Usage:
 * <MobileMenu open={open} onClose={closeFn} items={items} pathname={pathname} />
 */
export function MobileMenu({
  open,
  title,
  subtitle,
  items,
  pathname,
  userName,
  userEmail,
  onClose,
  onLogout,
  logoutLoading,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  items: SidebarNavItem[];
  pathname: string;
  userName?: string;
  userEmail?: string;
  onClose: () => void;
  onLogout: () => void;
  logoutLoading: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Tutup menu"
      />
      <div className="absolute inset-y-0 left-0 w-[88vw] max-w-[320px] animate-in slide-in-from-left-5 border-r border-[var(--border)] bg-white duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex items-center justify-center rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Tutup menu"
        >
          <X className="size-5" />
        </button>
        <Sidebar
          title={title}
          subtitle={subtitle}
          items={items}
          pathname={pathname}
          userName={userName}
          userEmail={userEmail}
          onNavigate={onClose}
          onLogout={onLogout}
          logoutLoading={logoutLoading}
          className="h-full"
        />
      </div>
    </div>
  );
}
