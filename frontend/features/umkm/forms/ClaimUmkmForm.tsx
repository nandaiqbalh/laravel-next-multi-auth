"use client";

import { submitUmkmClaimAction } from "../../../lib/actions/umkmActions";
import type { UmkmClaim } from "@/features/umkm/types/umkm";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import { ClaimStatusBadge } from "../components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * ClaimUmkmForm renders business verification claim submit panel.
 * @param latestClaim Latest claim data for current user.
 * @returns JSX element.
 *
 * Usage:
 * <ClaimUmkmForm latestClaim={claim} />
 */
export function ClaimUmkmForm({ latestClaim }: { latestClaim: UmkmClaim | null }) {
  const { loading, error, success, run } = useAsyncAction();

  /**
   * Handle claim submission request.
   * @param void
   * @returns Promise<void>
   *
   * Usage:
   * await handleClaim();
   */
  async function handleClaim() {
    await run(async () => {
      await submitUmkmClaimAction();
    });
  }

  const isPending = latestClaim?.status === "pending";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Verifikasi Usaha</CardTitle>
        <CardDescription>Ajukan verifikasi data usaha ke admin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <ClaimStatusBadge status={latestClaim?.status} />
        </div>

        {latestClaim?.catatan_admin ? <p className="text-muted-foreground">Catatan admin: {latestClaim.catatan_admin}</p> : null}
        {error ? <p className="text-destructive">{error}</p> : null}
        {success ? <p className="text-primary">{success}</p> : null}

        <Button type="button" onClick={handleClaim} disabled={loading || isPending} className="bg-primary text-primary-foreground">
          {loading ? "Mengajukan..." : "Ajukan Verifikasi"}
        </Button>
      </CardContent>
    </Card>
  );
}
