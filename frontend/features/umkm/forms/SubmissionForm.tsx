"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "@phosphor-icons/react";
import type { ManagedService, PerangkatDaerah, ServiceFormField } from "@/lib/types";
import { createSubmissionAction } from "../../../lib/actions/umkmActions";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { serviceFormFieldRepository } from "@/lib/repositories/serviceFormFieldRepository";
import { perangkatDaerahRepository } from "@/lib/repositories/perangkatDaerahRepository";
import { serviceManagementRepository } from "@/lib/repositories/serviceManagementRepository";

/**
 * SubmissionForm renders service submission form with dynamic perangkat daerah and layanan selection.
 * @returns JSX element.
 *
 * Usage:
 * <SubmissionForm />
 */
export function SubmissionForm() {
  const router = useRouter();
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
  const [showProfileMissingDialog, setShowProfileMissingDialog] = useState(false);

  useEffect(() => {
    let active = true;
    setPerangkatError("");

    perangkatDaerahRepository
      .listPublic()
      .then((response) => {
        if (!active) return;
        setPerangkatDaerahs(response.data);
      })
      .catch((fetchError) => {
        if (!active) return;
        setPerangkatError(String(fetchError));
        setPerangkatDaerahs([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setServices([]);
    setSelectedServiceId(null);
    setFields([]);
    setServiceError("");
    setServiceLoading(false);

    if (!selectedPerangkatSlug) {
      return;
    }

    let active = true;
    setServiceLoading(true);

    serviceManagementRepository
      .listPublicBySlug(selectedPerangkatSlug)
      .then((response) => {
        if (!active) return;
        setServices(response.data);
      })
      .catch((fetchError) => {
        if (!active) return;
        setServiceError(String(fetchError));
        setServices([]);
      })
      .finally(() => {
        if (!active) return;
        setServiceLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedPerangkatSlug]);

  useEffect(() => {
    if (!selectedServiceId) {
      setFields([]);
      return;
    }

    let active = true;
    setFieldsError("");

    serviceFormFieldRepository
      .listPublic(selectedServiceId)
      .then((response) => {
        if (!active) return;
        setFields(response.data);
      })
      .catch((fetchError) => {
        if (!active) return;
        setFieldsError(String(fetchError));
        setFields([]);
      });

    return () => {
      active = false;
    };
  }, [selectedServiceId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedServiceId) {
      setFieldsError("Pilih layanan terlebih dahulu.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payloadData: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.type === "checkbox") {
        payloadData[field.name] = formData.getAll(field.name).map(String);
        continue;
      }

      payloadData[field.name] = String(formData.get(field.name) ?? "").trim();
    }

    const hasDocumentUrlField = fields.some((field) => field.name === "document_url");
    const documentUrl = hasDocumentUrlField ? undefined : String(formData.get("document_url") ?? "").trim();
    let profileMissing = false;

    await run(async () => {
      try {
        await createSubmissionAction({
          service_id: selectedServiceId,
          document_url: documentUrl || undefined,
          form_data: payloadData,
        });
      } catch (caughtError) {
        const submissionMessage = caughtError instanceof Error ? caughtError.message : String(caughtError);
        if (submissionMessage.includes("Profil UMKM belum tersedia")) {
          profileMissing = true;
        }
        throw caughtError;
      }
    });

    if (profileMissing) {
      setShowProfileMissingDialog(true);
      setError("");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajukan Layanan</CardTitle>
        <CardDescription>Pilih perangkat daerah terlebih dahulu, lalu pilih layanan untuk melihat form dinamis.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="perangkat_daerah">Perangkat Daerah</Label>
              <Select
                value={selectedPerangkatSlug}
                onValueChange={(value) => setSelectedPerangkatSlug(value)}
              >
                <SelectTrigger id="perangkat_daerah" className="w-full">
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
              {perangkatError ? <p className="text-destructive">{perangkatError}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_id">Layanan</Label>
              <Select
                name="service_id"
                value={selectedServiceId !== null ? String(selectedServiceId) : ""}
                onValueChange={(value) => setSelectedServiceId(Number(value))}
                disabled={!selectedPerangkatSlug}
              >
                <SelectTrigger className="w-full" id="service_id">
                  <SelectValue placeholder={selectedPerangkatSlug ? "Pilih layanan" : "Pilih perangkat daerah dulu"} />
                </SelectTrigger>
                <SelectContent>
                  {serviceLoading ? (
                    <SelectItem value="loading" disabled>
                      Memuat layanan...
                    </SelectItem>
                  ) : services.length > 0 ? (
                    services
                      .filter((service) => service.id != null)
                      .map((service) => {
                        const label = service.name || service.code || `Layanan ${service.id}`;
                        const key = `service-${service.id}`;

                        return (
                          <SelectItem key={key} value={String(service.id)}>
                            {label}
                          </SelectItem>
                        );
                      })
                  ) : (
                    <SelectItem value="empty" disabled>
                      Tidak ada layanan tersedia
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {serviceError ? <p className="text-destructive">{serviceError}</p> : null}
              {!serviceError && selectedPerangkatSlug && !serviceLoading && services.length === 0 ? (
                <p className="text-sm text-slate-500">Tidak ada layanan tersedia untuk perangkat daerah ini.</p>
              ) : null}
            </div>
          </div>

          {fieldsError ? <p className="text-destructive">{fieldsError}</p> : null}
          {error && !showProfileMissingDialog ? <p className="text-destructive">{error}</p> : null}

          {fields.length > 0 ? (
            fields.map((field) => {
              const required = field.is_required;
              const placeholder = field.placeholder ?? "";

              if (field.type === "textarea") {
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <textarea
                      id={field.name}
                      name={field.name}
                      required={required}
                      placeholder={placeholder}
                      className="field min-h-24"
                    />
                  </div>
                );
              }

              if (field.type === "select") {
                const options = Array.isArray(field.options)
                  ? field.options.map((option) =>
                      typeof option === "string"
                        ? option
                        : option.value ?? option.label ?? "",
                    )
                  : [];
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <select id={field.name} name={field.name} required={required} className="field" defaultValue="">
                      <option value="" disabled>
                        Pilih opsi
                      </option>
                      {options.map((option, optionIndex) => (
                        <option key={`${field.id}-${option}-${optionIndex}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === "radio") {
                const options = Array.isArray(field.options)
                  ? field.options.map((option) =>
                      typeof option === "string"
                        ? option
                        : option.value ?? option.label ?? "",
                    )
                  : [];
                return (
                  <fieldset key={field.id} className="space-y-2">
                    <legend className="text-sm font-semibold text-slate-800">{field.label}</legend>
                    <div className="space-y-2">
                      {options.map((option, optionIndex) => (
                        <label key={`${field.id}-${option}-${optionIndex}`} className="flex items-center gap-2 text-sm text-slate-700">
                          <input type="radio" name={field.name} value={option} required={required} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              }

              if (field.type === "checkbox") {
                const options = Array.isArray(field.options)
                  ? field.options.map((option) =>
                      typeof option === "string"
                        ? option
                        : option.value ?? option.label ?? "",
                    )
                  : [];
                return (
                  <fieldset key={field.id} className="space-y-2">
                    <legend className="text-sm font-semibold text-slate-800">{field.label}</legend>
                    <div className="space-y-2">
                      {options.map((option, optionIndex) => (
                        <label key={`${field.id}-${option}-${optionIndex}`} className="flex items-center gap-2 text-sm text-slate-700">
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
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={inputType}
                    required={required}
                    placeholder={placeholder}
                    className="field"
                  />
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">Pilih layanan untuk melihat form dinamis.</p>
          )}

        
          {error ? <p className="text-destructive">{error}</p> : null}
          {success ? <p className="text-primary">{success}</p> : null}

          <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
            {loading ? "Mengirim..." : "Kirim Pengajuan"}
          </Button>
        </form>
      </CardContent>

      <ConfirmDialog
        open={showProfileMissingDialog}
        title="Pengajuan Gagal"
        description="Ajukan pengajuan setelah profil UMKM tersedia. Silakan lengkapi profil dan klaim UMKM terlebih dahulu untuk melanjutkan."
        icon={<XCircle className="h-10 w-10 text-destructive" />}
        confirmLabel="Lengkapi Profil UMKM"
        cancelLabel="Tutup"
        onConfirm={() => {
          setShowProfileMissingDialog(false);
          router.push("/user/profil-umkm");
        }}
        onCancel={() => setShowProfileMissingDialog(false)}
      />
    </Card>
  );
}
