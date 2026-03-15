import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Clock,
  Activity,
} from "lucide-react";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Image from "next/image";
import Link from "next/link";

interface MenuSehat {
  id: string;
  nomor: string;
  foto: string;
  nama: string;
  targetStatus: "Normal" | "Stabil";
  nutrisi: string;
  durasi: string;
  deskripsi: string;
}

const MENU_DATA: MenuSehat[] = [
  {
    id: "1",
    nomor: "01",
    foto: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=60",
    nama: "Salad Brokoli Segar",
    targetStatus: "Normal",
    nutrisi: "230 kkal",
    durasi: "20 menit",
    deskripsi: "Salad sehat dengan saus sasa rendah lemak...",
  },
  {
    id: "2",
    nomor: "02",
    foto: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60",
    nama: "Buddha Bowl Kacang",
    targetStatus: "Stabil",
    nutrisi: "222 kkal",
    durasi: "222 menit",
    deskripsi: "Perpaduan sayur dan saus kacang sasa...",
  },
  {
    id: "3",
    nomor: "03",
    foto: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=60",
    nama: "Tumis Sawi Bawang",
    targetStatus: "Stabil",
    nutrisi: "250 kkal",
    durasi: "200 menit",
    deskripsi: "Sawi segar ditumis bumbu sasa alami...",
  },
];

export default function MenuPage() {
  return (
    <LayoutAdmin>
      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Daftar Menu Sehat
            </h1>
            <p className="text-gray-500 text-sm">
              Kelola menu makanan harian Anda
            </p>
          </div>
          <Link
            href="/menu/create"
            className="w-fit bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-green-500/20"
          >
            <Plus className="w-5 h-5" />
            Tambah Menu
          </Link>
        </div>

        {/* Search & Filters Container */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#22c55e] focus:border-transparent text-sm transition-all outline-none"
              placeholder="Cari menu favorit..."
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-xl hover:text-[#22c55e] hover:border-[#22c55e] transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-5 h-5" />
            <span className="sm:hidden text-sm font-medium">Filter</span>
          </button>
        </div>

        {/* --- Mobile Card View (Tampil hanya di Mobile) --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
          {MENU_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex gap-4">
                <Image
                  alt={item.nama}
                  className="w-20 h-20 object-cover rounded-xl shadow-sm"
                  src={item.foto}
                  width={80}
                  height={80}
                  unoptimized
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-gray-400">
                      #{item.nomor}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.targetStatus === "Normal"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {item.targetStatus.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mt-1">{item.nama}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" /> {item.nutrisi}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.durasi}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.deskripsi}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                <button className="flex items-center justify-center py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold">
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </button>
                <button className="flex items-center justify-center py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- Desktop Table View (Sembunyi di Mobile) --- */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Menu
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Target Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nutrisi
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Durasi
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MENU_DATA.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-6 text-sm text-gray-400">
                      {item.nomor}
                    </td>
                    <td className="px-6 py-6">
                      <Image
                        alt={item.nama}
                        className="w-16 h-12 object-cover rounded-lg"
                        src={item.foto}
                        width={100}
                        height={100}
                        unoptimized
                      />
                    </td>
                    <td className="px-6 py-6 font-semibold text-gray-900">
                      {item.nama}
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          item.targetStatus === "Normal"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {item.targetStatus}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm text-gray-600">
                      {item.nutrisi}
                    </td>
                    <td className="px-6 py-6 text-sm text-gray-600">
                      {item.durasi}
                    </td>
                    <td className="px-6 py-6 text-right space-x-2">
                      <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="mt-6 px-2 sm:px-6 py-4 bg-white md:bg-gray-50 border border-gray-100 md:border-t rounded-2xl md:rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500 order-2 sm:order-1">
            Menampilkan{" "}
            <span className="font-semibold text-gray-900">
              {MENU_DATA.length}
            </span>{" "}
            dari 12 menu
          </span>
          <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center">
            <button className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50 transition-all">
              Prev
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-sm bg-[#22c55e] text-white rounded-xl font-bold shadow-md shadow-green-500/20">
              1
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
