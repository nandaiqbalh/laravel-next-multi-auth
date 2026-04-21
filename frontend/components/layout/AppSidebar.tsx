"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarItem = { href: string; label: string };

/**
 * App sidebar renders role-specific navigation links.
 */
export function AppSidebar({
  title,
  items,
  onClose,
  profileName,
  profileEmail,
  onLogout,
  logoutLoading = false,
}: {
  title: string;
  items: SidebarItem[];
  onClose?: () => void;
  profileName?: string;
  profileEmail?: string;
  onLogout?: () => void;
  logoutLoading?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--sidebar-border)] px-5 py-6">
        <div>
          <p className="text-base font-bold tracking-wide text-sky-800">Portal Layanan</p>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-sky-700/70">{title}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"
            aria-label="Tutup navigasi"
          >
            ×
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-5">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-sky-700 to-sky-600 text-white shadow-[0_10px_20px_rgba(31,156,240,0.3)]"
                  : "text-slate-600 hover:bg-white hover:text-sky-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--sidebar-border)] px-5 py-4">
        <div className="mb-3 rounded-xl border border-[var(--sidebar-border)] bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-800">{profileName ?? "User"}</p>
          <p className="text-xs text-slate-500">{profileEmail ?? "-"}</p>
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            disabled={logoutLoading}
            className="mb-3 w-full rounded-xl bg-red-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            {logoutLoading ? "Memproses..." : "Logout"}
          </button>
        )}
        <p className="text-xs text-slate-400">© 2026 Portal Layanan</p>
      </div>
    </div>
  );
}
