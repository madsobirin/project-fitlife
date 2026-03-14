import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArtikelSchema } from "@/lib/definition";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");
    const featured = searchParams.get("featured") === "true";
    const id = searchParams.get("id") || undefined;
    const slug = searchParams.get("slug") || undefined;

    const idParsed = id ? parseInt(id) : undefined;
    const finalId = isNaN(idParsed as number) ? undefined : idParsed;

    const artikels = await prisma.artikel.findMany({
      where: {
        id: finalId,
        slug: slug || undefined,
        kategori: kategori || undefined,
        is_featured: searchParams.has("featured") ? featured : undefined,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(artikels);
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
      { message: "Gagal mengambil artikel" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ArtikelSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { errors: validated.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const slug = validated.data.judul
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const newArtikel = await prisma.artikel.create({
      data: {
        ...validated.data,
        slug: `${slug}-${Date.now()}`,
      },
    });

    return NextResponse.json(newArtikel, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Gagal membuat artikel: Artikel tidak ditemukan." },
          { status: 404 },
        );
      }
    }
    return NextResponse.json(
      { message: "Gagal membuat artikel" },
      { status: 500 },
    );
  }
}
