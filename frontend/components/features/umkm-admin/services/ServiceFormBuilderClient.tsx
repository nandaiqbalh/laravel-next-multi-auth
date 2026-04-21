"use client";

import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DataTable } from "@/components/common/DataTable";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { Modal } from "@/components/common/Modal";
import {
  createServiceFormFieldAction,
  deleteServiceFormFieldAction,
  reorderServiceFormFieldAction,
  updateServiceFormFieldAction,
} from "@/lib/actions/serviceManagementActions";
import { ServiceFormField } from "@/lib/types";

const FIELD_TYPE_OPTIONS = ["text", "textarea", "select", "number", "date", "file", "radio", "checkbox", "email", "tel"];

export function ServiceFormBuilderClient({
  serviceId,
  initialFields,
}: {
  serviceId: number;
  initialFields: ServiceFormField[];
}) {
  const [fields, setFields] = useState(initialFields);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceFormField | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function parseOptions(raw: string): string[] | undefined {
    const values = raw
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean);

    return values.length ? values : undefined;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      label: String(formData.get("label") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      type: String(formData.get("type") ?? "text").trim(),
      is_required: String(formData.get("is_required") ?? "0") === "1",
      options: parseOptions(String(formData.get("options") ?? "")),
      order: Number(formData.get("order") ?? fields.length + 1),
      placeholder: String(formData.get("placeholder") ?? "").trim() || undefined,
    };

    startTransition(async () => {
      try {
        if (!payload.label || !payload.name) {
          setError("Label dan name wajib diisi.");
          return;
        }

        if ((payload.type === "select" || payload.type === "radio") && !payload.options?.length) {
          setError("Options wajib diisi untuk tipe select/radio.");
          return;
        }

        if (editing) {
          const response = await updateServiceFormFieldAction(serviceId, editing.id, payload);
          setFields((prev) => prev.map((item) => (item.id === response.data.id ? response.data : item)));
          toast.success("Field berhasil diperbarui.");
        } else {
          const response = await createServiceFormFieldAction(serviceId, payload);
          setFields((prev) => [...prev, response.data].sort((a, b) => a.order - b.order));
          toast.success("Field berhasil dibuat.");
        }

        setError("");
        setModalOpen(false);
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal menyimpan field.";
        setError(message);
        toast.error(message);
      }
    });
  }

  async function onDelete() {
    if (!deletingId) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteServiceFormFieldAction(serviceId, deletingId);
        setFields((prev) => prev.filter((item) => item.id !== deletingId));
        setDeletingId(null);
        toast.success("Field berhasil dihapus.");
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal menghapus field.";
        setError(message);
        toast.error(message);
      }
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= fields.length) {
      return;
    }

    const next = [...fields];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);

    const reordered = next.map((entry, orderIndex) => ({ ...entry, order: orderIndex + 1 }));
    setFields(reordered);

    startTransition(async () => {
      try {
        await reorderServiceFormFieldAction(
          serviceId,
          reordered.map((entry) => ({ id: entry.id, order: entry.order })),
        );
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal mengubah urutan field.";
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
            Tambah Field
          </button>
        </div>

        <DataTable
          columns={["Order", "Label", "Name", "Type", "Required", "Aksi"]}
          rows={fields
            .sort((a, b) => a.order - b.order)
            .map((item, index) => [
              item.order,
              item.label,
              item.name,
              item.type,
              item.is_required ? "Ya" : "Tidak",
              <div key={item.id} className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  disabled={loading || index === 0}
                  onClick={() => move(index, -1)}
                >
                  Naik
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  disabled={loading || index === fields.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Turun
                </button>
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
          emptyLabel="Belum ada field untuk layanan ini"
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeDisabled={loading}
        title={editing ? "Edit Field" : "Tambah Field"}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="label" defaultValue={editing?.label ?? ""} className="field" placeholder="Label" required disabled={loading} />
          <input name="name" defaultValue={editing?.name ?? ""} className="field" placeholder="Name (snake_case)" required disabled={loading} />
          <select name="type" defaultValue={editing?.type ?? "text"} className="field" required disabled={loading}>
            {FIELD_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select name="is_required" defaultValue={editing?.is_required ? "1" : "0"} className="field" disabled={loading}>
            <option value="1">Wajib diisi</option>
            <option value="0">Opsional</option>
          </select>
          <input
            name="order"
            type="number"
            min={1}
            defaultValue={editing?.order ?? fields.length + 1}
            className="field"
            required
            disabled={loading}
          />
          <input
            name="placeholder"
            defaultValue={editing?.placeholder ?? ""}
            className="field"
            placeholder="Placeholder (opsional)"
            disabled={loading}
          />
          <textarea
            name="options"
            defaultValue={Array.isArray(editing?.options) ? editing?.options.map((opt) => String(opt)).join("\n") : ""}
            className="field min-h-24"
            placeholder="Opsi per baris (untuk select/radio)"
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
        title="Konfirmasi Hapus Field"
        description="Field yang dihapus tidak bisa dikembalikan. Lanjutkan?"
        confirmLabel="Ya, hapus"
        loading={loading}
        onCancel={() => setDeletingId(null)}
        onConfirm={onDelete}
      />
    </section>
  );
}
