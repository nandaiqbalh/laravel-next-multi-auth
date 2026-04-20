"use client";

/**
 * Pagination component controls list page navigation.
 */
export function Pagination({
  currentPage,
  lastPage,
  onChange,
}: {
  currentPage: number;
  lastPage: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="mt-5 flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[var(--surface-soft)] disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {lastPage}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(lastPage, currentPage + 1))}
        disabled={currentPage >= lastPage}
        className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[var(--surface-soft)] disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
