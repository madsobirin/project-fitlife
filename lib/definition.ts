import { z } from "zod";

// Auth Definisi nih
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

// Menu Definisi nih
export const MenuSchema = z.object({
  nama_menu: z.string().min(3, "Nama menu minimal 3 karakter"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  kalori: z.number().int().positive(),
  target_status: z.enum(["Kurus", "Normal", "Berlebih", "Obesitas"]),
  waktu_memasak: z.number().int().positive(),
  gambar: z.string().url("Format gambar harus URL"),
});

// artikel definis nih
export const ArtikelSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter"),
  kategori: z.string().min(3, "Kategori harus diisi"),
  penulis: z.string().optional().default("Admin"),
  isi: z.string().min(20, "Isi artikel terlalu pendek"),
  gambar: z.string().url("Gambar harus berupa URL valid"),
  is_featured: z.boolean().optional().default(false),
  dibaca: z.number().int().optional().default(0),
});
