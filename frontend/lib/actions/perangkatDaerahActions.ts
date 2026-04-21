"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { perangkatDaerahRepository } from "@/lib/repositories/perangkatDaerahRepository";

async function getTokenOrThrow() {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return session.token;
}

export async function getPerangkatDaerahAction(page = 1, search = "") {
  const token = await getTokenOrThrow();
  return perangkatDaerahRepository.list(token, page, search);
}

export async function createPerangkatDaerahAction(payload: { name: string; description?: string; slug?: string }) {
  const token = await getTokenOrThrow();
  const response = await perangkatDaerahRepository.create(token, payload);

  revalidatePath("/superadmin/perangkat-daerah");
  revalidatePath("/");

  return response;
}

export async function updatePerangkatDaerahAction(
  id: number,
  payload: { name: string; description?: string; slug?: string },
) {
  const token = await getTokenOrThrow();
  const response = await perangkatDaerahRepository.update(token, id, payload);

  revalidatePath("/superadmin/perangkat-daerah");
  revalidatePath("/");

  return response;
}

export async function deletePerangkatDaerahAction(id: number) {
  const token = await getTokenOrThrow();
  const response = await perangkatDaerahRepository.remove(token, id);

  revalidatePath("/superadmin/perangkat-daerah");
  revalidatePath("/");

  return response;
}

export async function getPublicPerangkatDaerahAction() {
  return perangkatDaerahRepository.listPublic();
}
