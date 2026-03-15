"use client";

import LayoutAdmin from "@/components/admin/LayoutAdmin";
import { motion } from "framer-motion";
import { Users, Utensils, Newspaper, UserCheck } from "lucide-react";

// Data Dummy sesuai gambar
const stats = [
  { label: "Total Pengguna", value: "4", icon: Users },
  { label: "Pengguna Aktif", value: "3", icon: UserCheck },
  { label: "Total Menu", value: "3", icon: Utensils },
  { label: "Total Artikel", value: "1", icon: Newspaper },
];

const menuTerbaru = [
  { no: 1, nama: "brokoli", dilihat: "4x" },
  { no: 2, nama: "kocak", dilihat: "5x" },
  { no: 3, nama: "Sawi", dilihat: "7x" },
];

const penggunaTerbaru = [
  {
    no: 1,
    nama: "Putri Maharani",
    email: "zvory3168@gmail.com",
    status: "Aktif",
    tgl: "08 Maret 2026 15:00",
  },
  {
    no: 2,
    nama: "Ahmad Sobirin",
    email: "ahmadsobirin67834@gmail.com",
    status: "Aktif",
    tgl: "05 Maret 2026 14:26",
  },
  {
    no: 3,
    nama: "bansn",
    email: "gamingbrn2202@gmail.com",
    status: "Belum Login",
    tgl: "",
  },
  {
    no: 4,
    nama: "Ahmad Sobirin",
    email: "gamingbrn202@gmail.com",
    status: "Aktif",
    tgl: "04 Maret 2026 21:32",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function BerandaPage() {
  return (
    <LayoutAdmin>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard Admin
          </h1>
          <p className="text-sm text-slate-500">
            Update terakhir:{" "}
            {new Date().toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* STATS CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <stat.icon className="h-4 w-4 text-emerald-500/70" />
              </div>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
          {/* MENU TERBARU TABLE */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="xl:col-span-5 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-4 md:p-5 border-b border-slate-50">
              <h2 className="font-bold text-slate-800">Menu Terbaru</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-5 py-3 border-b">No</th>
                    <th className="px-5 py-3 border-b">Nama Menu</th>
                    <th className="px-5 py-3 border-b">Dilihat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {menuTerbaru.map((item) => (
                    <tr
                      key={item.no}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-slate-600">{item.no}</td>
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {item.nama}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {item.dilihat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* PENGGUNA TERBARU TABLE */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="xl:col-span-7 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-4 md:p-5 border-b border-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">Pengguna Terbaru</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-5 py-3 border-b">No</th>
                    <th className="px-5 py-3 border-b">Nama</th>
                    <th className="px-5 py-3 border-b">Email</th>
                    <th className="px-5 py-3 border-b text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {penggunaTerbaru.map((user) => (
                    <tr
                      key={user.no}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-slate-600">{user.no}</td>
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {user.nama}
                      </td>
                      <td className="px-5 py-4 text-slate-500">{user.email}</td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${
                              user.status === "Aktif"
                                ? "bg-emerald-500"
                                : "bg-slate-500"
                            }`}
                          >
                            {user.status}
                          </span>
                          {user.tgl && (
                            <span className="text-[10px] text-slate-400">
                              {user.tgl}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-50 flex justify-center sm:justify-end">
              <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors px-4 py-2 border border-emerald-100 rounded-lg hover:bg-emerald-50 w-full sm:w-auto">
                Lihat semua pengguna
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
