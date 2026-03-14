import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MenuSchema } from "@/lib/definition";
import { TargetStatus } from "@/generated/prisma/client";

const VALID_TARGET_STATUS = ["Kurus", "Normal", "Berlebih", "Obesitas"];

// GET: Mengambil data menu
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get("target");
    const idParam = searchParams.get("id");

    // Validasi target terhadap enum
    if (target && !VALID_TARGET_STATUS.includes(target)) {
      return NextResponse.json(
        {
          message:
            "Target status tidak valid. Pilihan: Kurus, Normal, Berlebih, Obesitas",
        },
        { status: 400 },
      );
    }

    // Validasi id jika ada
    let idParsed: number | undefined;
    if (idParam) {
      idParsed = parseInt(idParam);
      if (isNaN(idParsed)) {
        return NextResponse.json(
          { message: "ID tidak valid" },
          { status: 400 },
        );
      }
    }

    const menus = await prisma.menu.findMany({
      where: {
        id: idParsed,
        target_status: target ? (target as TargetStatus) : undefined,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(menus, { status: 200 });
  } catch (error: unknown) {
    console.error("GET_MENUS_ERROR", error);
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

// POST: Menambah menu baru
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedFields = MenuSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const newMenu = await prisma.menu.create({
      data: validatedFields.data,
    });

    return NextResponse.json(
      { message: "Menu berhasil ditambahkan", data: newMenu },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("POST_MENU_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
