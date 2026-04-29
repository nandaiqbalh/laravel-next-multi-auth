import Link from "next/link";
import { ClaimUmkmForm } from "@/features/umkm/forms/ClaimUmkmForm";
import { PageHeader } from "@/components/ui/page-header";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { StatCard } from "@/features/umkm/components/StatCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { umkmService } from "@/features/umkm/services/umkmService";
import { claimStatusLabel } from "@/features/umkm/utils/formatters";
import { requireRole } from "@/features/umkm/utils/guards";

export const metadata = {
  title: "Dashboard Pengguna",
  description: "Ringkasan status profil, pengajuan, dan klaim pengguna.",
};

export default async function UserDashboardPage() {
  const context = await requireRole(["UMKM_USER"]);

  const [profile, claim, submissions] = await Promise.all([
    umkmService.getMyProfile(context.token),
    umkmService.getLatestClaim(context.token),
    umkmService.getMySubmissions(context.token),
  ]);
  const resolvedProfile = profile ?? await umkmService.getProfileByNik(context.token);
  const claimLabel = claim?.status ? claimStatusLabel(claim.status) : "Belum Ajukan";

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-8">
        <PageHeader
          title="Dashboard Pengguna"
          description="Ringkasan status profil, claim, dan pengajuan layanan Anda."
        />

        <Card>
          <CardHeader className="gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Profil UMKM</CardTitle>
                <CardDescription>Ringkasan profil usaha yang terhubung dengan akun Anda.</CardDescription>
              </div>
              <Link
                href="/user/profil-umkm"
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Update Profil
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="profile">
                <AccordionTrigger className="rounded-xl bg-slate-50 px-4">
                  <span className="text-sm font-semibold text-slate-800">Detail Profil UMKM</span>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  {resolvedProfile ? (
                    <div className="grid gap-4 pt-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Nama Usaha</p>
                        <p className="text-sm font-semibold text-slate-900">{resolvedProfile.nama_usaha}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Nama Pengusaha</p>
                        <p className="text-sm font-semibold text-slate-900">{resolvedProfile.nama_pengusaha}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">NIK Pengusaha</p>
                        <p className="text-sm text-slate-800">{resolvedProfile.nik_pengusaha}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Kontak HP</p>
                        <p className="text-sm text-slate-800">{resolvedProfile.kontak_hp}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">NIB</p>
                        <p className="text-sm text-slate-800">{resolvedProfile.nib ?? "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Status Verifikasi</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {resolvedProfile.is_verified ? "Terverifikasi" : "Belum Verifikasi"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold text-slate-500">Alamat Usaha</p>
                        <p className="text-sm text-slate-800">{resolvedProfile.alamat_usaha}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 text-sm text-slate-500">
                      Profil UMKM belum tersedia. Silakan lengkapi profil terlebih dahulu.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <ClaimUmkmForm latestClaim={claim} />
      </div>
    </PortalShell>
  );
}