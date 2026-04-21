"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { serviceFormFieldRepository } from "@/lib/repositories/serviceFormFieldRepository";
import { serviceManagementRepository } from "@/lib/repositories/serviceManagementRepository";

async function getTokenOrThrow() {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return session.token;
}

export async function getManagedServicesAction(page = 1, search = "", perangkatDaerahId?: number) {
  const token = await getTokenOrThrow();
  return serviceManagementRepository.list(token, page, search, perangkatDaerahId);
}

export async function getManagedServiceDetailAction(id: number) {
  const token = await getTokenOrThrow();
  return serviceManagementRepository.find(token, id);
}

export async function createManagedServiceAction(payload: {
  code: string;
  name: string;
  perangkat_daerah_id: number;
  is_active?: boolean;
}) {
  const token = await getTokenOrThrow();
  const response = await serviceManagementRepository.create(token, payload);

  revalidatePath("/admin/services");

  return response;
}

export async function updateManagedServiceAction(
  id: number,
  payload: {
    code: string;
    name: string;
    perangkat_daerah_id: number;
    is_active?: boolean;
  },
) {
  const token = await getTokenOrThrow();
  const response = await serviceManagementRepository.update(token, id, payload);

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}/form-builder`);

  return response;
}

export async function deleteManagedServiceAction(id: number) {
  const token = await getTokenOrThrow();
  const response = await serviceManagementRepository.remove(token, id);

  revalidatePath("/admin/services");

  return response;
}

export async function getServiceFormFieldsAction(serviceId: number) {
  const token = await getTokenOrThrow();
  return serviceFormFieldRepository.list(token, serviceId);
}

export async function createServiceFormFieldAction(
  serviceId: number,
  payload: {
    label: string;
    name: string;
    type: string;
    is_required?: boolean;
    options?: string[];
    order: number;
    placeholder?: string;
  },
) {
  const token = await getTokenOrThrow();
  const response = await serviceFormFieldRepository.create(token, serviceId, payload);

  revalidatePath(`/admin/services/${serviceId}/form-builder`);

  return response;
}

export async function updateServiceFormFieldAction(
  serviceId: number,
  fieldId: number,
  payload: Partial<{
    label: string;
    name: string;
    type: string;
    is_required: boolean;
    options: string[];
    order: number;
    placeholder: string;
  }>,
) {
  const token = await getTokenOrThrow();
  const response = await serviceFormFieldRepository.update(token, fieldId, payload);

  revalidatePath(`/admin/services/${serviceId}/form-builder`);

  return response;
}

export async function deleteServiceFormFieldAction(serviceId: number, fieldId: number) {
  const token = await getTokenOrThrow();
  const response = await serviceFormFieldRepository.remove(token, fieldId);

  revalidatePath(`/admin/services/${serviceId}/form-builder`);

  return response;
}

export async function reorderServiceFormFieldAction(serviceId: number, fields: Array<{ id: number; order: number }>) {
  const token = await getTokenOrThrow();
  const response = await serviceFormFieldRepository.reorder(token, serviceId, fields);

  revalidatePath(`/admin/services/${serviceId}/form-builder`);

  return response;
}
