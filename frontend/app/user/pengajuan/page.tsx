import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PortalShell } from "@/features/umkm/components/PortalShell";
import { SubmissionHistoryPanel } from "../../../features/umkm/components/SubmissionHistoryPanel";
import { umkmService } from "@/features/umkm/services/umkmService";
import { requireRole } from "@/features/umkm/utils/guards";

export const metadata = {
  title: 'Pengajuan Layanan',
  description: 'Ajukan layanan digital dan lihat riwayat pengajuan.',
};

/**
 * Submission page for user role.
 */
export default async function UserSubmissionPage() {
  const context = await requireRole(["UMKM_USER"]);

  const submissions = await umkmService.getMySubmissions(context.token);

  return (
    <PortalShell role="UMKM_USER" userName={context.user.name} userEmail={context.user.email}>
      <div className="space-y-4">
        <PageHeader
          title="Pengajuan Layanan"
          description="Lihat riwayat pengajuan dan ajukan layanan baru melalui form dinamis."
          actions={
            <Link href="/user/pengajuan/create">
              <Button>Ajukan</Button>
            </Link>
          }
        />

        <SubmissionHistoryPanel submissions={submissions.items} />
      </div>
    </PortalShell>
  );
}
