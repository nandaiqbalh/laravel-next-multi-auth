"use client";

import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { Pagination } from "@/components/common/Pagination";
import { DataTable } from "@/components/common/DataTable";
import { SearchInput } from "@/components/common/SearchInput";
import { useDebounce } from "@/lib/services/useDebounce";
import { AdminClaimActions } from "@/features/umkm/components/AdminClaimActions";
import { umkmService } from "@/features/umkm/services/umkmService";
import type { PaginatedPayload, UmkmClaim } from "@/features/umkm/types/umkm";

interface AdminClaimValidationClientProps {
  initialData: PaginatedPayload<UmkmClaim>;
  token: string;
}

export function AdminClaimValidationClient({ initialData, token }: AdminClaimValidationClientProps) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.meta.current_page);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery && page !== 1) {
      setPage(1);
      return;
    }

    if (page === initialData.meta.current_page && debouncedQuery === "") {
      return;
    }

    startTransition(() => {
      void (async () => {
        setLoading(true);

        try {
          const response = await umkmService.getAdminClaims(token, debouncedQuery, page);
          setData(response);
          setError("");
        } catch {
          setError("Gagal memuat validasi profil UMKM.");
        } finally {
          setLoading(false);
        }
      })();
    });
  }, [debouncedQuery, page, initialData.meta.current_page, token]);

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="rounded-lg border border-[var(--border)] bg-white p-4 md:p-6">
        <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-xs sm:w-auto">
            <SearchInput value={query} onChange={(value) => setQuery(value)} placeholder="Cari profile ID atau status..." />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
            <Spinner className="mr-2 h-5 w-5 text-slate-600" />
            Memuat validasi profil...
          </div>
        ) : (
          <>
            <DataTable
              columns={["ID", "Profile ID", "Status", "Catatan", "Aksi"]}
              rows={data.items.map((claim) => [
                `#${claim.id}`,
                claim.umkm_profile_id,
                <Badge key={`status-${claim.id}`}>{claim.status}</Badge>,
                claim.catatan_admin ?? "-",
                <AdminClaimActions key={`action-${claim.id}`} claimId={claim.id} />,
              ])}
              emptyLabel="Belum ada klaim untuk divalidasi."
            />
            <Pagination currentPage={page} lastPage={data.meta.last_page} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
