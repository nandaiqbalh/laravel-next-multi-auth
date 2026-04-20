import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubmissionStatusBadge } from "../../../../features/umkm/components/StatusBadge";
import { AdminClaimActions } from "@/features/umkm/components/AdminClaimActions";
import { AdminSubmissionActions } from "@/features/umkm/components/AdminSubmissionActions";
import { umkmService } from "@/features/umkm/services/umkmService";

export const metadata = {
  title: 'Validasi Pengajuan UMKM',
  description: 'Kelola dan validasi pengajuan layanan UMKM.',
};


/**
 * Admin UMKM queue page to process claim and service submission.
 */
export default async function AdminPengajuanPage() {
  const session = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  const [claims, submissions] = await Promise.all([
    umkmService.getAdminClaims(session.token),
    umkmService.getAdminSubmissions(session.token),
  ]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Validasi Claim UMKM</CardTitle>
          <CardDescription>Proses approve/reject claim sebelum user mengajukan layanan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Profile ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.items.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>#{claim.id}</TableCell>
                  <TableCell>{claim.umkm_profile_id}</TableCell>
                  <TableCell>{claim.status}</TableCell>
                  <TableCell>{claim.catatan_admin ?? "-"}</TableCell>
                  <TableCell>
                    <AdminClaimActions claimId={claim.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validasi Pengajuan Layanan</CardTitle>
          <CardDescription>Kelola status pengajuan layanan UMKM.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Profile ID</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.items.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>#{submission.id}</TableCell>
                  <TableCell>{submission.umkm_profile_id}</TableCell>
                  <TableCell>{submission.service?.name ?? `Service #${submission.service_id}`}</TableCell>
                  <TableCell>
                    <SubmissionStatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell>
                    <AdminSubmissionActions submissionId={submission.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
