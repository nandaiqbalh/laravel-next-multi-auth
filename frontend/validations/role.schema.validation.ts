import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Nama role harus diisi"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug role harus diisi")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  perangkat_daerah_id: z.union([z.number().int().positive(), z.null()]).optional(),
});
