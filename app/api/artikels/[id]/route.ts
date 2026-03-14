import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArtikelSchema } from "@/lib/definition";
import { Prisma } from "@/generated/prisma/client";

// GET: Detail Artikel & Auto-increment Views
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const artikel = await prisma.artikel.update({
      where: { id },
      data: { dibaca: { increment: 1 } },
    });

    return NextResponse.json(artikel);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Gagal mengambil artikel: Artikel tidak ditemukan." },
          { status: 404 },
        );
      }
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT: Update Artikel
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const body = await request.json();

    const validated = ArtikelSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { errors: validated.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updated = await prisma.artikel.update({
      where: { id },
      data: validated.data,
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Gagal update: Artikel tidak ditemukan." },
          { status: 404 },
        );
      }
    }
    return NextResponse.json(
      { message: "Gagal update artikel" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    await prisma.artikel.delete({ where: { id } });

    return NextResponse.json({ message: "Artikel berhasil dihapus" });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Gagal menghapus: Artikel tidak ditemukan." },
          { status: 404 },
        );
      }
    }
    console.error("DELETE_ARTIKEL_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server saat menghapus data." },
      { status: 500 },
    );
  }
}
