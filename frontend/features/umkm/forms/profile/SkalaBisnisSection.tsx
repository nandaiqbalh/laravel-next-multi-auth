import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "./FormSection";
import type { UmkmProfile } from "@/features/umkm/types/umkm";

interface Props {
  profile?: UmkmProfile | null;
}

/** Pairs of [id/name, label] for tenaga kerja fields — avoids repetitive JSX. */
const TK_DIBAYAR: [keyof UmkmProfile, string][] = [
  ["tk_dibayar_laki", "Laki-laki"],
  ["tk_dibayar_perempuan", "Perempuan"],
  ["tk_dibayar_disabil_laki", "Disabilitas Laki-laki"],
  ["tk_dibayar_disabil_perempuan", "Disabilitas Perempuan"],
];

const TK_NOT_DIBAYAR: [keyof UmkmProfile, string][] = [
  ["tk_not_dibayar_laki", "Laki-laki"],
  ["tk_not_dibayar_perempuan", "Perempuan"],
  ["tk_not_dibayar_disabil_laki", "Disabilitas Laki-laki"],
  ["tk_not_dibayar_disabil_perempuan", "Disabilitas Perempuan"],
];

export function SkalaBisnisSection({ profile }: Props) {
  return (
    <FormSection
      title="Skala Bisnis & Tenaga Kerja"
      description="Data skala usaha dan komposisi tenaga kerja dibayar / tidak dibayar."
    >
      {/* Skala & finansial */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="skala_usaha" label="Skala Usaha">
          <Input id="skala_usaha" name="skala_usaha" defaultValue={profile?.skala_usaha ?? ""} />
        </FormField>

        <FormField id="omzet_tahunan" label="Omzet Tahunan (Rp)">
          <Input id="omzet_tahunan" type="number" name="omzet_tahunan" defaultValue={profile?.omzet_tahunan ?? ""} />
        </FormField>

        <FormField id="asset" label="Aset (Rp)">
          <Input id="asset" type="number" name="asset" defaultValue={profile?.asset ?? ""} />
        </FormField>
      </div>

      {/* TK Dibayar */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Tenaga Kerja Dibayar</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TK_DIBAYAR.map(([key, label]) => (
            <FormField key={key} id={key} label={label}>
              <Input id={key} type="number" name={key} min={0} defaultValue={profile?.[key] ?? 0} required />
            </FormField>
          ))}
        </div>
      </div>

      {/* TK Tidak Dibayar */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Tenaga Kerja Tidak Dibayar</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TK_NOT_DIBAYAR.map(([key, label]) => (
            <FormField key={key} id={key} label={label}>
              <Input id={key} type="number" name={key} min={0} defaultValue={profile?.[key] ?? 0} required />
            </FormField>
          ))}
        </div>
      </div>
    </FormSection>
  );
}