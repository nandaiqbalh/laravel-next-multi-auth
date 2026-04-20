"use client";

import { useState } from "react";
import { processSubmissionAction } from "../../../lib/actions/umkmActions";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SubmissionItem } from "@/features/umkm/types/umkm";

/**
 * AdminSubmissionActions renders admin controls for processing submissions.
 * @param submissionId Submission identifier.
 * @returns JSX element.
 *
 * Usage:
 * <AdminSubmissionActions submissionId={submission.id} />
 */
export function AdminSubmissionActions({ submissionId }: { submissionId: number }) {
  const [status, setStatus] = useState<SubmissionItem["status"]>("dalam_proses");
  const [note, setNote] = useState("");
  const { loading, error, run } = useAsyncAction();

  /**
   * Execute submission processing action.
   * @param void
   * @returns Promise<void>
   *
   * Usage:
   * await handleProcess();
   */
  async function handleProcess() {
    await run(async () => {
      await processSubmissionAction(submissionId, {
        status,
        catatan_admin: note || undefined,
      });
    });
  }

  return (
    <div className="space-y-2">
      <Select value={status} onValueChange={(value) => setStatus(value as SubmissionItem["status"])}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="diajukan">Diajukan</SelectItem>
          <SelectItem value="dalam_proses">Dalam Proses</SelectItem>
          <SelectItem value="revisi">Revisi</SelectItem>
          <SelectItem value="selesai">Selesai</SelectItem>
        </SelectContent>
      </Select>
      <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Catatan admin" />
      {error ? <p className="text-destructive">{error}</p> : null}
      <Button type="button" size="sm" onClick={handleProcess} disabled={loading} className="bg-primary text-primary-foreground">
        {loading ? "Memproses..." : "Simpan"}
      </Button>
    </div>
  );
}
