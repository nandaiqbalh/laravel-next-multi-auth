"use client"

import { useEffect, useRef, useState, useTransition } from "react";
import { Modal } from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import { DataTable } from "@/components/common/DataTable";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { Spinner } from "@/components/ui/spinner";
import { umkmService } from "@/features/umkm/services/umkmService";
import type { AuditLogItem, PaginatedPayload } from "@/features/umkm/types/umkm";

function formatAuditDate(timestamp: string) {
  const date = new Date(timestamp);

  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}.${minutes}.${seconds}`;
}

type AuditTrailScope = "admin" | "superadmin";

interface AuditTrailClientProps {
  initialData: PaginatedPayload<AuditLogItem>;
  token: string;
  scope: AuditTrailScope;
}

export function AuditTrailClient({ initialData, token, scope }: AuditTrailClientProps) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.meta.current_page);
  const [selectedAudit, setSelectedAudit] = useState<AuditLogItem | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const initialPageRef = useRef(initialData.meta.current_page);

  useEffect(() => {
    if (page === initialPageRef.current) {
      return;
    }

    startTransition(() => {
      void (async () => {
        setLoading(true);

        try {
          const response =
            scope === "superadmin"
              ? await umkmService.getSuperadminAuditTrail(token, page)
              : await umkmService.getAdminAuditTrail(token, page);

          setData(response);
          setError("");
        } catch {
          setError("Gagal memuat audit trail.");
        } finally {
          setLoading(false);
        }
      })();
    });
  }, [page, scope, token]);

  return (
    <section className="surface-panel p-4 md:p-6 space-y-4">
      {error && <ErrorBanner message={error} />}

       {loading ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
            <Spinner className="mr-2 h-5 w-5 text-slate-600" />
            Memuat audit trail...
          </div>
        ) : (
          <DataTable
            columns={["Waktu", "Aksi", "Entity", "ID"]}
            rows={data.items.map((audit) => [
              formatAuditDate(audit.created_at),
              audit.action,
              audit.entity_type,
              audit.entity_id,
            ])}
            emptyLabel="Belum ada audit trail."
            rowProps={(_, rowIndex) => ({
              className: "cursor-pointer",
              onClick: () => setSelectedAudit(data.items[rowIndex]),
              onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setSelectedAudit(data.items[rowIndex]);
                }
              },
              role: "button",
              tabIndex: 0,
            })}
          />
        )}
      <Pagination currentPage={page} lastPage={data.meta.last_page} onChange={setPage} />

      <Modal open={selectedAudit !== null} title="Detail Audit" onClose={() => setSelectedAudit(null)}>
        {selectedAudit && (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Waktu</p>
              <p className="text-sm text-slate-700">{formatAuditDate(selectedAudit.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Aksi</p>
              <p className="text-sm text-slate-700">{selectedAudit.action}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Entity</p>
              <p className="text-sm text-slate-700">{selectedAudit.entity_type}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">ID</p>
              <p className="text-sm text-slate-700">{selectedAudit.entity_id}</p>
            </div>
            {selectedAudit.metadata && (
              <div>
                <p className="text-sm font-semibold">Metadata</p>
                <pre className="mt-2 overflow-auto rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                  {JSON.stringify(selectedAudit.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
