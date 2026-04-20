"use client";

import { useState } from "react";
import { processClaimAction } from "../../../lib/actions/umkmActions";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/**
 * AdminClaimActions renders admin controls for processing UMKM claim.
 * @param claimId Claim identifier.
 * @returns JSX element.
 *
 * Usage:
 * <AdminClaimActions claimId={claim.id} />
 */
export function AdminClaimActions({ claimId }: { claimId: number }) {
  const [status, setStatus] = useState<"approved" | "rejected">("approved");
  const [note, setNote] = useState("");
  const { loading, error, run } = useAsyncAction();

  /**
   * Execute claim processing action.
   * @param void
   * @returns Promise<void>
   *
   * Usage:
   * await handleProcess();
   */
  async function handleProcess() {
    await run(async () => {
      await processClaimAction(claimId, {
        status,
        catatan_admin: note || undefined,
      });
    });
  }

  return (
    <div className="space-y-2">
      <Select value={status} onValueChange={(value) => setStatus(value as "approved" | "rejected")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="approved">Approve</SelectItem>
          <SelectItem value="rejected">Reject</SelectItem>
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
