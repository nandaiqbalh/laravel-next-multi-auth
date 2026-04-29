"use client";

import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/common/DataTable";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import { useDebounce } from "@/lib/services/useDebounce";
import { approveUmkmProfileHistoryAction, rejectUmkmProfileHistoryAction } from "@/lib/actions/umkmActions";
import { umkmService } from "@/features/umkm/services/umkmService";
import type { PaginatedPayload, UmkmProfileHistory } from "@/features/umkm/types/umkm";

interface AdminProfileHistoryClientProps {
  initialData: PaginatedPayload<UmkmProfileHistory>;
  token: string;
}

const statusVariant = (status?: string) => {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  if (status === "pending") return "secondary";
  return "outline";
};

const statusLabel = (status?: string) => {
  if (status === "approved") return "Disetujui";
  if (status === "rejected") return "Ditolak";
  if (status === "pending") return "Menunggu";
  return "Tidak diketahui";
};

export function AdminProfileHistoryClient({ initialData, token }: AdminProfileHistoryClientProps) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.meta.current_page);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<UmkmProfileHistory | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
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
          const response = await umkmService.getAdminProfileHistory(token, debouncedQuery, page);
          setData(response);
          setError("");
        } catch {
          setError("Gagal memuat riwayat perubahan profil UMKM.");
        } finally {
          setLoading(false);
        }
      })();
    });
  }, [debouncedQuery, page, initialData.meta.current_page, token]);

  async function refreshData() {
    setLoading(true);
    try {
      const response = await umkmService.getAdminProfileHistory(token, debouncedQuery, page);
      setData(response);
      setError("");
    } catch {
      setError("Gagal memuat riwayat perubahan profil UMKM.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(history: UmkmProfileHistory) {
    setSelectedHistory(history);
    setReviewOpen(true);
    setAdminNote(history.catatan_admin ?? "");
    setDecision("approved");
    setMessage("");
  }

  async function handleSubmitReview() {
    if (!selectedHistory) return;

    setActionLoading(true);
    setMessage("");

    try {
      if (decision === "approved") {
        await approveUmkmProfileHistoryAction(selectedHistory.id);
        setMessage("Permintaan perubahan berhasil disetujui.");
      } else {
        await rejectUmkmProfileHistoryAction(selectedHistory.id, { catatan_admin: adminNote || undefined });
        setMessage("Permintaan perubahan berhasil ditolak.");
      }

      await refreshData();
      setReviewOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memproses permintaan.");
    } finally {
      setActionLoading(false);
    }
  }

  function renderDiff(history: UmkmProfileHistory) {
    const payload = history.payload ?? {};
    const rows = Object.entries(payload);

    if (rows.length === 0) {
      return <p className="text-sm text-slate-500">Tidak ada perubahan yang dapat ditampilkan.</p>;
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map(([key, value]) => {
          const currentValue = history.profile ? (history.profile as any)[key] : null;
          return (
            <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">{key.replace(/_/g, ' ')}</p>
              <p className="mt-2 text-sm text-slate-600">Saat ini: {currentValue !== null && currentValue !== undefined ? String(currentValue) : '-'}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Diusulkan: {value !== null && value !== undefined ? String(value) : '-'}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}
      {message && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>}

      <div className="rounded-lg border border-[var(--border)] bg-white p-4 md:p-6">
        <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Riwayat Perubahan Profil UMKM</p>
            <p className="text-sm text-slate-500">Tinjau dan proses permintaan perubahan profil usaha dari pengguna.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari profile ID atau status..." />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
            Memuat riwayat perubahan...
          </div>
        ) : (
          <>
            <DataTable
              columns={["ID", "Profile ID", "Status", "Dibuat Oleh", "Tanggal", "Aksi"]}
              rows={data.items.map((history) => [
                `#${history.id}`,
                history.umkm_profile_id,
                <Badge key={`status-${history.id}`} variant={statusVariant(history.status)}>{statusLabel(history.status)}</Badge>,
                history.creator?.name ?? history.created_by,
                new Date(history.created_at).toLocaleString('id-ID'),
                <Button key={`action-${history.id}`} variant="outline" size="sm" onClick={() => void handleReview(history)}>
                  Tinjau
                </Button>,
              ])}
              emptyLabel="Belum ada permintaan perubahan profil UMKM."
            />
            <Pagination currentPage={page} lastPage={data.meta.last_page} onChange={setPage} />
          </>
        )}
      </div>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Permintaan Perubahan Profil</DialogTitle>
            <DialogDescription>
              Tinjau perubahan dan setujui atau tolak permintaan pengguna.
            </DialogDescription>
          </DialogHeader>

          {selectedHistory ? (
            <div className="space-y-4 py-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Profile ID</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedHistory.umkm_profile_id}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
                  <Badge variant={statusVariant(selectedHistory.status)}>{statusLabel(selectedHistory.status)}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">Perubahan yang diajukan</p>
                {renderDiff(selectedHistory)}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Keputusan</label>
                  <select
                    value={decision}
                    onChange={(event) => setDecision(event.target.value as "approved" | "rejected")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900"
                  >
                    <option value="approved">Setujui</option>
                    <option value="rejected">Tolak</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Catatan admin</label>
                  <Textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} placeholder="Catatan untuk pengguna" />
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setReviewOpen(false)} disabled={actionLoading}>
              Tutup
            </Button>
            <Button variant={decision === "approved" ? "default" : "destructive"} onClick={handleSubmitReview} disabled={actionLoading}>
              {actionLoading ? "Memproses..." : decision === "approved" ? "Setujui" : "Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
