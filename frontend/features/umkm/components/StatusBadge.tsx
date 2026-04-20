import { Badge } from "@/components/ui/badge";
import { claimStatusLabel, submissionStatusLabel } from "@/features/umkm/utils/formatters";
import type { SubmissionItem, UmkmClaim } from "@/features/umkm/types/umkm";

/**
 * ClaimStatusBadge renders claim status with semantic style.
 * @param status Claim status value.
 * @returns JSX element.
 *
 * Usage:
 * <ClaimStatusBadge status={claim.status} />
 */
export function ClaimStatusBadge({ status }: { status?: UmkmClaim["status"] }) {
  if (status === "approved") {
    return <Badge variant="default">{claimStatusLabel(status)}</Badge>;
  }

  if (status === "rejected") {
    return <Badge variant="destructive">{claimStatusLabel(status)}</Badge>;
  }

  return <Badge variant="secondary">{claimStatusLabel(status)}</Badge>;
}

/**
 * SubmissionStatusBadge renders submission status with semantic style.
 * @param status Submission status value.
 * @returns JSX element.
 *
 * Usage:
 * <SubmissionStatusBadge status={submission.status} />
 */
export function SubmissionStatusBadge({ status }: { status: SubmissionItem["status"] }) {
  if (status === "selesai") {
    return <Badge variant="default">{submissionStatusLabel(status)}</Badge>;
  }

  if (status === "revisi") {
    return <Badge variant="destructive">{submissionStatusLabel(status)}</Badge>;
  }

  if (status === "dalam_proses") {
    return <Badge variant="secondary">{submissionStatusLabel(status)}</Badge>;
  }

  return <Badge variant="outline">{submissionStatusLabel(status)}</Badge>;
}
