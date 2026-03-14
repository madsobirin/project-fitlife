import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LoginFormSchema } from "@/lib/definition";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validasi field
    const validatedFields = LoginFormSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, password } = validatedFields.data;

    // 2. Cari user di database
    const user = await prisma.account.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 },
      );
    }

    // 3. Cek Password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 },
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    return NextResponse.json(
      {
        message: "Login berhasil",
        token: token,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
