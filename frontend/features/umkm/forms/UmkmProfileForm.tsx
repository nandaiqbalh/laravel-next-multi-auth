"use client";

import { FormEvent } from "react";
import { saveUmkmProfileAction } from "../../../lib/actions/umkmActions";
import { useAsyncAction } from "@/features/umkm/hooks/useAsyncAction";
import type { UmkmProfile } from "@/features/umkm/types/umkm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/**
 * Convert form value into nullable number.
 * @param value Raw form string value.
 * @returns Nullable number.
 *
 * Usage:
 * const parsed = toNullableNumber(formData.get("asset"));
 */
function toNullableNumber(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Convert form value into nullable string.
 * @param value Raw form value.
 * @returns Nullable string.
 *
 * Usage:
 * const nama = toNullableString(formData.get("nama_usaha"));
 */
function toNullableString(value: FormDataEntryValue | null): string | null {
  if (value === null) {
    return null;
  }

  const text = String(value).trim();
  return text === "" ? null : text;
}

/**
 * UmkmProfileForm renders full UMKM profile input form using exact schema keys.
 * @param initialProfile Existing profile data.
 * @returns JSX element.
 *
 * Usage:
 * <UmkmProfileForm initialProfile={profile} />
 */
export function UmkmProfileForm({ initialProfile }: { initialProfile?: UmkmProfile | null }) {
  const { loading, error, success, run } = useAsyncAction();

  /**
   * Handle form submission to save profile payload.
   * @param event Form submit event.
   * @returns Promise<void>
   *
   * Usage:
   * <form onSubmit={handleSubmit}>...
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await run(async () => {
      await saveUmkmProfileAction({
        id_data_badan_usaha: String(formData.get("id_data_badan_usaha") ?? ""),
        nik_pengusaha: String(formData.get("nik_pengusaha") ?? ""),
        nama_pengusaha: String(formData.get("nama_pengusaha") ?? ""),
        nib: toNullableString(formData.get("nib")),
        jenis_kelamin: String(formData.get("jenis_kelamin") ?? "L"),
        is_disabilitas: formData.get("is_disabilitas") === "on",
        tanggal_lahir: toNullableString(formData.get("tanggal_lahir")),

        prov_pengusaha: String(formData.get("prov_pengusaha") ?? ""),
        kab_pengusaha: String(formData.get("kab_pengusaha") ?? ""),
        kec_pengusaha: String(formData.get("kec_pengusaha") ?? ""),
        kel_pengusaha: String(formData.get("kel_pengusaha") ?? ""),
        alamat_pengusaha: String(formData.get("alamat_pengusaha") ?? ""),
        rt_pengusaha: toNullableString(formData.get("rt_pengusaha")),
        rw_pengusaha: toNullableString(formData.get("rw_pengusaha")),

        kontak_hp: String(formData.get("kontak_hp") ?? ""),
        pendidikan_formal: toNullableString(formData.get("pendidikan_formal")),

        nama_usaha: String(formData.get("nama_usaha") ?? ""),
        kegiatan_utama: toNullableString(formData.get("kegiatan_utama")),
        produk_utama: toNullableString(formData.get("produk_utama")),
        kategori_kbli: toNullableString(formData.get("kategori_kbli")),
        kode_kbli: toNullableString(formData.get("kode_kbli")),
        status_badan_usaha: toNullableString(formData.get("status_badan_usaha")),

        modal_pendirian: toNullableNumber(formData.get("modal_pendirian")),
        bulan_mulai_operasi: toNullableNumber(formData.get("bulan_mulai_operasi")),
        tahun_mulai_operasi: toNullableNumber(formData.get("tahun_mulai_operasi")),

        prov_usaha: String(formData.get("prov_usaha") ?? ""),
        kab_usaha: String(formData.get("kab_usaha") ?? ""),
        kec_usaha: String(formData.get("kec_usaha") ?? ""),
        kel_usaha: String(formData.get("kel_usaha") ?? ""),
        alamat_usaha: String(formData.get("alamat_usaha") ?? ""),
        rt_usaha: toNullableString(formData.get("rt_usaha")),
        rw_usaha: toNullableString(formData.get("rw_usaha")),

        foto_usaha: toNullableString(formData.get("foto_usaha")),
        alamat_latitude: toNullableNumber(formData.get("alamat_latitude")),
        alamat_longitude: toNullableNumber(formData.get("alamat_longitude")),

        tk_dibayar_laki: Number(formData.get("tk_dibayar_laki") ?? 0),
        tk_dibayar_perempuan: Number(formData.get("tk_dibayar_perempuan") ?? 0),
        tk_dibayar_disabil_laki: Number(formData.get("tk_dibayar_disabil_laki") ?? 0),
        tk_dibayar_disabil_perempuan: Number(formData.get("tk_dibayar_disabil_perempuan") ?? 0),

        tk_not_dibayar_laki: Number(formData.get("tk_not_dibayar_laki") ?? 0),
        tk_not_dibayar_perempuan: Number(formData.get("tk_not_dibayar_perempuan") ?? 0),
        tk_not_dibayar_disabil_laki: Number(formData.get("tk_not_dibayar_disabil_laki") ?? 0),
        tk_not_dibayar_disabil_perempuan: Number(formData.get("tk_not_dibayar_disabil_perempuan") ?? 0),

        skala_usaha: toNullableString(formData.get("skala_usaha")),
        omzet_tahunan: toNullableNumber(formData.get("omzet_tahunan")),
        asset: toNullableNumber(formData.get("asset")),
      });
    });
  }

  return (
    <Card>
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle>Form Profil UMKM</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="id_data_badan_usaha">ID Data Badan Usaha</Label>
              <Input id="id_data_badan_usaha" name="id_data_badan_usaha" defaultValue={initialProfile?.id_data_badan_usaha ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nik_pengusaha">NIK Pengusaha</Label>
              <Input id="nik_pengusaha" name="nik_pengusaha" defaultValue={initialProfile?.nik_pengusaha ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama_pengusaha">Nama Pengusaha</Label>
              <Input id="nama_pengusaha" name="nama_pengusaha" defaultValue={initialProfile?.nama_pengusaha ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nib">NIB</Label>
              <Input id="nib" name="nib" defaultValue={initialProfile?.nib ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <Select name="jenis_kelamin" defaultValue={initialProfile?.jenis_kelamin ?? "L"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-between rounded-md border border-border px-3 py-2">
              <div>
                <Label htmlFor="is_disabilitas">Disabilitas</Label>
                <p className="text-muted-foreground">Aktifkan jika pengusaha penyandang disabilitas</p>
              </div>
              <Switch id="is_disabilitas" name="is_disabilitas" defaultChecked={Boolean(initialProfile?.is_disabilitas)} />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
              <Input id="tanggal_lahir" type="date" name="tanggal_lahir" defaultValue={initialProfile?.tanggal_lahir ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kontak_hp">Kontak HP</Label>
              <Input id="kontak_hp" name="kontak_hp" defaultValue={initialProfile?.kontak_hp ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pendidikan_formal">Pendidikan Formal</Label>
              <Input id="pendidikan_formal" name="pendidikan_formal" defaultValue={initialProfile?.pendidikan_formal ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama_usaha">Nama Usaha</Label>
              <Input id="nama_usaha" name="nama_usaha" defaultValue={initialProfile?.nama_usaha ?? ""} required />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="prov_pengusaha">Provinsi Pengusaha</Label><Input id="prov_pengusaha" name="prov_pengusaha" defaultValue={initialProfile?.prov_pengusaha ?? ""} required /></div>
            <div className="space-y-2"><Label htmlFor="kab_pengusaha">Kabupaten Pengusaha</Label><Input id="kab_pengusaha" name="kab_pengusaha" defaultValue={initialProfile?.kab_pengusaha ?? ""} required /></div>
            <div className="space-y-2"><Label htmlFor="kec_pengusaha">Kecamatan Pengusaha</Label><Input id="kec_pengusaha" name="kec_pengusaha" defaultValue={initialProfile?.kec_pengusaha ?? ""} required /></div>
            <div className="space-y-2"><Label htmlFor="kel_pengusaha">Kelurahan Pengusaha</Label><Input id="kel_pengusaha" name="kel_pengusaha" defaultValue={initialProfile?.kel_pengusaha ?? ""} required /></div>
            <div className="space-y-2"><Label htmlFor="rt_pengusaha">RT Pengusaha</Label><Input id="rt_pengusaha" name="rt_pengusaha" defaultValue={initialProfile?.rt_pengusaha ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="rw_pengusaha">RW Pengusaha</Label><Input id="rw_pengusaha" name="rw_pengusaha" defaultValue={initialProfile?.rw_pengusaha ?? ""} /></div>
          </section>

          <section className="space-y-2">
            <Label htmlFor="alamat_pengusaha">Alamat Pengusaha</Label>
            <Textarea id="alamat_pengusaha" name="alamat_pengusaha" defaultValue={initialProfile?.alamat_pengusaha ?? ""} required />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="kegiatan_utama">Kegiatan Utama</Label><Textarea id="kegiatan_utama" name="kegiatan_utama" defaultValue={initialProfile?.kegiatan_utama ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="produk_utama">Produk Utama</Label><Input id="produk_utama" name="produk_utama" defaultValue={initialProfile?.produk_utama ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="kategori_kbli">Kategori KBLI</Label><Input id="kategori_kbli" name="kategori_kbli" defaultValue={initialProfile?.kategori_kbli ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="kode_kbli">Kode KBLI</Label><Input id="kode_kbli" name="kode_kbli" defaultValue={initialProfile?.kode_kbli ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="status_badan_usaha">Status Badan Usaha</Label><Input id="status_badan_usaha" name="status_badan_usaha" defaultValue={initialProfile?.status_badan_usaha ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="modal_pendirian">Modal Pendirian</Label><Input id="modal_pendirian" type="number" name="modal_pendirian" defaultValue={initialProfile?.modal_pendirian ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="bulan_mulai_operasi">Bulan Mulai Operasi</Label><Input id="bulan_mulai_operasi" type="number" name="bulan_mulai_operasi" defaultValue={initialProfile?.bulan_mulai_operasi ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="tahun_mulai_operasi">Tahun Mulai Operasi</Label><Input id="tahun_mulai_operasi" type="number" name="tahun_mulai_operasi" defaultValue={initialProfile?.tahun_mulai_operasi ?? ""} /></div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="prov_usaha">Provinsi Usaha</Label><Input id="prov_usaha" name="prov_usaha" defaultValue={initialProfile?.prov_usaha ?? ""} required /></div>
            <div className="space-y-2"><Label htmlFor="kab_usaha">Kabupaten Usaha</Label><Input id="kab_usaha" name="kab_usaha" defaultValue={initialProfile?.kab_usaha ?? ""} required /></div>
            <div className="space-y-2"><Label htmlFor="kec_usaha">Kecamatan Usaha</Label><Input id="kec_usaha" name="kec_usaha" defaultValue={initialProfile?.kec_usaha ?? ""} required /></div>
            <div className="space-y-2"><Label htmlFor="kel_usaha">Kelurahan Usaha</Label><Input id="kel_usaha" name="kel_usaha" defaultValue={initialProfile?.kel_usaha ?? ""} required /></div>
            <div className="space-y-2"><Label htmlFor="rt_usaha">RT Usaha</Label><Input id="rt_usaha" name="rt_usaha" defaultValue={initialProfile?.rt_usaha ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="rw_usaha">RW Usaha</Label><Input id="rw_usaha" name="rw_usaha" defaultValue={initialProfile?.rw_usaha ?? ""} /></div>
          </section>

          <section className="space-y-2">
            <Label htmlFor="alamat_usaha">Alamat Usaha</Label>
            <Textarea id="alamat_usaha" name="alamat_usaha" defaultValue={initialProfile?.alamat_usaha ?? ""} required />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="foto_usaha">Foto Usaha (URL)</Label><Input id="foto_usaha" name="foto_usaha" defaultValue={initialProfile?.foto_usaha ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="alamat_latitude">Latitude</Label><Input id="alamat_latitude" type="number" step="0.00000001" name="alamat_latitude" defaultValue={initialProfile?.alamat_latitude ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="alamat_longitude">Longitude</Label><Input id="alamat_longitude" type="number" step="0.00000001" name="alamat_longitude" defaultValue={initialProfile?.alamat_longitude ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="skala_usaha">Skala Usaha</Label><Input id="skala_usaha" name="skala_usaha" defaultValue={initialProfile?.skala_usaha ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="omzet_tahunan">Omzet Tahunan</Label><Input id="omzet_tahunan" type="number" name="omzet_tahunan" defaultValue={initialProfile?.omzet_tahunan ?? ""} /></div>
            <div className="space-y-2"><Label htmlFor="asset">Asset</Label><Input id="asset" type="number" name="asset" defaultValue={initialProfile?.asset ?? ""} /></div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="tk_dibayar_laki">TK Dibayar Laki</Label><Input id="tk_dibayar_laki" type="number" name="tk_dibayar_laki" defaultValue={initialProfile?.tk_dibayar_laki ?? 0} required /></div>
            <div className="space-y-2"><Label htmlFor="tk_dibayar_perempuan">TK Dibayar Perempuan</Label><Input id="tk_dibayar_perempuan" type="number" name="tk_dibayar_perempuan" defaultValue={initialProfile?.tk_dibayar_perempuan ?? 0} required /></div>
            <div className="space-y-2"><Label htmlFor="tk_dibayar_disabil_laki">TK Dibayar Disabil Laki</Label><Input id="tk_dibayar_disabil_laki" type="number" name="tk_dibayar_disabil_laki" defaultValue={initialProfile?.tk_dibayar_disabil_laki ?? 0} required /></div>
            <div className="space-y-2"><Label htmlFor="tk_dibayar_disabil_perempuan">TK Dibayar Disabil Perempuan</Label><Input id="tk_dibayar_disabil_perempuan" type="number" name="tk_dibayar_disabil_perempuan" defaultValue={initialProfile?.tk_dibayar_disabil_perempuan ?? 0} required /></div>
            <div className="space-y-2"><Label htmlFor="tk_not_dibayar_laki">TK Tidak Dibayar Laki</Label><Input id="tk_not_dibayar_laki" type="number" name="tk_not_dibayar_laki" defaultValue={initialProfile?.tk_not_dibayar_laki ?? 0} required /></div>
            <div className="space-y-2"><Label htmlFor="tk_not_dibayar_perempuan">TK Tidak Dibayar Perempuan</Label><Input id="tk_not_dibayar_perempuan" type="number" name="tk_not_dibayar_perempuan" defaultValue={initialProfile?.tk_not_dibayar_perempuan ?? 0} required /></div>
            <div className="space-y-2"><Label htmlFor="tk_not_dibayar_disabil_laki">TK Tidak Dibayar Disabil Laki</Label><Input id="tk_not_dibayar_disabil_laki" type="number" name="tk_not_dibayar_disabil_laki" defaultValue={initialProfile?.tk_not_dibayar_disabil_laki ?? 0} required /></div>
            <div className="space-y-2"><Label htmlFor="tk_not_dibayar_disabil_perempuan">TK Tidak Dibayar Disabil Perempuan</Label><Input id="tk_not_dibayar_disabil_perempuan" type="number" name="tk_not_dibayar_disabil_perempuan" defaultValue={initialProfile?.tk_not_dibayar_disabil_perempuan ?? 0} required /></div>
          </section>

          {error ? <p className="text-destructive">{error}</p> : null}
          {success ? <p className="text-primary">{success}</p> : null}

          <Button type="submit" className="bg-primary text-primary-foreground" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Profil UMKM"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
