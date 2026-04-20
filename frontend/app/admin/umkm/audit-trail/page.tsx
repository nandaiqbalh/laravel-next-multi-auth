import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { AuditTrailClient } from "@/components/features/audit-trail/AuditTrailClient";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Audit Trail UMKM',
  description: 'Lihat riwayat audit tindakan UMKM dan pengguna.',
};


/**
 * UMKM admin audit trail page.
 */
export default async function AdminAuditTrailPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const audits = await umkmService.getAdminAuditTrail(session.token);

  return (
    <div className="space-y-4">
      <PageHeader title="Audit Trail" description="Jejak aktivitas claim, profile, dan submission." />
      <AuditTrailClient initialData={audits} token={session.token} scope="admin" />
    </div>
  );
}
