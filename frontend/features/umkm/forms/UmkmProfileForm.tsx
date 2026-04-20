"use client";

import { FormEvent } from "react";
import { saveUmkmProfileAction } from "../../../lib/actions/umkmActions";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import type { UmkmProfile } from "@/features/umkm/types/umkm";
import { Button } from "@/components/ui/button";
import { IdentitasPengusahaSection } from "./profile/IdentitasPengusahaSection";
import { AlamatPengusahaSection } from "./profile/AlamatPengusahaSection";
import { InformasiUsahaSection } from "./profile/InformasiUsahaSection";
import { LokasiUsahaSection } from "./profile/LokasiUsahaSection";
import { SkalaBisnisSection } from "./profile/SkalaBisnisSection";

function toNullableNumber(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function toNullableString(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

/**
 * Full UMKM profile form split into thematic sections.
 *
 * @example
 * <UmkmProfileForm initialProfile={profile} />
 */
export function UmkmProfileForm({ initialProfile }: { initialProfile?: UmkmProfile | null }) {
  const { loading, error, success, run } = useAsyncAction();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);

    await run(async () => {
      await saveUmkmProfileAction({
        id_data_badan_usaha: String(fd.get("id_data_badan_usaha") ?? ""),
        nik_pengusaha: String(fd.get("nik_pengusaha") ?? ""),
        nama_pengusaha: String(fd.get("nama_pengusaha") ?? ""),
        nib: toNullableString(fd.get("nib")),
        jenis_kelamin: String(fd.get("jenis_kelamin") ?? "L"),
        is_disabilitas: fd.get("is_disabilitas") === "on",
        tanggal_lahir: toNullableString(fd.get("tanggal_lahir")),

        prov_pengusaha: String(fd.get("prov_pengusaha") ?? ""),
        kab_pengusaha: String(fd.get("kab_pengusaha") ?? ""),
        kec_pengusaha: String(fd.get("kec_pengusaha") ?? ""),
        kel_pengusaha: String(fd.get("kel_pengusaha") ?? ""),
        alamat_pengusaha: String(fd.get("alamat_pengusaha") ?? ""),
        rt_pengusaha: toNullableString(fd.get("rt_pengusaha")),
        rw_pengusaha: toNullableString(fd.get("rw_pengusaha")),

        kontak_hp: String(fd.get("kontak_hp") ?? ""),
        pendidikan_formal: toNullableString(fd.get("pendidikan_formal")),

        nama_usaha: String(fd.get("nama_usaha") ?? ""),
        kegiatan_utama: toNullableString(fd.get("kegiatan_utama")),
        produk_utama: toNullableString(fd.get("produk_utama")),
        kategori_kbli: toNullableString(fd.get("kategori_kbli")),
        kode_kbli: toNullableString(fd.get("kode_kbli")),
        status_badan_usaha: toNullableString(fd.get("status_badan_usaha")),

        modal_pendirian: toNullableNumber(fd.get("modal_pendirian")),
        bulan_mulai_operasi: toNullableNumber(fd.get("bulan_mulai_operasi")),
        tahun_mulai_operasi: toNullableNumber(fd.get("tahun_mulai_operasi")),

        prov_usaha: String(fd.get("prov_usaha") ?? ""),
        kab_usaha: String(fd.get("kab_usaha") ?? ""),
        kec_usaha: String(fd.get("kec_usaha") ?? ""),
        kel_usaha: String(fd.get("kel_usaha") ?? ""),
        alamat_usaha: String(fd.get("alamat_usaha") ?? ""),
        rt_usaha: toNullableString(fd.get("rt_usaha")),
        rw_usaha: toNullableString(fd.get("rw_usaha")),

        foto_usaha: toNullableString(fd.get("foto_usaha")),
        alamat_latitude: toNullableNumber(fd.get("alamat_latitude")),
        alamat_longitude: toNullableNumber(fd.get("alamat_longitude")),

        tk_dibayar_laki: Number(fd.get("tk_dibayar_laki") ?? 0),
        tk_dibayar_perempuan: Number(fd.get("tk_dibayar_perempuan") ?? 0),
        tk_dibayar_disabil_laki: Number(fd.get("tk_dibayar_disabil_laki") ?? 0),
        tk_dibayar_disabil_perempuan: Number(fd.get("tk_dibayar_disabil_perempuan") ?? 0),
        tk_not_dibayar_laki: Number(fd.get("tk_not_dibayar_laki") ?? 0),
        tk_not_dibayar_perempuan: Number(fd.get("tk_not_dibayar_perempuan") ?? 0),
        tk_not_dibayar_disabil_laki: Number(fd.get("tk_not_dibayar_disabil_laki") ?? 0),
        tk_not_dibayar_disabil_perempuan: Number(fd.get("tk_not_dibayar_disabil_perempuan") ?? 0),

        skala_usaha: toNullableString(fd.get("skala_usaha")),
        omzet_tahunan: toNullableNumber(fd.get("omzet_tahunan")),
        asset: toNullableNumber(fd.get("asset")),
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      <IdentitasPengusahaSection profile={initialProfile} />
      <AlamatPengusahaSection profile={initialProfile} suffix="pengusaha" title="Alamat Pengusaha" description="Alamat domisili pengusaha sesuai data administrasi." />
      <InformasiUsahaSection profile={initialProfile} />
      <LokasiUsahaSection profile={initialProfile} />
      <SkalaBisnisSection profile={initialProfile} />

      <div className="space-y-4">
        {error && <ErrorBanner message={error} />}
        {success && <p className="text-sm text-primary">{success}</p>}

        <div className="flex justify-end border-t border-border/60 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Profil UMKM"}
          </Button>
        </div>
      </div>
    </form>
  );
}