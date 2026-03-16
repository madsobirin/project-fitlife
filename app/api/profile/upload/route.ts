import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("photo") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP" },
        { status: 400 },
      );
    }

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Ukuran file maksimal 2MB" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat folder kalau belum ada
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadDir, { recursive: true });

    // Nama file unik
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `avatar_${userId}_${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const photoUrl = `/uploads/avatars/${filename}`;

    // Update ke database
    const updated = await prisma.account.update({
      where: { id: parseInt(userId) },
      data: { photo: photoUrl, updated_at: new Date() },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
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
      { message: "Foto berhasil diupload", user: updated, photoUrl },
      { status: 200 },
    );
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
