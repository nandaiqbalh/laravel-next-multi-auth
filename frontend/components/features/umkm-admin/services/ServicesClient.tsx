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
import { Switch } from "@/components/ui/switch";
import {
  createManagedServiceAction,
  deleteManagedServiceAction,
  getManagedServicesAction,
  updateManagedServiceAction,
} from "@/lib/actions/serviceManagementActions";
import { useDebounce } from "@/lib/services/useDebounce";
import { ManagedService, PaginatedData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/common/InputField";

export function ServicesClient({
  initialData,
  currentPerangkatDaerahId,
  currentPerangkatDaerahName,
}: {
  initialData: PaginatedData<ManagedService>;
  currentPerangkatDaerahId?: number;
  currentPerangkatDaerahName?: string;
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
      perangkat_daerah_id: currentPerangkatDaerahId ?? 0,
      is_active: formData.get("is_active") !== null,
    };

    startTransition(async () => {
      try {
        if (!payload.code || !payload.name) {
          setError("Kode dan nama layanan wajib diisi.");
          return;
        }

        if (payload.perangkat_daerah_id < 1) {
          setError(
            currentPerangkatDaerahName
              ? `Perangkat daerah ${currentPerangkatDaerahName} belum tersedia untuk admin saat ini.`
              : "Perangkat daerah admin belum tersedia. Silakan login ulang atau hubungi administrator."
          );
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
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setError("");
              setModalOpen(true);
            }}
            disabled={loading}
          >
            Tambah Layanan
          </Button>
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

          <InputField
            id="code"
            label="Code"
            name="code"
            defaultValue={editing?.code ?? ""}
            placeholder="Kode layanan"
            required
            disabled={loading}
          />

          <InputField
            id="name"
            label="Name"
            name="name"
            defaultValue={editing?.name ?? ""}
            placeholder="Nama layanan"
            required
            disabled={loading}
          />

          <div className="space-y-1">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <span>Status</span>
              <Switch
                name="is_active"
                defaultChecked={Boolean(editing?.is_active)}
                disabled={loading}
              />
              <span className="text-sm text-slate-600">
                {editing?.is_active ? "Aktif" : "Nonaktif"}
              </span>
            </label>
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
