"use client";

import Link from "next/link";
import { Sun, Menu } from "lucide-react";
import Image from "next/image";

const NavClient = () => {
  return (
    <div className="flex items-center justify-center">
      <nav className="w-[90%] md:w-[70%] mt-5 bg-[#18382b] text-gray-300 rounded-2xl">
        <div className="w-full md:w-[80%] mx-auto flex items-center justify-between px-6 py-4 md:px-2 md:py-4">
          {/* LEFT - Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={30}
              height={30}
              alt="Logo Perusahaan"
            />
            <span className="text-lg font-semibold text-green-400">
              FitLife.id
            </span>
          </div>

          {/* CENTER - Menu */}
          <div className="hidden md:flex items-center gap-8 md:text-md font-medium">
            <Link
              href="/"
              className="relative text-green-400 after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-green-400"
            >
              Home
            </Link>

            <Link href="/bmi" className="hover:text-green-400 transition">
              Kalkulator BMI
            </Link>

            <Link
              href="/menu-sehat"
              className="hover:text-green-400 transition"
            >
              Menu Sehat
            </Link>

            <Link href="/artikel" className="hover:text-green-400 transition">
              Artikel
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-12 h-12 items-center justify-center rounded-full hover:bg-green-700 transition flex">
              <Sun size={22} className="text-yellow-400" />
            </button>

            <button className="hidden md:flex bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-full transition">
              Login
            </button>

            <button className="md:hidden w-12 h-12 flex items-center justify-center rounded-full hover:bg-green-700 transition">
              <Menu size={22} className="text-white" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavClient;
