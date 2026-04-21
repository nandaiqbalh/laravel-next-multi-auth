"use client";

import { DataTable } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Modal } from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { toast } from "sonner";
import { ZodError } from "zod";
import {
  createUserAction,
  deleteUserAction,
  getUsersAction,
  updateUserAction,
} from "@/lib/actions/userActions";
import { createUserSchema, editUserSchema } from "@/validations/user.schema.validation";
import { useDebounce } from "@/lib/services/useDebounce";
import { PaginatedData, Role, User } from "@/lib/types";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/common/InputField";
import { Label } from "@/components/ui/label";

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
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal menghapus user.";
        toast.error(message);
        setError("Gagal menghapus user.");
      }
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values = {
      nik: String(formData.get("nik") ?? ""),
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "") || undefined,
      role_id: String(formData.get("role_id") ?? ""),
    };

    try {
      const validated = editing ? editUserSchema.parse(values) : createUserSchema.parse(values);
      const payload: {
        nik: string;
        name: string;
        email: string;
        role_id: number;
        password?: string;
      } = {
        nik: validated.nik,
        name: validated.name,
        email: validated.email,
        role_id: Number(validated.role_id),
      };

      const createPayload = {
        nik: validated.nik,
        name: validated.name,
        email: validated.email,
        role_id: Number(validated.role_id),
        password: validated.password ?? "",
      };

      const updatePayload: {
        nik: string;
        name: string;
        email: string;
        role_id: number;
        password?: string;
      } = {
        nik: validated.nik,
        name: validated.name,
        email: validated.email,
        role_id: Number(validated.role_id),
      };

      if (validated.password) {
        updatePayload.password = validated.password;
      }

      setError("");

      startTransition(async () => {
        try {
          if (editing) {
            await updateUserAction(editing.id, updatePayload);
            toast.success("User berhasil disimpan.");
          } else {
            await createUserAction(createPayload);
            toast.success("User berhasil dibuat.");
          }

          const response = await getUsersAction(page, debouncedQuery);
          setData(response.data);
          setModalOpen(false);
        } catch (caughtError) {
          const message = caughtError instanceof Error ? caughtError.message : "Gagal menyimpan user.";
          setError(message);
        }
      });
    } catch (caughtError) {
      if (caughtError instanceof ZodError) {
        const validationMessage = caughtError.issues.map((issue) => issue.message).join(" ");
        setError(validationMessage);
        toast.error(validationMessage);
        return;
      }

      throw caughtError;
    }
  }

  return (
    <section className="space-y-4">
      <div className="surface-panel p-4 md:p-6">
        <div className="mb-4 flex justify-end">
          <Button
            type="button"
            onClick={openCreateModal}

            disabled={loading}
          >
            Tambah User
          </Button>
        </div>

        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Cari nama atau email..."
        />


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
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => {
                      setEditing(item);
                      setModalOpen(true);
                    }}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setDeletingId(item.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
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

          <InputField
            id="nik"
            label="NIK"
            name="nik"
            defaultValue={editing?.nik ?? ""}
            placeholder="NIK"
            required
            disabled={loading}
          />

          <InputField
            id="name"
            label="Nama"
            name="name"
            defaultValue={editing?.name ?? ""}
            placeholder="Nama"
            required
            disabled={loading}
          />

          <InputField
            id="email"
            label="Email"
            name="email"
            type="email"
            defaultValue={editing?.email ?? ""}
            placeholder="Email"
            required
            disabled={loading}
          />

          <InputField
            id="password"
            label="Password"
            name="password"
            type="password"
            placeholder={editing ? "Password baru (opsional)" : "Password"}
            required={!editing}
            disabled={loading}
          />

          <div className="space-y-1.5">
            <Label>Role</Label>
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
          </div>

          {error && <ErrorBanner message={error} />}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
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