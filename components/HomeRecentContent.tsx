"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Utensils,
  BookOpen,
  ChevronRight,
  Flame,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";

type Menu = {
  id: number;
  nama_menu: string;
  slug: string;
  kalori: number;
  waktu_memasak: number;
  gambar: string;
};

type Artikel = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  gambar: string;
};

export default function HomeRecentContent() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [loadingArtikel, setLoadingArtikel] = useState(true);

  useEffect(() => {
    fetch("/api/menus")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Menu[]) => setMenus(data.slice(0, 5)))
      .catch(() => setMenus([]))
      .finally(() => setLoadingMenu(false));
  }, []);

  useEffect(() => {
    fetch("/api/artikels")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Artikel[]) => setArtikels(data.slice(0, 5)))
      .catch(() => setArtikels([]))
      .finally(() => setLoadingArtikel(false));
  }, []);

  return (
    <section className="py-16 bg-background-base border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* ── Menu Sehat Terbaru ── */}
          <div className="bg-card-dark rounded-2xl p-6 shadow-sm border border-card-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text-light flex items-center gap-2">
                <Utensils size={20} className="text-primary" />
                Menu Sehat Terbaru
              </h3>
              <Link
                href="/menu"
                className="text-primary text-sm font-semibold hover:text-text-light transition flex items-center gap-1 group"
              >
                Lihat semua
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            {loadingMenu ? (
              <div className="h-32 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : menus.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-text-muted italic bg-background-base/50 rounded-xl border border-dashed border-card-border text-sm">
                Belum ada menu yang tersedia.
              </div>
            ) : (
              <div className="space-y-1">
                {menus.map((item) => (
                  <Link key={item.id} href={`/menu/${item.slug}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-base/60 transition-all group cursor-pointer">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-card-border">
                        <Image
                          src={item.gambar}
                          alt={item.nama_menu}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-light truncate group-hover:text-primary transition-colors">
                          {item.nama_menu}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-text-muted uppercase tracking-wide">
                            <Flame size={11} className="text-orange-400" />
                            {item.kalori}kkal
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-text-muted uppercase tracking-wide">
                            <Clock size={11} className="text-primary/70" />
                            {item.waktu_memasak}m
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        size={15}
                        className="text-text-muted/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Artikel Terbaru ── */}
          <div className="bg-card-dark rounded-2xl p-6 shadow-sm border border-card-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text-light flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                Artikel Terbaru
              </h3>
              <Link
                href="/artikel"
                className="text-primary text-sm font-semibold hover:text-text-light transition flex items-center gap-1 group"
              >
                Lihat semua
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            {loadingArtikel ? (
              <div className="h-32 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : artikels.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-text-muted italic bg-background-base/50 rounded-xl border border-dashed border-card-border text-sm">
                Belum ada artikel.
              </div>
            ) : (
              <div className="space-y-1">
                {artikels.map((item) => (
                  <Link key={item.id} href={`/artikel/${item.slug}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-base/60 transition-all group cursor-pointer">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-card-border">
                        <Image
                          src={item.gambar}
                          alt={item.judul}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">
                          {item.kategori}
                        </p>
                        <p className="text-sm font-bold text-text-light truncate group-hover:text-primary transition-colors">
                          {item.judul}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        size={15}
                        className="text-text-muted/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
