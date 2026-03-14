import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MenuSchema } from "@/lib/definition";
import { TargetStatus } from "@/generated/prisma/client";

// GET: Mengambil data menu
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get("target");

    const menus = await prisma.menu.findMany({
      where: {
        id: searchParams.get("id")
          ? parseInt(searchParams.get("id") || "0")
          : undefined,
        target_status: target ? (target as TargetStatus) : undefined,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
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
  } catch (error) {
    console.error("POST_MENU_ERROR", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
