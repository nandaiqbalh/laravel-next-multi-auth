import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "./FormSection";
import type { UmkmProfile } from "@/features/umkm/types/umkm";

interface Props {
  profile?: UmkmProfile | null;
}

export function InformasiUsahaSection({ profile }: Props) {
  return (
    <FormSection
      title="Informasi Usaha"
      description="Profil bisnis, kategori usaha, dan data awal operasional."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="nama_usaha" label="Nama Usaha">
          <Input id="nama_usaha" name="nama_usaha" defaultValue={profile?.nama_usaha ?? ""} required />
        </FormField>

        <FormField id="produk_utama" label="Produk Utama">
          <Input id="produk_utama" name="produk_utama" defaultValue={profile?.produk_utama ?? ""} />
        </FormField>

        <FormField id="kategori_kbli" label="Kategori KBLI">
          <Input id="kategori_kbli" name="kategori_kbli" defaultValue={profile?.kategori_kbli ?? ""} />
        </FormField>

        <FormField id="kode_kbli" label="Kode KBLI">
          <Input id="kode_kbli" name="kode_kbli" defaultValue={profile?.kode_kbli ?? ""} />
        </FormField>

        <FormField id="status_badan_usaha" label="Status Badan Usaha">
          <Input id="status_badan_usaha" name="status_badan_usaha" defaultValue={profile?.status_badan_usaha ?? ""} />
        </FormField>

        <FormField id="modal_pendirian" label="Modal Pendirian (Rp)">
          <Input id="modal_pendirian" type="number" name="modal_pendirian" defaultValue={profile?.modal_pendirian ?? ""} />
        </FormField>

        <FormField id="bulan_mulai_operasi" label="Bulan Mulai Operasi">
          <Input id="bulan_mulai_operasi" type="number" min={1} max={12} name="bulan_mulai_operasi" defaultValue={profile?.bulan_mulai_operasi ?? ""} />
        </FormField>

        <FormField id="tahun_mulai_operasi" label="Tahun Mulai Operasi">
          <Input id="tahun_mulai_operasi" type="number" name="tahun_mulai_operasi" defaultValue={profile?.tahun_mulai_operasi ?? ""} />
        </FormField>
      </div>

      <FormField id="kegiatan_utama" label="Kegiatan Utama">
        <Textarea id="kegiatan_utama" name="kegiatan_utama" defaultValue={profile?.kegiatan_utama ?? ""} />
      </FormField>
    </FormSection>
  );
}