"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable } from "@/components/common/DataTable";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { Modal } from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import { Spinner } from "@/components/ui/spinner";
import {
  createManagedServiceAction,
  deleteManagedServiceAction,
  getManagedServicesAction,
  updateManagedServiceAction,
} from "@/lib/actions/serviceManagementActions";
import { useDebounce } from "@/lib/services/useDebounce";
import { ManagedService, PaginatedData, PerangkatDaerah } from "@/lib/types";

export function ServicesClient({
  initialData,
  perangkatDaerahOptions,
}: {
  initialData: PaginatedData<ManagedService>;
  perangkatDaerahOptions: PerangkatDaerah[];
}) {
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [page, setPage] = useState(initialData.meta.current_page);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedService | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getManagedServicesAction(page, debouncedQuery);
        setData(response.data);
        setError("");
      } catch {
        setError("Gagal memuat data layanan.");
      }
    });
  }, [page, debouncedQuery]);

  async function refreshData() {
    const response = await getManagedServicesAction(page, debouncedQuery);
    setData(response.data);
  }

  async function onDelete() {
    if (!deletingId) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteManagedServiceAction(deletingId);
        await refreshData();
        setDeletingId(null);
        toast.success("Layanan berhasil dihapus.");
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal menghapus layanan.";
        setError(message);
        toast.error(message);
      }
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      code: String(formData.get("code") ?? "").trim().toUpperCase(),
      name: String(formData.get("name") ?? "").trim(),
      perangkat_daerah_id: Number(formData.get("perangkat_daerah_id") ?? 0),
      is_active: String(formData.get("is_active") ?? "1") === "1",
    };

    startTransition(async () => {
      try {
        if (!payload.code || !payload.name || payload.perangkat_daerah_id < 1) {
          setError("Kode, nama, dan perangkat daerah wajib diisi.");
          return;
        }

        if (editing) {
          await updateManagedServiceAction(editing.id, payload);
          toast.success("Layanan berhasil diperbarui.");
        } else {
          await createManagedServiceAction(payload);
          toast.success("Layanan berhasil dibuat.");
        }

        await refreshData();
        setError("");
        setModalOpen(false);
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal menyimpan layanan.";
        setError(message);
        toast.error(message);
      }
    });
  }

  return (
    <section className="space-y-4">
      <div className="surface-panel p-4 md:p-6">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
            onClick={() => {
              setEditing(null);
              setError("");
              setModalOpen(true);
            }}
            disabled={loading}
          >
            Tambah Layanan
          </button>
        </div>

        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Cari kode atau nama layanan..."
        />

        <div className="mt-4">
          {loading ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
              <Spinner className="mr-2 h-5 w-5 text-slate-600" />
              Memuat layanan...
            </div>
          ) : (
            <DataTable
              columns={["Kode", "Nama", "Perangkat Daerah", "Status", "Aksi"]}
              rows={data.items.map((item) => [
                item.code,
                item.name,
                item.perangkat_daerah?.name ?? "-",
                <span
                  key={`${item.id}-status`}
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {item.is_active ? "Aktif" : "Nonaktif"}
                </span>,
                <div key={item.id} className="flex gap-2">
                  <Link
                    href={`/admin/services/${item.id}/form-builder`}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Form Builder
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--primary-dark)]"
                    onClick={() => {
                      setEditing(item);
                      setError("");
                      setModalOpen(true);
                    }}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                    onClick={() => setDeletingId(item.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>,
              ])}
              emptyLabel="Belum ada data layanan"
            />
          )}
        </div>

        <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeDisabled={loading}
        title={editing ? "Edit Layanan" : "Tambah Layanan"}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="code" defaultValue={editing?.code ?? ""} className="field" placeholder="Kode layanan" required disabled={loading} />
          <input name="name" defaultValue={editing?.name ?? ""} className="field" placeholder="Nama layanan" required disabled={loading} />

          <select
            name="perangkat_daerah_id"
            defaultValue={String(editing?.perangkat_daerah_id ?? perangkatDaerahOptions[0]?.id ?? "")}
            className="field"
            required
            disabled={loading}
          >
            {perangkatDaerahOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>

          <select name="is_active" defaultValue={editing?.is_active ? "1" : "0"} className="field" disabled={loading}>
            <option value="1">Aktif</option>
            <option value="0">Nonaktif</option>
          </select>

          {error && <ErrorBanner message={error} />}
          <button className="btn-primary w-full rounded-lg px-4 py-2 font-semibold" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        title="Konfirmasi Hapus"
        description="Layanan yang dihapus tidak dapat dikembalikan. Lanjutkan?"
        confirmLabel="Ya, hapus"
        loading={loading}
        onCancel={() => setDeletingId(null)}
        onConfirm={onDelete}
      />
    </section>
  );
}
