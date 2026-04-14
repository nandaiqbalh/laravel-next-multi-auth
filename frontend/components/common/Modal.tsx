"use client";

import type { ReactNode } from "react";

/**
 * Reusable modal component for create and edit forms.
 */
export function Modal({
  open,
  title,
  children,
  onClose,
  closeDisabled = false,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  closeDisabled?: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Tutup dialog"
            className="rounded-lg px-2 py-1 text-xl leading-none text-gray-600 hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
