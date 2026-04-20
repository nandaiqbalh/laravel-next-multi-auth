"use client";

import Link from "next/link";
import { CaretDown, SignOut } from "@phosphor-icons/react";
import { type ComponentType, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export type SidebarIcon = ComponentType<{ className?: string }>;

export type SidebarNavItem = {
  label: string;
  href?: string;
  icon?: SidebarIcon;
  children?: SidebarNavItem[];
};

/**
 * Sidebar navigation component.
 * Handles desktop and mobile navigation with nested menu sections.
 *
 * Usage:
 * <Sidebar title="Portal" items={items} pathname={pathname} />
 */
export function Sidebar({
  title,
  subtitle,
  items,
  pathname,
  userName,
  userEmail,
  onNavigate,
  onLogout,
  logoutLoading,
  className,
}: {
  title: string;
  subtitle: string;
  items: SidebarNavItem[];
  pathname: string;
  userName?: string;
  userEmail?: string;
  onNavigate?: () => void;
  onLogout: () => void;
  logoutLoading: boolean;
  className?: string;
}) {
  const initialExpanded = useMemo(() => {
    const state: Record<string, boolean> = {};

    function walk(entry: SidebarNavItem) {
      if (entry.children?.length) {
        state[entry.label] = entry.children.some((child) => isActivePath(pathname, child.href));
        entry.children.forEach(walk);
      }
    }

    items.forEach(walk);

    return state;
  }, [items, pathname]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function toggle(label: string) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <aside className={cn("flex h-full flex-col", className)}>
      <div className="border-b border-[var(--border)] px-5 py-5">
        <p className="text-base font-bold tracking-tight text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{subtitle}</p>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          if (item.children?.length) {
            const parentActive = item.children.some((child) => isActivePath(pathname, child.href));
            const Icon = item.icon;

            return (
              <div key={item.label} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggle(item.label)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition",
                    parentActive
                      ? "bg-[color-mix(in_srgb,var(--primary)_12%,white_88%)] text-[var(--primary)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {Icon ? <Icon className="size-4" /> : null}
                    {item.label}
                  </span>
                  <CaretDown className={cn("size-4 transition-transform", expanded[item.label] ? "rotate-180" : "rotate-0")} />
                </button>

                {expanded[item.label] && (
                  <div className="ml-3 space-y-1 border-l border-[var(--border)] pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const active = isActivePath(pathname, child.href);

                      return child.href ? (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                            active
                              ? "bg-[var(--primary)] text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          )}
                        >
                          {ChildIcon ? <ChildIcon className="size-4" /> : null}
                          {child.label}
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            );
          }

          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return item.href ? (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
                active
                  ? "bg-[var(--primary)] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {Icon ? <Icon className="size-4" /> : null}
              {item.label}
            </Link>
          ) : null;
        })}
      </nav>

      <div className="border-t border-[var(--border)] px-4 py-4">
        <div className="mb-3 rounded-lg border border-[var(--border)] bg-white px-3 py-2">
          <p className="truncate text-sm font-semibold text-slate-900">{userName ?? "User"}</p>
          <p className="truncate text-xs text-slate-500">{userEmail ?? "-"}</p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={logoutLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
        >
          <SignOut className="size-4" />
          {logoutLoading ? "Memproses..." : "Logout"}
        </button>

        <ConfirmDialog
          open={confirmOpen}
          title="Konfirmasi Logout"
          description="Apakah Anda yakin ingin keluar dari portal? Anda akan diminta login kembali untuk mengakses dashboard."
          cancelLabel="Batal"
          confirmLabel="Konfirmasi Logout"
          loading={logoutLoading}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            onLogout();
          }}
        />
      </div>
    </aside>
  );
}

function isActivePath(pathname: string, href?: string) {
  if (!href) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
