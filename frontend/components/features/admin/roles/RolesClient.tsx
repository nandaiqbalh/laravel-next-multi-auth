"use client";

import { DataTable } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Modal } from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import {
  createRoleAction,
  deleteRoleAction,
  getRolesAction,
  updateRoleAction,
} from "@/lib/actions/roleActions";
import { useDebounce } from "@/lib/services/useDebounce";
import { PaginatedData, Role } from "@/lib/types";
import { FormEvent, useEffect, useState, useTransition } from "react";

/**
 * Roles client component handles table interactions and CRUD modals.
 */
export function RolesClient({ initialData }: { initialData: PaginatedData<Role> }) {
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [page, setPage] = useState(initialData.meta.current_page);
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getRolesAction(page, debouncedQuery);
        setData(response.data);
        setError("");
      } catch {
        setError("Gagal memuat data roles.");
      }
    });
  }, [page, debouncedQuery]);

  async function onDelete() {
    if (!deletingId) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteRoleAction(deletingId);
        const response = await getRolesAction(page, debouncedQuery);
        setData(response.data);
        setDeletingId(null);
      } catch {
        setError("Gagal menghapus role.");
      }
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = { name: String(formData.get("name") ?? "") };

    startTransition(async () => {
      try {
        if (editing) {
          await updateRoleAction(editing.id, payload);
        } else {
          await createRoleAction(payload);
        }

        const response = await getRolesAction(page, debouncedQuery);
        setData(response.data);
        setModalOpen(false);
      } catch {
        setError("Gagal menyimpan role.");
      }
    });
  }

  return (
    <section className="card p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="page-title">Roles Management</h2>
          <p className="page-subtitle">Kelola role dengan pagination dan pencarian.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          disabled={loading}
          className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Tambah Role
        </button>
      </div>

      <SearchInput value={query} onChange={setQuery} placeholder="Cari role..." />

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-3 text-sm text-[var(--primary-dark)]">Loading data...</p>}

      <div className="mt-4">
        <DataTable
          columns={["Nama", "Aksi"]}
          rows={data.items.map((item) => [
            item.name,
            <div key={item.id} className="flex gap-2">
              <button
                type="button"
                className="rounded bg-black px-3 py-1 text-xs text-white"
                onClick={() => {
                  setEditing(item);
                  setModalOpen(true);
                }}
                disabled={loading}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded bg-red-600 px-3 py-1 text-xs text-white"
                onClick={() => setDeletingId(item.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>,
          ])}
          emptyLabel="Belum ada data role"
        />
      </div>

      <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeDisabled={loading}
        title={editing ? "Edit Role" : "Tambah Role"}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            name="name"
            defaultValue={editing?.name ?? ""}
            className="field"
            placeholder="Nama role"
            required
            disabled={loading}
          />
          <button className="btn-primary w-full rounded-lg px-4 py-2 font-semibold" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        title="Konfirmasi hapus role"
        description="Role yang dihapus tidak bisa dikembalikan. Lanjutkan?"
        confirmLabel="Ya, hapus"
        loading={loading}
        onCancel={() => setDeletingId(null)}
        onConfirm={onDelete}
      />
    </section>
  );
}
