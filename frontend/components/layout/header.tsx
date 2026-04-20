"use client";

import { List, SignOut, UserCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * App header component.
 * Provides sticky page title, mobile menu toggle, and user dropdown actions.
 *
 * Usage:
 * <Header title="Dashboard" onToggleMobileMenu={toggleFn} onLogout={logoutFn} />
 */
export function Header({
  title,
  userName,
  userEmail,
  showMobileMenuToggle,
  onToggleMobileMenu,
  onLogout,
  logoutLoading,
}: {
  title: string;
  userName?: string;
  userEmail?: string;
  showMobileMenuToggle: boolean;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
  logoutLoading: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {showMobileMenuToggle ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={onToggleMobileMenu}
              aria-label="Buka menu"
            >
              <List className="size-5" />
            </Button>
          ) : null}
          <h1 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">{title}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" className="h-9 gap-2 px-3">
              <UserCircle className="size-4" />
              <span className="hidden max-w-[160px] truncate sm:inline">{userName ?? "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-lg border border-[var(--border)] bg-white p-1.5">
            <DropdownMenuLabel className="space-y-0.5 px-2 py-1.5">
              <p className="text-sm font-semibold text-slate-900">{userName ?? "User"}</p>
              <p className="text-xs text-slate-500">{userEmail ?? "-"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              disabled={logoutLoading}
              className="rounded-md text-red-700 focus:bg-red-50 focus:text-red-700"
            >
              <SignOut className="size-4" />
              {logoutLoading ? "Memproses..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
