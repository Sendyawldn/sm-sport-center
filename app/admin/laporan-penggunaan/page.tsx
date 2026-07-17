import { prisma } from "@/lib/prisma";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import Link from "next/link";

export default async function LaporanPenggunaanPage(props: { searchParams: Promise<{ start?: string; end?: string; type?: string; }> }) {
  const searchParams = await props.searchParams;
  const start = searchParams.start || "";
  const end = searchParams.end || "";
  const type = searchParams.type || "ALL";

  // Build prisma where clause
  const where: any = {
    status: { in: ["PAID", "PAID_DP"] }
  };

  if (start && end) {
    where.bookingDate = {
      gte: new Date(`${start}T00:00:00.000Z`),
      lte: new Date(`${end}T23:59:59.999Z`)
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
      court: true,
    },
    orderBy: {
      bookingDate: "asc"
    }
  });

  // Calculate usage stats per court
  const usageStatsMap = bookings.reduce((acc: any, b: any) => {
    if (!acc[b.courtId]) {
      acc[b.courtId] = {
        courtName: b.court.name,
        type: b.court.type,
        totalBookings: 0,
        totalHours: 0,
      };
    }
    const durationHours = (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60 * 60);
    acc[b.courtId].totalBookings += 1;
    acc[b.courtId].totalHours += durationHours;
    return acc;
  }, {});

  const usageStats = Object.values(usageStatsMap).sort((a: any, b: any) => b.totalHours - a.totalHours);

  const totalBookingsAll = bookings.length;
  const totalHoursAll = bookings.reduce((sum: number, b: any) => {
    const durationHours = (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60 * 60);
    return sum + durationHours;
  }, 0);

  const now = new Date();
  
  // Helper for quick filter links
  const todayStart = format(now, "yyyy-MM-dd");
  const todayEnd = format(now, "yyyy-MM-dd");
  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
  const yearStart = format(startOfYear(now), "yyyy-MM-dd");
  const yearEnd = format(endOfYear(now), "yyyy-MM-dd");

  const todayUrl = `?start=${todayStart}&end=${todayEnd}&type=${type}`;
  const weekUrl = `?start=${weekStart}&end=${weekEnd}&type=${type}`;
  const monthUrl = `?start=${monthStart}&end=${monthEnd}&type=${type}`;
  const yearUrl = `?start=${yearStart}&end=${yearEnd}&type=${type}`;

  const isToday = start === todayStart && end === todayEnd;
  const isWeek = start === weekStart && end === weekEnd;
  const isMonth = start === monthStart && end === monthEnd;
  const isYear = start === yearStart && end === yearEnd;

  const baseBtn = "text-sm px-4 py-1.5 rounded-full transition-all shadow-sm font-medium border";
  const inactiveBtn = "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-gray-700";
  const activeBtn = "bg-blue-100 border-blue-400 text-blue-800 font-bold ring-1 ring-blue-400";

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Laporan Penggunaan Lapangan</h1>
        <a 
          href={`/api/laporan-penggunaan/export?start=${start}&end=${end}&type=${type}`}
          target="_blank"
          rel="noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Ekspor Semua CSV
        </a>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm font-semibold text-gray-500 mr-2">Filter Cepat:</span>
        <Link href={todayUrl} className={`${baseBtn} ${isToday ? activeBtn : inactiveBtn}`}>Hari Ini</Link>
        <Link href={weekUrl} className={`${baseBtn} ${isWeek ? activeBtn : inactiveBtn}`}>Minggu Ini</Link>
        <Link href={monthUrl} className={`${baseBtn} ${isMonth ? activeBtn : inactiveBtn}`}>Bulan Ini</Link>
        <Link href={yearUrl} className={`${baseBtn} ${isYear ? activeBtn : inactiveBtn}`}>Tahun Ini</Link>
        <Link href={`?type=${type}`} className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-1.5 rounded-full transition-all ml-auto md:ml-2">Reset Filter</Link>
      </div>

      {/* Filter Form */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <form className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tanggal Mulai</label>
            <input 
              type="date" 
              name="start" 
              defaultValue={start} 
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tanggal Selesai</label>
            <input 
              type="date" 
              name="end" 
              defaultValue={end} 
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Jenis Lapangan</label>
            <select 
              name="type" 
              defaultValue={type} 
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="ALL">Semua Lapangan</option>
              <option value="FUTSAL">Futsal</option>
              <option value="BADMINTON">Badminton</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors w-full md:w-auto flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Data
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Statistik Penggunaan</h2>
            <p className="text-gray-500 text-sm">Menampilkan akumulasi jam terpakai sesuai filter.</p>
          </div>
          <div className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow-inner text-right">
            <div className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-0.5">TOTAL JAM TERPAKAI</div>
            <div className="text-2xl font-black">{totalHoursAll} Jam</div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lapangan</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah Booking</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Jam Terpakai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usageStats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-bold text-xl text-gray-800">Tidak ada data penggunaan ditemukan</span>
                      <p className="mt-1">Coba ubah filter tanggal atau jenis lapangan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                usageStats.map((stat: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{stat.courtName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        {stat.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{stat.totalBookings} kali</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="font-bold text-gray-900 text-lg">{stat.totalHours} Jam</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
