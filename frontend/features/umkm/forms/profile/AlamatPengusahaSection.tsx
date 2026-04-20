import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/common/FormField";
import type { UmkmProfile } from "@/features/umkm/types/umkm";
import { FormSection } from "./FormSection";

type AlamatSuffix = "pengusaha" | "usaha";

interface Props {
  profile?: UmkmProfile | null;
  /** Determines which set of profile keys to read (`_pengusaha` or `_usaha`). */
  suffix: AlamatSuffix;
  title: string;
  description?: string;
}

/**
 * Reusable address section for both pengusaha and usaha address blocks.
 * Controlled by `suffix` prop so field names and defaultValues resolve correctly.
 */
export function AlamatPengusahaSection({ profile, suffix, title, description }: Props) {
  const p = suffix === "pengusaha"
    ? {
        prov: profile?.prov_pengusaha,
        kab: profile?.kab_pengusaha,
        kec: profile?.kec_pengusaha,
        kel: profile?.kel_pengusaha,
        rt: profile?.rt_pengusaha,
        rw: profile?.rw_pengusaha,
        alamat: profile?.alamat_pengusaha,
      }
    : {
        prov: profile?.prov_usaha,
        kab: profile?.kab_usaha,
        kec: profile?.kec_usaha,
        kel: profile?.kel_usaha,
        rt: profile?.rt_usaha,
        rw: profile?.rw_usaha,
        alamat: profile?.alamat_usaha,
      };

  function name(field: string) {
    return `${field}_${suffix}`;
  }

  function id(field: string) {
    return `${field}_${suffix}`;
  }

  return (
    <FormSection title={title} description={description}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={id("prov")} label="Provinsi">
          <Input id={id("prov")} name={name("prov")} defaultValue={p.prov ?? ""} required />
        </FormField>

        <FormField id={id("kab")} label="Kabupaten / Kota">
          <Input id={id("kab")} name={name("kab")} defaultValue={p.kab ?? ""} required />
        </FormField>

        <FormField id={id("kec")} label="Kecamatan">
          <Input id={id("kec")} name={name("kec")} defaultValue={p.kec ?? ""} required />
        </FormField>

        <FormField id={id("kel")} label="Kelurahan">
          <Input id={id("kel")} name={name("kel")} defaultValue={p.kel ?? ""} required />
        </FormField>

        <FormField id={id("rt")} label="RT">
          <Input id={id("rt")} name={name("rt")} defaultValue={p.rt ?? ""} />
        </FormField>

        <FormField id={id("rw")} label="RW">
          <Input id={id("rw")} name={name("rw")} defaultValue={p.rw ?? ""} />
        </FormField>
      </div>

      <FormField id={id("alamat")} label="Alamat Lengkap">
        <Textarea id={id("alamat")} name={name("alamat")} defaultValue={p.alamat ?? ""} required />
      </FormField>
    </FormSection>
  );
}