import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { PublicServiceSubmissionForm } from "@/components/landing/PublicServiceSubmissionForm";
import { serviceFormFieldRepository } from "@/lib/repositories/serviceFormFieldRepository";
import { serviceManagementRepository } from "@/lib/repositories/serviceManagementRepository";
import { resolveRoleScope } from "@/features/umkm/utils/roleRouting";

export default async function PublicLayananServiceDetailPage({
  params,
}: {
  params: { slug: string; serviceId: string };
}) {
  const { slug, serviceId } = params;
  const numericServiceId = Number(serviceId);

  if (!Number.isFinite(numericServiceId) || numericServiceId < 1) {
    notFound();
  }

  const [serviceResponse, fieldsResponse, session] = await Promise.all([
    serviceManagementRepository.listPublicBySlug(slug),
    serviceFormFieldRepository.listPublic(numericServiceId),
    auth(),
  ]);

  const service = serviceResponse.data.find((item) => item.id === numericServiceId);

  if (!service) {
    notFound();
  }

  const canSubmit = !!session?.token && resolveRoleScope(session.user.roleSlug, session.user.role) === "user";

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Detail Layanan</p>
        <h1 className="text-3xl font-bold text-slate-900">{service.name}</h1>
        <p className="text-slate-600">Kode layanan: {service.code}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <PublicServiceSubmissionForm service={service} fields={fieldsResponse.data} canSubmit={canSubmit} />
      </section>
    </main>
  );
}
