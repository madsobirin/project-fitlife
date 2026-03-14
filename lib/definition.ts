import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter." }).trim(),
  email: z.string().email({ message: "Email tidak valid." }).trim(),

  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter." })
    .regex(/[a-zA-Z]/, { message: "Harus mengandung huruf." })
    .regex(/[0-9]/, { message: "Harus mengandung angka." })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Email tidak valid." }),
  password: z.string().min(1, { message: "Password harus diisi." }),
});

// Definiton Menu
export const MenuSchema = z.object({
  nama_menu: z.string().min(3, "Nama menu minimal 3 karakter"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  kalori: z.number().int().positive(),
  target_status: z.enum(["Kurus", "Normal", "Berlebih", "Obesitas"]),
  waktu_memasak: z.number().int().positive(),
  gambar: z.string().url("Format gambar harus URL"),
});
