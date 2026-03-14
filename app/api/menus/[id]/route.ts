import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MenuSchema } from "@/lib/definition";

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

    const menu = await prisma.menu.update({
      where: { id },
      data: { dibaca: { increment: 1 } },
    });

    return NextResponse.json(menu);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Menu tidak ditemukan" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 2. PUT: Update Data
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
    const validatedFields = MenuSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: validatedFields.data,
    });

    return NextResponse.json({
      message: "Berhasil diperbarui",
      data: updatedMenu,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Menu tidak ditemukan" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Gagal memperbarui menu" },
      { status: 500 },
    );
  }
}

// 3. DELETE: Hapus Data
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

    await prisma.menu.delete({ where: { id } });

    return NextResponse.json({ message: "Menu berhasil dihapus" });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Menu sudah tidak ada" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Gagal menghapus menu" },
      { status: 500 },
    );
  }
}
