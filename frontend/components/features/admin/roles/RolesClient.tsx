"use client";

import { DataTable } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Modal } from "@/components/common/Modal";
import { Pagination } from "@/components/common/Pagination";
import { SearchInput } from "@/components/common/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { toast } from "sonner";
import { ZodError } from "zod";
import {
  createRoleAction,
  deleteRoleAction,
  getRolesAction,
  updateRoleAction,
} from "@/lib/actions/roleActions";
import { getPerangkatDaerahAction } from "@/lib/actions/perangkatDaerahActions";
import { roleSchema } from "@/validations/role.schema.validation";
import { useDebounce } from "@/lib/services/useDebounce";
import { PaginatedData, PerangkatDaerah, Role } from "@/lib/types";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { InputField } from "@/components/common/InputField";

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
  const [perangkatDaerahOptions, setPerangkatDaerahOptions] = useState<PerangkatDaerah[]>([]);

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

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getPerangkatDaerahAction(1, "");
        setPerangkatDaerahOptions(response.data.items);
      } catch {
        // Keep form usable even if perangkat daerah list fails to load.
        setPerangkatDaerahOptions([]);
      }
    });
  }, []);

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
        toast.success("Role berhasil dihapus.");
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal menghapus role.";
        toast.error(message);
        setError("Gagal menghapus role.");
      }
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const perangkatDaerahRaw = String(formData.get("perangkat_daerah_id") ?? "").trim();
    const values = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      perangkat_daerah_id:
        perangkatDaerahRaw === "null" || perangkatDaerahRaw.length === 0
          ? null
          : Number(perangkatDaerahRaw),
    };

    try {
      const payload = roleSchema.parse(values);
      setError("");

      startTransition(async () => {
        try {
          if (editing) {
            await updateRoleAction(editing.id, payload);
            toast.success("Role berhasil disimpan.");
          } else {
            await createRoleAction(payload);
            toast.success("Role berhasil dibuat.");
          }

          const response = await getRolesAction(page, debouncedQuery);
          setData(response.data);
          setModalOpen(false);
        } catch (caughtError) {
          const message = caughtError instanceof Error ? caughtError.message : "Gagal menyimpan role.";
          toast.error(message);
          setModalOpen(false);
          setError("Gagal menyimpan role.");
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
    <section className="surface-panel p-4 md:p-6">
      <section className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            disabled={loading}
          >
            Tambah Role
          </Button>
        </div>
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Cari role..."
        />

        <div className="mt-4">
          {loading ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
              <Spinner className="mr-2 h-5 w-5 text-slate-600" />
              Memuat role...
            </div>
          ) : (
            <DataTable
              columns={["Nama", "Slug", "Perangkat Daerah", "Aksi"]}
              rows={data.items.map((item) => [
                item.name,
                item.slug,
                item.perangkat_daerah?.name ?? "Global",
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
              emptyLabel="Belum ada data role"
            />
          )}
        </div>

      </section>

      <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeDisabled={loading}
        title={editing ? "Edit Role" : "Tambah Role"}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <InputField
            id="role-name"
            label="Nama role"
            name="name"
            defaultValue={editing?.name ?? ""}
            placeholder="Nama role"
            required
            disabled={loading}
          />

          <InputField
            id="role-slug"
            label="Slug role"
            name="slug"
            defaultValue={editing?.slug ?? ""}
            placeholder="Slug role, contoh: admin-dinkop"
            required
            disabled={loading}
          />

          <div className="space-y-1.5">
            <Label>Perangkat daerah</Label>
            <Select
              name="perangkat_daerah_id"
              defaultValue={editing?.perangkat_daerah_id ? String(editing?.perangkat_daerah_id) : "null"}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Global (tidak terkait perangkat daerah)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Global (tidak terkait perangkat daerah)</SelectItem>
                {perangkatDaerahOptions.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <ErrorBanner message={error} />}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
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
