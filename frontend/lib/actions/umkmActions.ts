"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { UmkmProfile } from "@/features/umkm/types/umkm";
import { umkmService } from "@/features/umkm/services/umkmService";

/**
 * Resolve authenticated bearer token from current session.
 * @returns Session token string.
 *
 * Usage:
 * const token = await getTokenOrThrow();
 */
async function getTokenOrThrow(): Promise<string> {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return session.token;
}

/**
 * Save UMKM profile and refresh related user/admin pages.
 * @param payload UMKM profile payload.
 * @returns Saved profile object.
 *
 * Usage:
 * await saveUmkmProfileAction(payload);
 */
export async function saveUmkmProfileAction(payload: Partial<UmkmProfile>) {
  const token = await getTokenOrThrow();
  const profile = await umkmService.saveMyProfile(token, payload);

  revalidatePath("/user/profil-umkm");
  revalidatePath("/user/dashboard");
  revalidatePath("/admin/data-umkm");

  return profile;
}

/**
 * Submit UMKM claim and refresh related claim pages.
 * @returns Created claim data.
 *
 * Usage:
 * await submitUmkmClaimAction();
 */
export async function submitUmkmClaimAction() {
  const token = await getTokenOrThrow();
  const claim = await umkmService.submitClaim(token);

  revalidatePath("/user/dashboard");
  revalidatePath("/user/profil-umkm");
  revalidatePath("/admin/pengajuan");

  return claim;
}

/**
 * Create user submission and refresh submission pages.
 * @param payload Submission payload.
 * @returns Created submission data.
 *
 * Usage:
 * await createSubmissionAction({ service_id: 1, document_url: "https://..." });
 */
export async function createSubmissionAction(payload: {
  service_id: number;
  document_url?: string;
  form_data?: Record<string, unknown>;
}) {
  const token = await getTokenOrThrow();
  const submission = await umkmService.createSubmission(token, payload);

  revalidatePath("/user/pengajuan");
  revalidatePath("/admin/pengajuan");
  revalidatePath("/admin/rekap");

  return submission;
}

/**
 * Process claim decision and refresh admin/user related pages.
 * @param claimId Claim identifier.
 * @param payload Claim decision payload.
 * @returns Updated claim data.
 *
 * Usage:
 * await processClaimAction(1, { status: "approved" });
 */
export async function processClaimAction(
  claimId: number,
  payload: { status: "approved" | "rejected"; catatan_admin?: string },
) {
  const token = await getTokenOrThrow();
  const claim = await umkmService.processClaim(token, claimId, payload);

  revalidatePath("/admin/pengajuan");
  revalidatePath("/admin/data-umkm");
  revalidatePath("/user/profil-umkm");

  return claim;
}

/**
 * Process submission decision and refresh queue pages.
 * @param submissionId Submission identifier.
 * @param payload Submission status payload.
 * @returns Updated submission data.
 *
 * Usage:
 * await processSubmissionAction(1, { status: "selesai" });
 */
export async function processSubmissionAction(
  submissionId: number,
  payload: { status: "diajukan" | "dalam_proses" | "revisi" | "selesai"; catatan_admin?: string },
) {
  const token = await getTokenOrThrow();
  const submission = await umkmService.processSubmission(token, submissionId, payload);

  revalidatePath("/admin/pengajuan");
  revalidatePath("/admin/rekap");
  revalidatePath("/user/pengajuan");

  return submission;
}