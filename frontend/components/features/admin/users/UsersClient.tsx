"use client";

import { DataTable } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Modal } from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
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
        toast.success("User berhasil dihapus.");
      } catch {
        toast.error("Gagal menghapus user.");
        setError("Gagal menghapus user.");
      }
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const nikValue = String(formData.get("nik") ?? "");
    const emailValue = String(formData.get("email") ?? "");
    const passwordValue = String(formData.get("password") ?? "");

    const payload: {
      nik: string;
      name: string;
      email: string;
      role_id: number;
      password?: string;
    } = {
      nik: nikValue,
      name: String(formData.get("name") ?? ""),
      email: emailValue,
      role_id: Number(formData.get("role_id")),
    };

    if (passwordValue) {
      payload.password = passwordValue;
    }

    startTransition(async () => {
      try {
        if (editing) {
          await updateUserAction(editing.id, payload);
          toast.success("User berhasil disimpan.");
        } else {
          await createUserAction(payload);
          toast.success("User berhasil dibuat.");
        }

        const response = await getUsersAction(page, debouncedQuery);
        setData(response.data);
        setModalOpen(false);
      } catch {
        setModalOpen(false);
        toast.error("Gagal menyimpan user.");
        setError("Gagal menyimpan user.");
      }
    });
  }

  return (
    <section className="space-y-4">
      <div className="surface-panel p-4 md:p-6">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={openCreateModal}
            disabled={loading}
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Tambah User
          </button>
        </div>

        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Cari nama atau email..."
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4">
          {loading ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
              <Spinner className="mr-2 h-5 w-5 text-slate-600" />
              Memuat user...
            </div>
          ) : (
            <DataTable
              columns={["NIK", "Nama", "Email", "Role", "Aksi"]}
              rows={data.items.map((item) => [
                item.nik,
                item.name,
                item.email,
                item.role?.name ?? "-",
                <div key={item.id} className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--primary-dark)]"
                    onClick={() => openEditModal(item)}
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
              emptyLabel="Belum ada data user"
            />
          )}
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
            <input name="nik" defaultValue={editing?.nik ?? ""} className="field" placeholder="NIK" required disabled={loading} />
            <input name="name" defaultValue={editing?.name ?? ""} className="field" placeholder="Nama" required disabled={loading} />
            <input name="email" defaultValue={editing?.email ?? ""} className="field" placeholder="Email" type="email" required disabled={loading} />
            <input
              name="password"
              type="password"
              className="field"
              placeholder={editing ? "Password baru (opsional)" : "Password"}
              required={!editing}
              disabled={loading}
            />
            <Select name="role_id" defaultValue={String(editing?.role_id ?? roles[0]?.id)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
