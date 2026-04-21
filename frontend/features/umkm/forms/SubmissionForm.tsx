"use client";

import { FormEvent } from "react";
import type { ServiceItem } from "@/features/umkm/types/umkm";
import { createSubmissionAction } from "../../../lib/actions/umkmActions";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * SubmissionForm renders service submission form with Google Drive document URL.
 * @param services Service catalog list.
 * @returns JSX element.
 *
 * Usage:
 * <SubmissionForm services={services} />
 */
export function SubmissionForm({ services }: { services: ServiceItem[] }) {
  const { loading, error, success, run } = useAsyncAction();

  /**
   * Handle service submission form post.
   * @param event Form submit event.
   * @returns Promise<void>
   *
   * Usage:
   * <form onSubmit={handleSubmit}>...</form>
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await run(async () => {
      await createSubmissionAction({
        service_id: Number(formData.get("service_id") ?? 0),
        document_url: String(formData.get("document_url") ?? ""),
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajukan Layanan</CardTitle>
        <CardDescription>Pengajuan hanya bisa dilakukan setelah claim verifikasi disetujui admin.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service_id">Layanan</Label>
            <Select name="service_id" defaultValue={services[0] ? String(services[0].id) : undefined}>
              <SelectTrigger className="w-full" id="service_id">
                <SelectValue placeholder="Pilih layanan" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.code} - {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_url">URL Dokumen (Google Drive)</Label>
            <Input id="document_url" name="document_url" placeholder="https://drive.google.com/..." required />
          </div>

          {error ? <p className="text-destructive">{error}</p> : null}
          {success ? <p className="text-primary">{success}</p> : null}

          <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
            {loading ? "Mengirim..." : "Kirim Pengajuan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
