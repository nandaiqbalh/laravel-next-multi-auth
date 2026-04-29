"use client";

import { getProfileByNikAction, submitUmkmClaimAction } from "../../../lib/actions/umkmActions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, WarningCircle } from "@phosphor-icons/react";
import type { UmkmClaim } from "@/features/umkm/types/umkm";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import { ClaimStatusBadge } from "../components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { claimStatusLabel } from "@/features/umkm/utils/formatters";

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
  const [profileReady, setProfileReady] = useState<boolean | null>(null);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    let active = true;

    getProfileByNikAction()
      .then((profile) => {
        if (!active) return;
        setProfileReady(Boolean(profile));
        setProfileMessage("");
      })
      .catch(() => {
        if (!active) return;
        setProfileReady(false);
        setProfileMessage("Profil UMKM belum ditemukan. Lengkapi profil terlebih dahulu.");
      });

    return () => {
      active = false;
    };
  }, []);

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
  const isApproved = latestClaim?.status === "approved";
  const isRejected = latestClaim?.status === "rejected";
  const isBlocked = profileReady === false;
  const hasClaim = Boolean(latestClaim?.status);

  const statusLabel = hasClaim ? claimStatusLabel(latestClaim?.status) : "Belum Ajukan";
  const panelTone = isBlocked
    ? "border-amber-200 bg-amber-50/70"
    : isApproved
      ? "border-emerald-200 bg-emerald-50/70"
      : isRejected
        ? "border-rose-200 bg-rose-50/70"
        : isPending
          ? "border-sky-200 bg-sky-50/70"
          : "border-slate-200 bg-slate-50/70";
  const PanelIcon = isBlocked || isRejected ? WarningCircle : isApproved ? CheckCircle : Clock;
  const panelTitle = isBlocked
    ? "Profil UMKM belum tersedia"
    : isApproved
      ? "Verifikasi disetujui"
      : isRejected
        ? "Verifikasi ditolak"
        : isPending
          ? "Verifikasi sedang diproses"
          : "Belum ada pengajuan verifikasi";
  const panelDescription = isBlocked
    ? "Lengkapi profil UMKM agar bisa mengajukan verifikasi ke admin."
    : isApproved
      ? "Data usaha Anda sudah diverifikasi."
      : isRejected
        ? "Periksa catatan admin dan ajukan ulang setelah perbaikan."
        : isPending
          ? "Mohon tunggu, pengajuan Anda sedang diperiksa admin."
          : "Ajukan verifikasi agar layanan bisa diproses lebih cepat.";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Verifikasi Usaha</CardTitle>
        <CardDescription>Ajukan verifikasi data usaha ke admin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-2xl border px-4 py-4 ${panelTone}`}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700">
              <PanelIcon size={18} weight="fill" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{panelTitle}</p>
              <p className="text-sm text-slate-600">{panelDescription}</p>
            </div>
          </div>
          {latestClaim?.catatan_admin ? (
            <div className="mt-3 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700">
              Catatan admin: {latestClaim.catatan_admin}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            Status claim
            {hasClaim ? <ClaimStatusBadge status={latestClaim?.status} /> : <span className="text-slate-500">Belum Ajukan</span>}
          </div>
          {profileReady === null ? (
            <span className="text-xs text-slate-400">Memeriksa profil UMKM...</span>
          ) : null}
        </div>

        {profileMessage ? (
          <p className="text-sm text-amber-700">
            {profileMessage} <Link href="/user/profil-umkm" className="font-semibold underline">Isi profil</Link>
          </p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

        <div className="flex flex-wrap items-center gap-3">
          {!isApproved ? (
            <Button
              type="button"
              onClick={handleClaim}
              disabled={loading || isPending || isBlocked || profileReady === null}
              className="bg-primary text-primary-foreground"
            >
              {loading ? "Mengajukan..." : isRejected ? "Ajukan Ulang" : "Ajukan Verifikasi"}
            </Button>
          ) : (
            <Button type="button" disabled className="bg-emerald-600 text-white">
              Terverifikasi
            </Button>
          )}
          {isPending ? <span className="text-xs text-slate-500">Pengajuan sedang diproses.</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
