/**
 * RoleName defines RBAC roles from backend.
 */
export type RoleName = "SUPERADMIN" | "UMKM_ADMIN" | "UMKM_USER";

/**
 * ApiEnvelope models standard Laravel API response.
 */
export type ApiEnvelope<T> = {
  error: boolean;
  message: string;
  data: T;
};

/**
 * PaginationMeta describes common pagination metadata.
 */
export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

/**
 * PaginatedPayload wraps list item and meta payload.
 */
export type PaginatedPayload<T> = {
  items: T[];
  meta: PaginationMeta;
};

/**
 * RoleItem models role entity from backend.
 */
export type RoleItem = {
  id: number;
  name: RoleName;
};

/**
 * UserItem models users table payload.
 */
export type UserItem = {
  id: string;
  nik: string;
  name: string;
  email: string;
  role_id: number;
  role?: RoleItem;
  created_at?: string;
  updated_at?: string;
};

/**
 * UmkmProfile models exact UMKM profile schema.
 */
export type UmkmProfile = {
  id_data_badan_usaha: string;
  user_id: string;
  nik_pengusaha: string;
  nama_pengusaha: string;
  nib?: string | null;
  jenis_kelamin: string;
  is_disabilitas: boolean;
  tanggal_lahir?: string | null;
  prov_pengusaha: string;
  kab_pengusaha: string;
  kec_pengusaha: string;
  kel_pengusaha: string;
  alamat_pengusaha: string;
  rt_pengusaha?: string | null;
  rw_pengusaha?: string | null;
  kontak_hp: string;
  pendidikan_formal?: string | null;
  nama_usaha: string;
  kegiatan_utama?: string | null;
  produk_utama?: string | null;
  kategori_kbli?: string | null;
  kode_kbli?: string | null;
  status_badan_usaha?: string | null;
  modal_pendirian?: number | string | null;
  bulan_mulai_operasi?: number | null;
  tahun_mulai_operasi?: number | null;
  prov_usaha: string;
  kab_usaha: string;
  kec_usaha: string;
  kel_usaha: string;
  alamat_usaha: string;
  rt_usaha?: string | null;
  rw_usaha?: string | null;
  foto_usaha?: string | null;
  alamat_latitude?: number | string | null;
  alamat_longitude?: number | string | null;
  tk_dibayar_laki: number;
  tk_dibayar_perempuan: number;
  tk_dibayar_disabil_laki: number;
  tk_dibayar_disabil_perempuan: number;
  tk_not_dibayar_laki: number;
  tk_not_dibayar_perempuan: number;
  tk_not_dibayar_disabil_laki: number;
  tk_not_dibayar_disabil_perempuan: number;
  skala_usaha?: string | null;
  omzet_tahunan?: number | string | null;
  asset?: number | string | null;
  is_verified: boolean;
  verified_by?: string | null;
  verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

/**
 * UmkmClaim models claim lifecycle payload.
 */
export type UmkmClaim = {
  id: number;
  umkm_profile_id: string;
  status: "pending" | "approved" | "rejected";
  catatan_admin?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
};

/**
 * ServiceItem models service catalog entity.
 */
export type ServiceItem = {
  id: number;
  code: "PIRT" | "NIB" | "KURASI" | "HALAL" | "QRIS" | "BBM";
  name: string;
};

/**
 * SubmissionLog models status transition logs.
 */
export type SubmissionLog = {
  id: number;
  submission_id: number;
  status_from?: string | null;
  status_to: "diajukan" | "dalam_proses" | "revisi" | "selesai";
  note?: string | null;
  changed_by?: string | null;
  created_at: string;
};

/**
 * SubmissionItem models service submission payload.
 */
export type SubmissionItem = {
  id: number;
  umkm_profile_id: string;
  service_id: number;
  status: "diajukan" | "dalam_proses" | "revisi" | "selesai";
  document_url: string;
  catatan_admin?: string | null;
  processed_by?: string | null;
  submitted_at?: string | null;
  processed_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  service?: ServiceItem;
  logs?: SubmissionLog[];
};

/**
 * AuditLogItem models audit trail payload.
 */
export type AuditLogItem = {
  id: number;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

/**
 * DashboardSummary models aggregate dashboard counters.
 */
export type DashboardSummary = {
  profiles: {
    total: number;
    verified: number;
    unverified: number;
  };
  claims: {
    pending: number;
    approved: number;
    rejected: number;
  };
  submissions: {
    diajukan: number;
    dalam_proses: number;
    revisi: number;
    selesai: number;
  };
};
