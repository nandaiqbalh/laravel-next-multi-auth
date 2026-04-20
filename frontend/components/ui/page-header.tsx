import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main page title — rendered as an `<h1>`. */
  title: string;
  /** Optional supporting text below the title. Accepts string or JSX. */
  description?: React.ReactNode;
  /** Optional slot for buttons / actions — pinned to the right on sm+. */
  actions?: React.ReactNode;
}

/**
 * Top-of-page header with an optional description and action slot.
 *
 * @example
 * <PageHeader
 *   title="Daftar UMKM"
 *   description="Kelola seluruh data usaha yang terdaftar."
 *   actions={<Button>Tambah UMKM</Button>}
 * />
 */
export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4", className)}
      {...props}
    >
        <div className="min-w-0 space-y-1">
          <h1 className="truncate text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description != null && (
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
          )}
        </div>

        {actions != null && <div className="shrink-0">{actions}</div>}
    </header>
  );
}