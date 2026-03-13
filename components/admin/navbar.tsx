"use client";

import { Search, Menu } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {pathname !== "/menu" && (
          <div className="relative hidden md:block w-96">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari data pasien, menu, atau artikel..."
              className="w-full bg-slate-50/80 border border-slate-100 py-2.5 pl-12 pr-4 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Mobile Search Icon */}
        {pathname !== "/menu" && (
          <button className="md:hidden relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <Search size={22} />
          </button>
        )}

        {/* Divider Vertical */}
        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-tight">
              Dr. Andi Wijaya
            </p>
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider">
              ADMINISTRATOR
            </p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-orange-200 overflow-hidden">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Andi"
                alt="Avatar"
                className="w-full h-full object-cover"
                height={40}
                width={40}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
