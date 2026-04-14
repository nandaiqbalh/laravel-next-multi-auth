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
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-5">
        <div>
          <p className="text-base font-bold text-green-800">Fullstack Starter</p>
          <p className="text-xs text-gray-400">{title}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Tutup navigasi"
          >
            ×
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-green-700 text-white"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 px-4 py-3">
        <div className="mb-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-sm font-semibold text-gray-800">{profileName ?? "User"}</p>
          <p className="text-xs text-gray-500">{profileEmail ?? "-"}</p>
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            disabled={logoutLoading}
            className="mb-3 w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            {logoutLoading ? "Memproses..." : "Logout"}
          </button>
        )}
        <p className="text-xs text-gray-400">© 2026 Fullstack Starter</p>
      </div>
    </div>
  );
}
