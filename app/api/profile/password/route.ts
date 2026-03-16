import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await request.json();

    const user = await prisma.account.findUnique({
      where: { id: parseInt(userId) },
      select: { password: true },
    });

    if (!user?.password) {
      return NextResponse.json(
        { message: "Akun ini tidak menggunakan password" },
        { status: 400 },
      );
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "Password saat ini salah" },
        { status: 401 },
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.account.update({
      where: { id: parseInt(userId) },
      data: { password: hashed, updated_at: new Date() },
    });

    return NextResponse.json(
      { message: "Password berhasil diubah" },
      { status: 200 },
    );
  } catch (error) {
    console.error("PASSWORD_CHANGE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
