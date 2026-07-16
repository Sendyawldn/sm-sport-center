import { prisma } from "@/lib/prisma";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

export default async function LaporanPage(props: { searchParams: Promise<{ start?: string; end?: string; type?: string; limit?: string }> }) {
  const searchParams = await props.searchParams;
  const start = searchParams.start || "";
  const end = searchParams.end || "";
  const type = searchParams.type || "ALL";
  const limitStr = searchParams.limit || "10";

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
      user: true,
      court: true,
    },
    orderBy: {
      bookingDate: "desc"
    }
  });

  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + b.paidAmount, 0);
  
  const limit = limitStr === "ALL" ? bookings.length : parseInt(limitStr, 10);
  const displayBookings = bookings.slice(0, limit);

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

  const todayUrl = `?start=${todayStart}&end=${todayEnd}&type=${type}&limit=${limitStr}`;
  const weekUrl = `?start=${weekStart}&end=${weekEnd}&type=${type}&limit=${limitStr}`;
  const monthUrl = `?start=${monthStart}&end=${monthEnd}&type=${type}&limit=${limitStr}`;
  const yearUrl = `?start=${yearStart}&end=${yearEnd}&type=${type}&limit=${limitStr}`;

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
        <h1 className="text-3xl font-bold text-gray-900">Laporan Pendapatan</h1>
        <a 
          href={`/api/laporan/export?start=${start}&end=${end}&type=${type}`}
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
        <Link href={`?type=${type}&limit=${limitStr}`} className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-1.5 rounded-full transition-all ml-auto md:ml-2">Reset Filter</Link>
      </div>

      {/* Filter Form */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <form className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Tanggal Mulai</label>
            <input 
              type="date" 
              name="start" 
              defaultValue={start}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 font-medium"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Tanggal Selesai</label>
            <input 
              type="date" 
              name="end" 
              defaultValue={end}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 font-medium"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Jenis Lapangan</label>
            <select 
              name="type" 
              defaultValue={type}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700 font-medium cursor-pointer"
            >
              <option value="ALL">Semua Lapangan</option>
              <option value="FUTSAL">Futsal</option>
              <option value="BADMINTON">Badminton</option>
            </select>
          </div>
          <div className="w-full lg:w-40">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Tampilkan</label>
            <select 
              name="limit" 
              defaultValue={limitStr}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700 font-medium cursor-pointer"
            >
              <option value="10">10 Baris</option>
              <option value="20">20 Baris</option>
              <option value="50">50 Baris</option>
              <option value="100">100 Baris</option>
              <option value="ALL">Semua Data</option>
            </select>
          </div>
          <div className="w-full lg:w-auto mt-2 lg:mt-0">
            <button type="submit" className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Data
            </button>
          </div>
        </form>
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center bg-gray-50/50 gap-4">
          <div>
            <h2 className="font-extrabold text-gray-900 text-lg">Pratinjau Data Laporan</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Menampilkan <span className="text-gray-900 font-bold">{displayBookings.length}</span> dari total <span className="text-gray-900 font-bold">{bookings.length}</span> pesanan yang sesuai filter.
            </p>
          </div>
          <div className="bg-blue-600 px-6 py-3 rounded-xl text-white shadow-lg shadow-blue-200">
            <div className="text-xs text-blue-100 font-bold uppercase tracking-wider mb-0.5">Total Pendapatan Filter</div>
            <div className="font-black text-2xl tracking-tight">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
        
        {displayBookings.length === 0 ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-800">Tidak ada transaksi ditemukan</span>
            <span className="text-sm mt-2 text-gray-500">Silakan ubah rentang tanggal atau jenis lapangan.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">ID & Waktu</th>
                  <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">Lapangan</th>
                  <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider">Pelanggan</th>
                  <th className="p-5 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Tagihan & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-5 text-sm">
                      <div className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-2 font-semibold">
                        #{b.id.split('-')[0]}
                      </div>
                      <div className="font-bold text-gray-900">
                        {format(new Date(b.bookingDate), "dd MMM yyyy", { locale: id })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {b.startTime.toISOString().substring(11, 16)} - {b.endTime.toISOString().substring(11, 16)}
                      </div>
                    </td>
                    <td className="p-5 text-sm">
                      <span className="font-bold text-gray-900">{b.court.name}</span>
                      <div className="text-xs text-blue-600 font-bold mt-1 uppercase tracking-wide">{b.court.type}</div>
                    </td>
                    <td className="p-5 text-sm">
                      <div className="font-bold text-gray-900">{b.user.name}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {b.user.email}
                      </div>
                    </td>
                    <td className="p-5 text-sm text-right">
                      <div className="font-black text-green-600 text-base mb-1">
                        Rp {b.paidAmount.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs text-gray-500 mb-2 font-medium">
                        Total Tarif: <span className="text-gray-900 font-bold">Rp {b.totalPrice.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="inline-flex">
                        {b.status === "PAID" ? (
                          <span className="bg-green-100 text-green-700 text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider flex items-center gap-1 border border-green-200">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            LUNAS
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider flex items-center gap-1 border border-yellow-200">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            DP 50%
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
