"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Generic confirmation dialog for destructive or important actions.
 */
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
      <DialogContent showCloseButton={false}>
        <DialogHeader>

          <DialogTitle>{title}</DialogTitle>
          {icon ? (
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              {icon}
            </div>
          ) : null}
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {actions ? (
          <div className="mt-6">{actions}</div>
        ) : (
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button onClick={onConfirm} disabled={loading}>
              {loading ? "Memproses..." : confirmLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}