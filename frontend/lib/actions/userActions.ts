"use server";

import { auth } from "@/auth";
import { userRepository } from "@/lib/repositories/userRepository";

/**
 * Fetch paginated users using server-side token access.
 */
export async function getUsersAction(page = 1, search = "") {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return userRepository.list(session.token, page, search);
}

/**
 * Create user using admin bearer token from session.
 */
export async function createUserAction(payload: {
  name: string;
  email: string;
  password: string;
  role_id: number;
}) {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return userRepository.create(session.token, payload);
}

/**
 * Update user using admin bearer token from session.
 */
export async function updateUserAction(
  id: string,
  payload: { name: string; email: string; password?: string; role_id: number },
) {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return userRepository.update(session.token, id, payload);
}

/**
 * Remove user using admin bearer token from session.
 */
export async function deleteUserAction(id: string) {
  const session = await auth();

  if (!session?.token) {
    throw new Error("Unauthenticated");
  }

  return userRepository.remove(session.token, id);
}
