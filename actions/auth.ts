"use server";
import { SignupFormSchema, LoginFormSchema } from "@/lib/definition";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validatedFields.data;

  // 2. Cek apakah user sudah ada
  const existingAccount = await prisma.account.findUnique({ where: { email } });
  if (existingAccount) return { error: { email: ["Email sudah terdaftar."] } };

  // 3. Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Simpan ke Database
  await prisma.account.create({
    data: { name, email, password: hashedPassword },
  });

  redirect("/login?registered=1");
}

export async function login(formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  // Cari user
  const user = await prisma.account.findUnique({ where: { email } });
  if (!user) return { error: { form: ["Email atau password salah."] } };

  // Cek password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    return { error: { form: ["Email atau password salah."] } };
  // Di sini nanti anda setup Session (NextAuth), untuk sekarang kita redirect
  redirect("/dashboard");
}
