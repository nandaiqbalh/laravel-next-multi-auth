"use server";

import { auth } from "@/auth";
import { roleRepository } from "@/lib/repositories/roleRepository";

/**
 * Fetch paginated roles using server-side token access.
 */
export async function getRolesAction(page = 1, search = "") {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return roleRepository.list(session.token, page, search);
}

/**
 * Create role using admin bearer token from session.
 */
export async function createRoleAction(payload: { name: string; slug: string; perangkat_daerah_id?: number | null }) {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return roleRepository.create(session.token, payload);
}

/**
 * Update role using admin bearer token from session.
 */
export async function updateRoleAction(id: number, payload: { name: string; slug: string; perangkat_daerah_id?: number | null }) {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return roleRepository.update(session.token, id, payload);
}

/**
 * Remove role using admin bearer token from session.
 */
export async function deleteRoleAction(id: number) {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return roleRepository.remove(session.token, id);
}
