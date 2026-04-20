"use client";

import type { ReactNode } from "react";

/**
 * Generic data table for admin list pages.
 */
export function DataTable({
  columns,
  rows,
  emptyLabel,
}: {
  columns: string[];
  rows: Array<Array<ReactNode>>;
  emptyLabel: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[0_12px_30px_rgba(12,33,20,0.08)]">
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
            rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-[var(--border)]/80 hover:bg-[var(--surface-soft)]/65">
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
