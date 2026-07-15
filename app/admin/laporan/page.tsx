import { prisma } from "@/lib/prisma";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LaporanPage(props: { searchParams: Promise<{ start?: string; end?: string; type?: string }> }) {
  const searchParams = await props.searchParams;
  const start = searchParams.start || "";
  const end = searchParams.end || "";
  const type = searchParams.type || "ALL";

  // Build prisma where clause
  const where: any = {
    status: "PAID"
  };

  if (start && end) {
    where.bookingDate = {
      gte: new Date(`${start}T00:00:00.000Z`),
      lte: new Date(`${end}T00:00:00.000Z`)
    };
  }

  if (type !== "ALL") {
    where.court = {
      type: type
    };
  }

  // Fetch data
  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: true,
      court: true,
    },
    orderBy: {
      bookingDate: "asc"
    }
  });

  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Laporan Pendapatan</h1>
        <a 
          href={`/api/laporan/export?start=${start}&end=${end}&type=${type}`}
          target="_blank"
          rel="noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Ekspor CSV
        </a>
      </div>

      {/* Filter Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <form className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <input 
              type="date" 
              name="start" 
              defaultValue={start}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
            <input 
              type="date" 
              name="end" 
              defaultValue={end}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Lapangan</label>
            <select 
              name="type" 
              defaultValue={type}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="ALL">Semua Lapangan</option>
              <option value="FUTSAL">Futsal</option>
              <option value="BADMINTON">Badminton</option>
            </select>
          </div>
          <div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
              Filter Data
            </button>
          </div>
        </form>
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">Pratinjau Data ({bookings.length} Pesanan)</h2>
          <div className="font-bold text-gray-800 text-lg">
            Total: <span className="text-blue-600">Rp {totalRevenue.toLocaleString("id-ID")}</span>
          </div>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Tidak ada data untuk filter yang dipilih.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">ID Booking</th>
                <th className="p-4 font-semibold text-gray-600">Tanggal Main</th>
                <th className="p-4 font-semibold text-gray-600">Lapangan</th>
                <th className="p-4 font-semibold text-gray-600">Pelanggan</th>
                <th className="p-4 font-semibold text-gray-600">Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-sm font-mono text-gray-500">{b.id.split('-')[0]}</td>
                  <td className="p-4 text-sm text-gray-700">
                    {format(new Date(b.bookingDate), "dd MMM yyyy", { locale: id })}
                    <div className="text-xs text-gray-400 mt-1">
                      {b.startTime.toISOString().substring(11, 16)} - {b.endTime.toISOString().substring(11, 16)}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{b.court.name}</td>
                  <td className="p-4 text-sm text-gray-700">
                    {b.user.name}
                    <div className="text-xs text-gray-400 mt-1">{b.user.email}</div>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-900">Rp {b.totalPrice.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
