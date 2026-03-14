import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignupFormSchema } from "@/lib/definition";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedFields = SignupFormSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, password } = validatedFields.data;

    const existingAccount = await prisma.account.findUnique({
      where: { email },
    });
    if (existingAccount) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.account.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: user.id },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
