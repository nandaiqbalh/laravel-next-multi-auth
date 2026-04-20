import { z } from "zod";

export const createUserSchema = z.object({
  nik: z.string().min(16, "NIK minimal 16 digit").regex(/^[0-9]+$/, "NIK harus berupa angka"),
  name: z.string().min(1, "Nama harus diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role_id: z.string().min(1, "Role harus dipilih"),
});

export const editUserSchema = z.object({
  nik: z.string().min(16, "NIK minimal 16 digit").regex(/^[0-9]+$/, "NIK harus berupa angka"),
  name: z.string().min(1, "Nama harus diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  role_id: z.string().min(1, "Role harus dipilih"),
});
