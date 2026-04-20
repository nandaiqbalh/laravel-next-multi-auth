"use server";

import { signOut } from "@/auth";
import { authService } from "@/lib/services/authService";

/**
 * Register user account from server action layer.
 */
export async function registerAction(payload: { nik: string; name: string; email: string; password: string }) {
  return authService.register(payload);
}

/**
 * Execute sign out and redirect to login.
 */
export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
