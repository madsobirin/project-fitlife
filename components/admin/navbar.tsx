"use client";

import { Search, Menu, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  return (
    <header className="h-20 bg-white dark:bg-card-dark border-b border-slate-100 dark:border-card-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 dark:text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="relative hidden md:block w-96">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 dark:text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari data pasien, menu, atau artikel..."
            className="w-full bg-slate-50/80 dark:bg-background-dark border border-slate-100 dark:border-card-border py-2.5 pl-12 pr-4 rounded-xl text-sm text-slate-700 dark:text-text-light placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Mobile Search Icon */}
        <button className="md:hidden relative p-2 text-slate-500 dark:text-text-muted hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Search size={22} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative p-2 text-slate-500 dark:text-text-muted hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Divider Vertical */}
        <div className="h-8 w-px bg-slate-200 dark:bg-card-border" />

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 dark:text-text-light leading-tight">
              Dr. Andi Wijaya
            </p>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
              ADMINISTRATOR
            </p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-200 dark:border-orange-500/30 overflow-hidden">
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
