"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/common/DataTable";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { Modal } from "@/components/common/Modal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Spinner } from "@/components/ui/spinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import {
  createPerangkatDaerahAction,
  deletePerangkatDaerahAction,
  getPerangkatDaerahAction,
  updatePerangkatDaerahAction,
} from "@/lib/actions/perangkatDaerahActions";
import { PaginatedData, PerangkatDaerah } from "@/lib/types";
import { useDebounce } from "@/lib/services/useDebounce";

export function PerangkatDaerahClient({ initialData }: { initialData: PaginatedData<PerangkatDaerah> }) {
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [page, setPage] = useState(initialData.meta.current_page);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PerangkatDaerah | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getPerangkatDaerahAction(page, debouncedQuery);
        setData(response.data);
        setError("");
      } catch {
        setError("Gagal memuat data perangkat daerah.");
      }
    });
  }, [page, debouncedQuery]);

  async function refreshData() {
    const response = await getPerangkatDaerahAction(page, debouncedQuery);
    setData(response.data);
  }

  async function onDelete() {
    if (!deletingId) {
      return;
    }

    startTransition(async () => {
      try {
        await deletePerangkatDaerahAction(deletingId);
        await refreshData();
        setDeletingId(null);
        toast.success("Perangkat daerah berhasil dihapus.");
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal menghapus perangkat daerah.";
        setError(message);
        toast.error(message);
      }
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || undefined,
      slug: String(formData.get("slug") ?? "").trim() || undefined,
    };

    startTransition(async () => {
      try {
        if (!payload.name) {
          setError("Nama perangkat daerah wajib diisi.");
          return;
        }

        if (editing) {
          await updatePerangkatDaerahAction(editing.id, payload);
          toast.success("Perangkat daerah berhasil diperbarui.");
        } else {
          await createPerangkatDaerahAction(payload);
          toast.success("Perangkat daerah berhasil dibuat.");
        }

        await refreshData();
        setError("");
        setModalOpen(false);
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal menyimpan perangkat daerah.";
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
            Tambah Perangkat Daerah
          </button>
        </div>

        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Cari nama, slug, atau deskripsi..."
        />

        <div className="mt-4">
          {loading ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
              <Spinner className="mr-2 h-5 w-5 text-slate-600" />
              Memuat perangkat daerah...
            </div>
          ) : (
            <DataTable
              columns={["Nama", "Slug", "Deskripsi", "Aksi"]}
              rows={data.items.map((item) => [
                item.name,
                item.slug,
                item.description ?? "-",
                <div key={item.id} className="flex gap-2">
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
              emptyLabel="Belum ada data perangkat daerah"
            />
          )}
        </div>

        <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeDisabled={loading}
        title={editing ? "Edit Perangkat Daerah" : "Tambah Perangkat Daerah"}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            name="name"
            defaultValue={editing?.name ?? ""}
            className="field"
            placeholder="Nama perangkat daerah"
            required
            disabled={loading}
          />
          <input
            name="slug"
            defaultValue={editing?.slug ?? ""}
            className="field"
            placeholder="Slug (opsional, auto-generate jika kosong)"
            disabled={loading}
          />
          <textarea
            name="description"
            defaultValue={editing?.description ?? ""}
            className="field min-h-24"
            placeholder="Deskripsi (opsional)"
            disabled={loading}
          />
          {error && <ErrorBanner message={error} />}
          <button className="btn-primary w-full rounded-lg px-4 py-2 font-semibold" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        title="Konfirmasi Hapus"
        description="Perangkat daerah yang dihapus akan menghapus layanan terkait. Lanjutkan?"
        confirmLabel="Ya, hapus"
        loading={loading}
        onCancel={() => setDeletingId(null)}
        onConfirm={onDelete}
      />
    </section>
  );
}
