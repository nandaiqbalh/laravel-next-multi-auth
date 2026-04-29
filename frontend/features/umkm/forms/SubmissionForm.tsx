"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, WarningCircle, XCircle } from "@phosphor-icons/react";
import type { ManagedService, PerangkatDaerah, ServiceFormField } from "@/lib/types";
import { createSubmissionAction } from "../../../lib/actions/umkmActions";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { serviceFormFieldRepository } from "@/lib/repositories/serviceFormFieldRepository";
import { perangkatDaerahRepository } from "@/lib/repositories/perangkatDaerahRepository";
import { serviceManagementRepository } from "@/lib/repositories/serviceManagementRepository";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SubmissionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, success, run, setError } = useAsyncAction();
  const [perangkatDaerahs, setPerangkatDaerahs] = useState<PerangkatDaerah[]>([]);
  const [perangkatError, setPerangkatError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [fieldsError, setFieldsError] = useState("");
  const [selectedPerangkatSlug, setSelectedPerangkatSlug] = useState("");
  const [services, setServices] = useState<ManagedService[]>([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [fields, setFields] = useState<ServiceFormField[]>([]);
  const [dialogState, setDialogState] = useState<"none" | "profile-missing" | "profile-unverified" | "success">("none");
  const hasPrefilledPerangkat = useRef(false);
  const hasPrefilledService = useRef(false);

  const perangkatParam = searchParams.get("opd_slug")?.trim() ?? "";
  const serviceParam = searchParams.get("service")?.trim() ?? "";

  useEffect(() => {
    let active = true;
    setPerangkatError("");
    perangkatDaerahRepository.listPublic().then((res) => {
      if (!active) return;
      setPerangkatDaerahs(res.data);
    }).catch((err) => {
      if (!active) return;
      setPerangkatError(String(err));
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (hasPrefilledPerangkat.current || !perangkatParam || !perangkatDaerahs.length) {
      return;
    }
    const exists = perangkatDaerahs.some((item) => item.slug === perangkatParam);
    if (!exists) {
      return;
    }
    hasPrefilledPerangkat.current = true;
    setSelectedPerangkatSlug(perangkatParam);
  }, [perangkatDaerahs, perangkatParam]);

  useEffect(() => {
    setServices([]);
    setSelectedServiceId(null);
    setFields([]);
    setServiceError("");
    if (!selectedPerangkatSlug) return;
    hasPrefilledService.current = false;
    let active = true;
    setServiceLoading(true);
    serviceManagementRepository.listPublicBySlug(selectedPerangkatSlug).then((res) => {
      if (!active) return;
      setServices(res.data);
    }).catch((err) => {
      if (!active) return;
      setServiceError(String(err));
    }).finally(() => {
      if (!active) return;
      setServiceLoading(false);
    });
    return () => { active = false; };
  }, [selectedPerangkatSlug]);

  useEffect(() => {
    if (!selectedServiceId) { setFields([]); return; }
    let active = true;
    setFieldsError("");
    serviceFormFieldRepository.listPublic(selectedServiceId).then((res) => {
      if (!active) return;
      setFields(res.data);
    }).catch((err) => {
      if (!active) return;
      setFieldsError(String(err));
    });
    return () => { active = false; };
  }, [selectedServiceId]);

  useEffect(() => {
    if (hasPrefilledService.current || !serviceParam || !services.length || selectedServiceId) {
      return;
    }
    const normalized = serviceParam.toLowerCase();
    const matched = services.find((service) => {
      if (String(service.id) === serviceParam) return true;
      if (service.code?.toLowerCase() === normalized) return true;
      if (service.name?.toLowerCase() === normalized) return true;
      return false;
    });
    if (!matched) {
      return;
    }
    hasPrefilledService.current = true;
    setSelectedServiceId(matched.id);
  }, [serviceParam, services, selectedServiceId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedServiceId) { setFieldsError("Pilih layanan terlebih dahulu."); return; }
    const formData = new FormData(event.currentTarget);
    const payloadData: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "checkbox") { payloadData[field.name] = formData.getAll(field.name).map(String); continue; }
      payloadData[field.name] = String(formData.get(field.name) ?? "").trim();
    }
    const hasDocumentUrlField = fields.some((f) => f.name === "document_url");
    const documentUrl = hasDocumentUrlField ? undefined : String(formData.get("document_url") ?? "").trim();
    let profileMissing = false;
    let profileUnverified = false;
    await run(async () => {
      try {
        await createSubmissionAction({ service_id: selectedServiceId, document_url: documentUrl || undefined, form_data: payloadData });
      } catch (caughtError) {
        const msg = caughtError instanceof Error ? caughtError.message : String(caughtError);
        if (msg.includes("Profil UMKM belum tersedia")) profileMissing = true;
        if (msg.includes("belum diverifikasi")) profileUnverified = true;
        throw caughtError;
      }
    });
    if (profileMissing) { setDialogState("profile-missing"); setError(""); return; }
    if (profileUnverified) { setDialogState("profile-unverified"); setError(""); return; }
    setDialogState("success");
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100";
  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">

        <form onSubmit={handleSubmit} className="divide-y divide-gray-100">

          {/* Step 1 — Pilih OPD & Layanan */}
          <div className="space-y-5 px-6 py-6">
            <div className="space-y-1.5">
              <label className={labelClass}>Perangkat Daerah</label>
              <Select value={selectedPerangkatSlug} onValueChange={setSelectedPerangkatSlug}>
                <SelectTrigger className={inputClass + " cursor-pointer"}>
                  <SelectValue placeholder="Pilih perangkat daerah" />
                </SelectTrigger>
                <SelectContent>
                  {perangkatDaerahs.map((item) => (
                    <SelectItem key={`${item.id}-${item.slug}`} value={item.slug}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {perangkatError && <p className="text-xs text-red-500">{perangkatError}</p>}
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Layanan</label>
              <Select
                name="service_id"
                value={selectedServiceId !== null ? String(selectedServiceId) : ""}
                onValueChange={(v) => setSelectedServiceId(Number(v))}
                disabled={!selectedPerangkatSlug}
              >
                <SelectTrigger className={inputClass + " cursor-pointer disabled:opacity-50"}>
                  <SelectValue placeholder={selectedPerangkatSlug ? "Pilih layanan" : "Pilih perangkat daerah dulu"} />
                </SelectTrigger>
                <SelectContent>
                  {serviceLoading ? (
                    <SelectItem value="loading" disabled>Memuat layanan...</SelectItem>
                  ) : services.length > 0 ? (
                    services.filter((s) => s.id != null).map((s) => (
                      <SelectItem key={`service-${s.id}`} value={String(s.id)}>
                        {s.name || s.code || `Layanan ${s.id}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>Tidak ada layanan tersedia</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {serviceError && <p className="text-xs text-red-500">{serviceError}</p>}
              {!serviceError && selectedPerangkatSlug && !serviceLoading && services.length === 0 && (
                <p className="text-xs text-slate-400">Tidak ada layanan tersedia untuk perangkat daerah ini.</p>
              )}
            </div>
          </div>

          {/* Step 2 — Dynamic fields */}
          {fields.length > 0 && (
            <div className="space-y-5 px-6 py-6">
              {fields.map((field) => {
                const required = field.is_required;
                const placeholder = field.placeholder ?? "";

                if (field.type === "textarea") {
                  return (
                    <div key={field.id} className="space-y-1.5">
                      <label htmlFor={field.name} className={labelClass}>{field.label}</label>
                      <textarea
                        id={field.name}
                        name={field.name}
                        required={required}
                        placeholder={placeholder}
                        className={inputClass + " min-h-28 resize-none"}
                      />
                    </div>
                  );
                }

                if (field.type === "select") {
                  const options = Array.isArray(field.options)
                    ? field.options.map((o) => typeof o === "string" ? o : o.value ?? o.label ?? "")
                    : [];
                  return (
                    <div key={field.id} className="space-y-1.5">
                      <label htmlFor={field.name} className={labelClass}>{field.label}</label>
                      <select id={field.name} name={field.name} required={required} defaultValue="" className={inputClass}>
                        <option value="" disabled>Pilih opsi</option>
                        {options.map((o, i) => <option key={`${field.id}-${o}-${i}`} value={o}>{o}</option>)}
                      </select>
                    </div>
                  );
                }

                if (field.type === "radio") {
                  const options = Array.isArray(field.options)
                    ? field.options.map((o) => typeof o === "string" ? o : o.value ?? o.label ?? "")
                    : [];
                  return (
                    <fieldset key={field.id} className="space-y-2">
                      <legend className={labelClass}>{field.label}</legend>
                      <div className="space-y-2">
                        {options.map((o, i) => (
                          <label key={`${field.id}-${o}-${i}`} className="flex items-center gap-2.5 text-sm text-slate-700">
                            <input type="radio" name={field.name} value={o} required={required} className="accent-sky-600" />
                            {o}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                }

                if (field.type === "checkbox") {
                  const options = Array.isArray(field.options)
                    ? field.options.map((o) => typeof o === "string" ? o : o.value ?? o.label ?? "")
                    : [];
                  return (
                    <fieldset key={field.id} className="space-y-2">
                      <legend className={labelClass}>{field.label}</legend>
                      <div className="space-y-2">
                        {options.map((o, i) => (
                          <label key={`${field.id}-${o}-${i}`} className="flex items-center gap-2.5 text-sm text-slate-700">
                            <input type="checkbox" name={field.name} value={o} className="accent-sky-600" />
                            {o}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                }

                return (
                  <div key={field.id} className="space-y-1.5">
                    <label htmlFor={field.name} className={labelClass}>{field.label}</label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type === "file" ? "url" : field.type}
                      required={required}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {!fields.length && selectedServiceId && (
            <div className="px-6 py-6">
              <p className="text-sm text-slate-400">Tidak ada field form untuk layanan ini.</p>
            </div>
          )}

          {/* Errors & Submit */}
          <div className="flex flex-col gap-3 px-6 py-5">
            {fieldsError && <p className="text-xs text-red-500">{fieldsError}</p>}
            {error && dialogState === "none" && <p className="text-xs text-red-500">{error}</p>}
            {success && <p className="text-xs text-sky-600">{success}</p>}

            <button
              type="submit"
              disabled={loading || !selectedServiceId}
              className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Pengajuan"}
            </button>
          </div>

        </form>
      </div>

      <ConfirmDialog
        open={dialogState !== "none"}
        title={
          dialogState === "success"
            ? "Pengajuan Berhasil"
            : "Pengajuan Gagal"
        }
        description={
          dialogState === "profile-missing"
            ? "Ajukan pengajuan setelah profil UMKM tersedia. Silakan lengkapi profil dan klaim UMKM terlebih dahulu untuk melanjutkan."
            : dialogState === "profile-unverified"
              ? "Profil UMKM belum diverifikasi admin. Silakan tunggu verifikasi untuk melanjutkan pengajuan."
              : "Pengajuan berhasil dikirim. Pantau statusnya di halaman pengajuan."
        }
        icon={
          dialogState === "success"
            ? <CheckCircle className="h-10 w-10 text-emerald-600" />
            : dialogState === "profile-unverified"
              ? <WarningCircle className="h-10 w-10 text-amber-600" />
              : <XCircle className="h-10 w-10 text-destructive" />
        }
        confirmLabel={
          dialogState === "profile-missing"
            ? "Lengkapi Profil UMKM"
            : "Tutup"
        }
        cancelLabel={dialogState === "profile-missing" ? "Tutup" : "OK"}
        onConfirm={() => {
          if (dialogState === "profile-missing") {
            setDialogState("none");
            router.push("/user/profil-umkm");
            return;
          }
          setDialogState("none");
        }}
        onCancel={() => setDialogState("none")}
      />
    </>
  );
}