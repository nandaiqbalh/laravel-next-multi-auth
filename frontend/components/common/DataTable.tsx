"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Generic data table for admin list pages.
 */
export function DataTable({
  columns,
  rows,
  emptyLabel,
  rowProps,
}: {
  columns: string[];
  rows: Array<Array<ReactNode>>;
  emptyLabel: string;
  rowProps?: (row: Array<ReactNode>, rowIndex: number) => React.HTMLAttributes<HTMLTableRowElement>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
      <table className="min-w-full">
        <thead className="bg-[var(--surface-soft)] text-left">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-sm text-gray-500" colSpan={columns.length}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => {
              const props = rowProps?.(row, rowIndex) ?? {};

              return (
                <tr
                  key={rowIndex}
                  className={cn("border-t border-[var(--border)] hover:bg-[var(--surface-soft)]/65", props.className)}
                  {...props}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 text-sm">
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
