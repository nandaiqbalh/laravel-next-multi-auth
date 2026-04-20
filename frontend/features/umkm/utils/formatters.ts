import type { SubmissionItem, UmkmClaim } from "@/features/umkm/types/umkm";

/**
 * Format numeric currency string into localized IDR format.
 * @param amount Currency amount as number/string/null.
 * @returns Localized IDR string.
 *
 * Usage:
 * const value = formatRupiah(profile.omzet_tahunan);
 */
export function formatRupiah(amount?: number | string | null): string {
  if (amount === null || amount === undefined || amount === "") {
    return "-";
  }

  const parsed = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(parsed)) {
    return "-";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(parsed);
}

/**
 * Map claim status to label text.
 * @param status Claim status value.
 * @returns Human friendly claim label.
 *
 * Usage:
 * const label = claimStatusLabel(claim.status);
 */
export function claimStatusLabel(status?: UmkmClaim["status"]): string {
  if (status === "approved") {
    return "Disetujui";
  }

  if (status === "rejected") {
    return "Ditolak";
  }

  return "Menunggu Validasi";
}

/**
 * Map submission status to label text.
 * @param status Submission status value.
 * @returns Human friendly submission label.
 *
 * Usage:
 * const label = submissionStatusLabel(submission.status);
 */
export function submissionStatusLabel(status: SubmissionItem["status"]): string {
  const mapping: Record<SubmissionItem["status"], string> = {
    diajukan: "Diajukan",
    dalam_proses: "Dalam Proses",
    revisi: "Perlu Revisi",
    selesai: "Selesai",
  };

  return mapping[status];
}
