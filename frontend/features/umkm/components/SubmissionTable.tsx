import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubmissionStatusBadge } from "./StatusBadge";
import type { SubmissionItem } from "@/features/umkm/types/umkm";

/**
 * SubmissionTable renders submission list in table layout.
 * @param submissions Submission items.
 * @returns JSX element.
 *
 * Usage:
 * <SubmissionTable submissions={items} />
 */
export function SubmissionTable({ submissions }: { submissions: SubmissionItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Layanan</TableHead>
          <TableHead>Perangkat Daerah</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Dokumen</TableHead>
          <TableHead>Catatan Admin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((item) => (
          <TableRow key={item.id}>
            <TableCell>#{item.id}</TableCell>
            <TableCell>{item.service?.name ?? `Service #${item.service_id}`}</TableCell>
            <TableCell>
              {item.service?.perangkat_daerah?.name ??
                (item.service?.perangkat_daerah_id ? `PD #${item.service.perangkat_daerah_id}` : "-")}
            </TableCell>
            <TableCell>
              <SubmissionStatusBadge status={item.status} />
            </TableCell>
            <TableCell>
              <a href={item.document_url} target="_blank" rel="noreferrer" className="text-primary underline">
                Lihat Dokumen
              </a>
            </TableCell>
            <TableCell>{item.catatan_admin ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
