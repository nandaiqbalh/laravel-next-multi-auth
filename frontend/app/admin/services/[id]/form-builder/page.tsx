import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ServiceFormBuilderClient } from "@/components/features/umkm-admin/services/ServiceFormBuilderClient";
import { getManagedServiceDetailAction, getServiceFormFieldsAction } from "@/lib/actions/serviceManagementActions";

type AdminServiceFormBuilderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminServiceFormBuilderPage({ params }: AdminServiceFormBuilderPageProps) {
  const { id } = await params;
  const serviceId = Number(id);

  if (!Number.isFinite(serviceId) || serviceId < 1) {
    notFound();
  }

  const [serviceResponse, fieldsResponse] = await Promise.all([
    getManagedServiceDetailAction(serviceId),
    getServiceFormFieldsAction(serviceId),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Form Builder: ${serviceResponse.data.name}`}
        description={`Atur field dinamis untuk layanan ${serviceResponse.data.code}.`}
      />
      <ServiceFormBuilderClient serviceId={serviceId} initialFields={fieldsResponse.data} />
    </div>
  );
}
