import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.account.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        password: true,
        role: true,
        phone: true,
        birthdate: true,
        weight: true,
        height: true,
        photo: true,
        google_avatar: true,
        created_at: true,
        last_login_at: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("PROFILE_GET_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, username, phone, birthdate, weight, height } = body;

    // Cek username unik (kalau diisi)
    if (username) {
      const existing = await prisma.account.findFirst({
        where: {
          username,
          NOT: { id: parseInt(userId) },
        },
      });
      if (existing) {
        return NextResponse.json(
          { message: "Username sudah digunakan" },
          { status: 409 },
        );
      }
    }

    const updated = await prisma.account.update({
      where: { id: parseInt(userId) },
      data: {
        name: name || undefined,
        username: username || undefined,
        phone: phone || undefined,
        birthdate: birthdate ? new Date(birthdate) : undefined,
        weight: weight ? parseInt(weight) : undefined,
        height: height ? parseInt(height) : undefined,
        updated_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        password: true,
        role: true,
        phone: true,
        birthdate: true,
        weight: true,
        height: true,
        photo: true,
        google_avatar: true,
      },
    });

    return NextResponse.json(
      { message: "Profil diperbarui", user: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("PROFILE_PATCH_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
