import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/FormField";
import { AlamatPengusahaSection } from "./AlamatPengusahaSection";
import { FormSection } from "./FormSection";
import type { UmkmProfile } from "@/features/umkm/types/umkm";

interface Props {
  profile?: UmkmProfile | null;
}

export function LokasiUsahaSection({ profile }: Props) {
  return (
    <>
      <AlamatPengusahaSection
        profile={profile}
        suffix="usaha"
        title="Lokasi Usaha"
        description="Alamat operasional usaha dan titik koordinat lokasi."
      />

      {/* Koordinat & foto — appended after the reusable address block */}
      <FormSection title="Koordinat & Foto Usaha">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="alamat_latitude" label="Latitude">
            <Input id="alamat_latitude" type="number" step="0.00000001" name="alamat_latitude" defaultValue={profile?.alamat_latitude ?? ""} />
          </FormField>

          <FormField id="alamat_longitude" label="Longitude">
            <Input id="alamat_longitude" type="number" step="0.00000001" name="alamat_longitude" defaultValue={profile?.alamat_longitude ?? ""} />
          </FormField>

          <FormField id="foto_usaha" label="Foto Usaha (URL)" className="sm:col-span-2">
            <Input id="foto_usaha" name="foto_usaha" defaultValue={profile?.foto_usaha ?? ""} />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}