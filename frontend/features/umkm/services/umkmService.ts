import { AxiosError } from "axios";
import { httpClient } from "@/lib/repositories/httpClient";
import type {
  ApiEnvelope,
  AuditLogItem,
  DashboardSummary,
  PaginatedPayload,
  RoleItem,
  ServiceItem,
  SubmissionItem,
  UmkmClaim,
  UmkmProfile,
  UserItem,
} from "@/features/umkm/types/umkm";

/**
 * Parse backend API error into readable message.
 * @param error Unknown error object from axios call.
 * @returns Parsed message string.
 *
 * Usage:
 * throw new Error(parseApiError(error));
 */
function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    return String(error.response?.data?.message ?? error.message);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan pada server";
}

/**
 * Perform authorized GET request to backend API.
 * @param token Bearer token from session.
 * @param url Relative endpoint path.
 * @param params Optional query parameters.
 * @returns API envelope payload.
 *
 * Usage:
 * const res = await authorizedGet<MyType>(token, "/umkm/profile/me");
 */
async function authorizedGet<T>(token: string, url: string, params?: Record<string, string | number | undefined>): Promise<ApiEnvelope<T>> {
  try {
    const response = await httpClient.get<ApiEnvelope<T>>(url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error));
  }
}

/**
 * Perform authorized POST request to backend API.
 * @param token Bearer token from session.
 * @param url Relative endpoint path.
 * @param payload Request body payload.
 * @returns API envelope payload.
 *
 * Usage:
 * const res = await authorizedPost<MyType>(token, "/umkm/profile", payload);
 */
async function authorizedPost<T>(token: string, url: string, payload: unknown): Promise<ApiEnvelope<T>> {
  try {
    const response = await httpClient.post<ApiEnvelope<T>>(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error));
  }
}

/**
 * Perform authorized PATCH request to backend API.
 * @param token Bearer token from session.
 * @param url Relative endpoint path.
 * @param payload Request body payload.
 * @returns API envelope payload.
 *
 * Usage:
 * const res = await authorizedPatch<MyType>(token, "/umkm/admin/claims/1", payload);
 */
async function authorizedPatch<T>(token: string, url: string, payload: unknown): Promise<ApiEnvelope<T>> {
  try {
    const response = await httpClient.patch<ApiEnvelope<T>>(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error));
  }
}

/**
 * Fetch current UMKM profile for authenticated user.
 * @param token Bearer token from session.
 * @returns Profile or null if not created.
 *
 * Usage:
 * const profile = await umkmService.getMyProfile(token);
 */
async function getMyProfile(token: string): Promise<UmkmProfile | null> {
  const response = await authorizedGet<UmkmProfile | null>(token, "/umkm/profile/me");
  return response.data;
}

/**
 * Save UMKM profile payload for authenticated user.
 * @param token Bearer token from session.
 * @param payload UMKM profile data.
 * @returns Saved UMKM profile.
 *
 * Usage:
 * await umkmService.saveMyProfile(token, payload);
 */
async function saveMyProfile(token: string, payload: Partial<UmkmProfile>): Promise<UmkmProfile> {
  const response = await authorizedPost<UmkmProfile>(token, "/umkm/profile", payload);
  return response.data;
}

/**
 * Submit UMKM claim for profile verification.
 * @param token Bearer token from session.
 * @returns Created claim object.
 *
 * Usage:
 * await umkmService.submitClaim(token);
 */
async function submitClaim(token: string): Promise<UmkmClaim> {
  const response = await authorizedPost<UmkmClaim>(token, "/umkm/claims", {});
  return response.data;
}

/**
 * Fetch latest UMKM claim status for current user.
 * @param token Bearer token from session.
 * @returns Latest claim or null.
 *
 * Usage:
 * const claim = await umkmService.getLatestClaim(token);
 */
async function getLatestClaim(token: string): Promise<UmkmClaim | null> {
  const response = await authorizedGet<UmkmClaim | null>(token, "/umkm/claims/latest");
  return response.data;
}

