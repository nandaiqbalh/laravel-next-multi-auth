"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  loading = false,
  onConfirm,
  onCancel,
  actions,
  icon,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  actions?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent showCloseButton={false} className="gap-0 overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-sm">

        <DialogHeader className="px-6 pb-5 pt-6">
          {icon && (
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              {icon}
            </div>
          )}
          <DialogTitle className="text-base font-semibold text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-slate-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        {actions ? (
          <div className="border-t border-gray-100 px-6 py-4">{actions}</div>
        ) : (
          <DialogFooter className="flex flex-row items-center gap-2 border-t border-gray-100 px-6 py-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? "Memproses..." : confirmLabel}
            </button>
          </DialogFooter>
        )}

      </DialogContent>
    </Dialog>
  );
}