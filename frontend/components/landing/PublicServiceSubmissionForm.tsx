"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { createSubmissionAction } from "@/lib/actions/umkmActions";
import { ManagedService, ServiceFormField } from "@/lib/types";

export function PublicServiceSubmissionForm({
  service,
  fields,
  canSubmit,
}: {
  service: ManagedService;
  fields: ServiceFormField[];
  canSubmit: boolean;
}) {
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payloadData: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.type === "checkbox") {
        payloadData[field.name] = formData.getAll(field.name).map(String);
        continue;
      }

      payloadData[field.name] = String(formData.get(field.name) ?? "").trim();
    }

    const documentUrl = String(formData.get("document_url") ?? "").trim() || undefined;

    startTransition(async () => {
      try {
        await createSubmissionAction({
          service_id: service.id,
          document_url: documentUrl ?? "",
          form_data: payloadData,
        });
        setError("");
        toast.success("Pengajuan berhasil dikirim.");
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Gagal mengirim pengajuan.";
        setError(message);
        toast.error(message);
      }
    });
  }

  if (!canSubmit) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Login sebagai pengguna diperlukan untuk mengirim pengajuan.
        <div className="mt-3">
          <Link href="/login" className="rounded-lg bg-amber-600 px-3 py-2 font-semibold text-white hover:bg-amber-700">
            Masuk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => {
        const required = field.is_required;
        const commonClass = "field";

        if (field.type === "textarea") {
          return (
            <div key={field.id} className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800" htmlFor={field.name}>
                {field.label}
              </label>
              <textarea id={field.name} name={field.name} required={required} placeholder={field.placeholder ?? ""} className={`${commonClass} min-h-24`} />
            </div>
          );
        }

        if (field.type === "select") {
          const options = Array.isArray(field.options) ? field.options.map(String) : [];

          return (
            <div key={field.id} className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800" htmlFor={field.name}>
                {field.label}
              </label>
              <select id={field.name} name={field.name} required={required} className={commonClass} defaultValue="">
                <option value="" disabled>
                  Pilih opsi
                </option>
                {options.map((option) => (
                  <option key={`${field.id}-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "radio") {
          const options = Array.isArray(field.options) ? field.options.map(String) : [];

          return (
            <fieldset key={field.id} className="space-y-2">
              <legend className="text-sm font-semibold text-slate-800">{field.label}</legend>
              <div className="space-y-2">
                {options.map((option) => (
                  <label key={`${field.id}-${option}`} className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="radio" name={field.name} value={option} required={required} />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }

        if (field.type === "checkbox") {
          const options = Array.isArray(field.options) ? field.options.map(String) : [];

          return (
            <fieldset key={field.id} className="space-y-2">
              <legend className="text-sm font-semibold text-slate-800">{field.label}</legend>
              <div className="space-y-2">
                {options.map((option) => (
                  <label key={`${field.id}-${option}`} className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name={field.name} value={option} />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }

        const inputType = field.type === "file" ? "url" : field.type;

        return (
          <div key={field.id} className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800" htmlFor={field.name}>
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={inputType}
              required={required}
              placeholder={field.placeholder ?? ""}
              className={commonClass}
            />
          </div>
        );
      })}

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-800" htmlFor="document_url">
          URL Dokumen Pendukung (opsional)
        </label>
        <input id="document_url" name="document_url" type="url" className="field" placeholder="https://drive.google.com/..." />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? "Mengirim..." : "Kirim Pengajuan"}
      </button>
    </form>
  );
}
