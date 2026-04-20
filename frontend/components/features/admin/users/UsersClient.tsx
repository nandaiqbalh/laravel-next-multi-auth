"use client";

import { DataTable } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Modal } from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import {
  createUserAction,
  deleteUserAction,
  getUsersAction,
  updateUserAction,
} from "@/lib/actions/userActions";
import { useDebounce } from "@/lib/services/useDebounce";
import { PaginatedData, Role, User } from "@/lib/types";
import { FormEvent, useEffect, useState, useTransition } from "react";

/**
 * Users client component handles table interactions and CRUD modals.
 */
export function UsersClient({ initialData, roles }: { initialData: PaginatedData<User>; roles: Role[] }) {
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const [page, setPage] = useState(initialData.meta.current_page);
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getUsersAction(page, debouncedQuery);
        setData(response.data);
        setError("");
      } catch {
        setError("Gagal memuat data users.");
      }
    });
  }, [page, debouncedQuery]);

  function openCreateModal() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditing(user);
    setModalOpen(true);
  }

  async function onDelete() {
    if (!deletingId) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteUserAction(deletingId);
        const response = await getUsersAction(page, debouncedQuery);
        setData(response.data);
        setDeletingId(null);
      } catch {
        setError("Gagal menghapus user.");
      }
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      role_id: Number(formData.get("role_id")),
    };

    startTransition(async () => {
      try {
        if (editing) {
          await updateUserAction(editing.id, payload);
        } else {
          await createUserAction(payload);
        }

        const response = await getUsersAction(page, debouncedQuery);
        setData(response.data);
        setModalOpen(false);
      } catch {
        setError("Gagal menyimpan user.");
      }
    });
  }

  return (
    <section className="space-y-4">
      <div className="card p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="page-title">Users Management</h2>
            <p className="page-subtitle">Kelola user dengan pagination dan pencarian.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={loading}
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Tambah User
          </button>
        </div>

        <SearchInput value={query} onChange={setQuery} placeholder="Cari nama atau email..." />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {loading && <p className="mt-3 text-sm text-[var(--primary-dark)]">Loading data...</p>}

        <div className="mt-4">
          <DataTable
            columns={["Nama", "Email", "Role", "Aksi"]}
            rows={data.items.map((item) => [
              item.name,
              item.email,
              item.role?.name ?? "-",
              <div key={item.id} className="flex gap-2">
                <button
                  type="button"
                  className="rounded bg-black px-3 py-1 text-xs text-white"
                  onClick={() => openEditModal(item)}
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
            emptyLabel="Belum ada data user"
          />
        </div>

        <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeDisabled={loading}
        title={editing ? "Edit User" : "Tambah User"}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" defaultValue={editing?.name ?? ""} className="field" placeholder="Nama" required disabled={loading} />
          <input
            name="email"
            type="email"
            defaultValue={editing?.email ?? ""}
            className="field"
            placeholder="Email"
            required
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            className="field"
            placeholder={editing ? "Password baru (opsional)" : "Password"}
            required={!editing}
            disabled={loading}
          />
          <select
            name="role_id"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-green-200"
            defaultValue={editing?.role_id ?? roles[0]?.id}
            required
            disabled={loading}
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <button className="btn-primary w-full rounded-lg px-4 py-2 font-semibold" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        title="Konfirmasi hapus user"
        description="Data user yang dihapus tidak bisa dikembalikan. Lanjutkan?"
        confirmLabel="Ya, hapus"
        loading={loading}
        onCancel={() => setDeletingId(null)}
        onConfirm={onDelete}
      />
    </section>
  );
}