/**
 * Fetch available service catalog entries.
 * @param token Bearer token from session.
 * @returns List of service catalog items.
 *
 * Usage:
 * const services = await umkmService.getServices(token);
 */
async function getServices(token: string): Promise<ServiceItem[]> {
  const response = await authorizedGet<ServiceItem[]>(token, "/umkm/services");
  return response.data;
}

/**
 * Fetch paginated submissions for current user.
 * @param token Bearer token from session.
 * @returns Paginated submissions payload.
 *
 * Usage:
 * const submissions = await umkmService.getMySubmissions(token);
 */
async function getMySubmissions(token: string): Promise<PaginatedPayload<SubmissionItem>> {
  const response = await authorizedGet<PaginatedPayload<SubmissionItem>>(token, "/umkm/submissions");
  return response.data;
}

/**
 * Submit service request for current UMKM profile.
 * @param token Bearer token from session.
 * @param payload Service submission payload.
 * @returns Created submission item.
 *
 * Usage:
 * await umkmService.createSubmission(token, { service_id: 1, document_url: "..." });
 */
async function createSubmission(token: string, payload: { service_id: number; document_url: string }): Promise<SubmissionItem> {
  const response = await authorizedPost<SubmissionItem>(token, "/umkm/submissions", payload);
  return response.data;
}

/**
 * Fetch UMKM admin dashboard summary.
 * @param token Bearer token from session.
 * @returns Dashboard summary counters.
 *
 * Usage:
 * const summary = await umkmService.getAdminDashboard(token);
 */
async function getAdminDashboard(token: string): Promise<DashboardSummary> {
  const response = await authorizedGet<DashboardSummary>(token, "/umkm/admin/dashboard");
  return response.data;
}

/**
 * Fetch paginated UMKM profiles for admin table.
 * @param token Bearer token from session.
 * @param search Search keyword.
 * @returns Paginated UMKM profile payload.
 *
 * Usage:
 * await umkmService.getAdminUmkmData(token, "kopi");
 */
async function getAdminUmkmData(token: string, search = "", page = 1): Promise<PaginatedPayload<UmkmProfile>> {
  const response = await authorizedGet<PaginatedPayload<UmkmProfile>>(token, "/umkm/admin/data-umkm", {
    search,
    page,
  });
  return response.data;
}

/**
 * Fetch admin claim queue data.
 * @param token Bearer token from session.
 * @param status Optional status filter.
 * @returns Paginated claim payload.
 *
 * Usage:
 * await umkmService.getAdminClaims(token, "pending");
 */
async function getAdminClaims(token: string, search = "", page = 1): Promise<PaginatedPayload<UmkmClaim>> {
  const response = await authorizedGet<PaginatedPayload<UmkmClaim>>(token, "/umkm/admin/claims", {
    search,
    page,
  });
  return response.data;
}

/**
 * Process claim decision by admin.
 * @param token Bearer token from session.
 * @param claimId Target claim id.
 * @param payload Claim decision payload.
 * @returns Updated claim record.
 *
 * Usage:
 * await umkmService.processClaim(token, 1, { status: "approved" });
 */
async function processClaim(token: string, claimId: number, payload: { status: "approved" | "rejected"; catatan_admin?: string }): Promise<UmkmClaim> {
  const response = await authorizedPatch<UmkmClaim>(token, `/umkm/admin/claims/${claimId}`, payload);
  return response.data;
}

/**
 * Fetch admin submission queue data.
 * @param token Bearer token from session.
 * @param status Optional status filter.
 * @returns Paginated submission payload.
 *
 * Usage:
 * await umkmService.getAdminSubmissions(token, "dalam_proses");
 */
async function getAdminSubmissions(token: string, search = "", page = 1): Promise<PaginatedPayload<SubmissionItem>> {
  const response = await authorizedGet<PaginatedPayload<SubmissionItem>>(token, "/umkm/admin/submissions", {
    search,
    page,
  });
  return response.data;
}

