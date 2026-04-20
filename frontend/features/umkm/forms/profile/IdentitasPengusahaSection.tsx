import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "./FormSection";
import type { UmkmProfile } from "@/features/umkm/types/umkm";

interface Props {
  profile?: UmkmProfile | null;
}

export function IdentitasPengusahaSection({ profile }: Props) {
  return (
    <FormSection
      title="Identitas Pengusaha"
      description="Data utama pemilik usaha sebagai dasar verifikasi."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="id_data_badan_usaha" label="ID Data Badan Usaha">
          <Input id="id_data_badan_usaha" name="id_data_badan_usaha" defaultValue={profile?.id_data_badan_usaha ?? ""} required />
        </FormField>

        <FormField id="nik_pengusaha" label="NIK Pengusaha">
          <Input id="nik_pengusaha" name="nik_pengusaha" defaultValue={profile?.nik_pengusaha ?? ""} required />
        </FormField>

        <FormField id="nama_pengusaha" label="Nama Pengusaha">
          <Input id="nama_pengusaha" name="nama_pengusaha" defaultValue={profile?.nama_pengusaha ?? ""} required />
        </FormField>

        <FormField id="nib" label="NIB">
          <Input id="nib" name="nib" defaultValue={profile?.nib ?? ""} />
        </FormField>

        <FormField id="jenis_kelamin" label="Jenis Kelamin">
          <Select name="jenis_kelamin" defaultValue={profile?.jenis_kelamin ?? "L"}>
            <SelectTrigger id="jenis_kelamin" className="w-full">
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="tanggal_lahir" label="Tanggal Lahir">
          <Input id="tanggal_lahir" type="date" name="tanggal_lahir" defaultValue={profile?.tanggal_lahir ?? ""} />
        </FormField>

        <FormField id="kontak_hp" label="Kontak HP">
          <Input id="kontak_hp" name="kontak_hp" defaultValue={profile?.kontak_hp ?? ""} required />
        </FormField>

        <FormField id="pendidikan_formal" label="Pendidikan Formal">
          <Input id="pendidikan_formal" name="pendidikan_formal" defaultValue={profile?.pendidikan_formal ?? ""} />
        </FormField>
      </div>

      {/* Disabilitas toggle — full width */}
      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <div className="space-y-0.5">
          <Label htmlFor="is_disabilitas" className="text-sm font-medium">Penyandang Disabilitas</Label>
          <p className="text-xs text-muted-foreground">Aktifkan jika pengusaha adalah penyandang disabilitas.</p>
        </div>
        <Switch id="is_disabilitas" name="is_disabilitas" defaultChecked={Boolean(profile?.is_disabilitas)} />
      </div>
    </FormSection>
  );
}