/**
 * Process submission decision by admin.
 * @param token Bearer token from session.
 * @param submissionId Target submission id.
 * @param payload Submission status payload.
 * @returns Updated submission record.
 *
 * Usage:
 * await umkmService.processSubmission(token, 4, { status: "selesai" });
 */
async function processSubmission(
  token: string,
  submissionId: number,
  payload: { status: "diajukan" | "dalam_proses" | "revisi" | "selesai"; catatan_admin?: string },
): Promise<SubmissionItem> {
  const response = await authorizedPatch<SubmissionItem>(token, `/umkm/admin/submissions/${submissionId}`, payload);
  return response.data;
}

/**
 * Fetch UMKM recap payload for admin.
 * @param token Bearer token from session.
 * @returns Dashboard summary counters.
 *
 * Usage:
 * const rekap = await umkmService.getAdminRekap(token);
 */
async function getAdminRekap(token: string): Promise<DashboardSummary> {
  const response = await authorizedGet<DashboardSummary>(token, "/umkm/admin/rekap");
  return response.data;
}

/**
 * Fetch paginated users for UMKM admin user page.
 * @param token Bearer token from session.
 * @param search Optional search keyword.
 * @returns Paginated users payload.
 *
 * Usage:
 * await umkmService.getAdminUsers(token, "andi");
 */
async function getAdminUsers(token: string, search = ""): Promise<PaginatedPayload<UserItem>> {
  const response = await authorizedGet<PaginatedPayload<UserItem>>(token, "/umkm/admin/users", {
    search,
  });
  return response.data;
}

/**
 * Fetch paginated audit logs for UMKM admin route.
 * @param token Bearer token from session.
 * @returns Paginated audit logs payload.
 *
 * Usage:
 * await umkmService.getAdminAuditTrail(token);
 */
async function getAdminAuditTrail(token: string, page = 1): Promise<PaginatedPayload<AuditLogItem>> {
  const response = await authorizedGet<PaginatedPayload<AuditLogItem>>(token, "/umkm/admin/audit-trail", {
    page,
  });
  return response.data;
}

/**
 * Fetch superadmin roles list.
 * @param token Bearer token from session.
 * @returns Paginated roles payload.
 *
 * Usage:
 * await umkmService.getSuperadminRoles(token);
 */
async function getSuperadminRoles(token: string): Promise<PaginatedPayload<RoleItem>> {
  const response = await authorizedGet<PaginatedPayload<RoleItem>>(token, "/roles");
  return response.data;
}

/**
 * Fetch superadmin users list.
 * @param token Bearer token from session.
 * @returns Paginated users payload.
 *
 * Usage:
 * await umkmService.getSuperadminUsers(token);
 */
async function getSuperadminUsers(token: string): Promise<PaginatedPayload<UserItem>> {
  const response = await authorizedGet<PaginatedPayload<UserItem>>(token, "/users");
  return response.data;
}

/**
 * Fetch superadmin audit logs.
 * @param token Bearer token from session.
 * @returns Paginated audit logs payload.
 *
 * Usage:
 * await umkmService.getSuperadminAuditTrail(token);
 */
async function getSuperadminAuditTrail(token: string, page = 1): Promise<PaginatedPayload<AuditLogItem>> {
  const response = await authorizedGet<PaginatedPayload<AuditLogItem>>(token, "/audit-trail", {
    page,
  });
  return response.data;
}

/**
 * umkmService exposes feature-level API calls for UMKM module.
 */
export const umkmService = {
  getMyProfile,
  saveMyProfile,
  submitClaim,
  getLatestClaim,
  getServices,
  getMySubmissions,
  createSubmission,
  getAdminDashboard,
  getAdminUmkmData,
  getAdminClaims,
  processClaim,
  getAdminSubmissions,
  processSubmission,
  getAdminRekap,
  getAdminUsers,
  getAdminAuditTrail,
  getSuperadminRoles,
  getSuperadminUsers,
  getSuperadminAuditTrail,
};
