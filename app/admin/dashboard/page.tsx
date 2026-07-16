import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { konfirmasiPelunasanCash } from "@/app/actions/payment";
import DashboardCharts from "./DashboardCharts";

export default async function AdminDashboardPage() {
  // Ambil metrik dasar
  const totalUsers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  
  const totalBookings = await prisma.booking.count({
    where: { status: { in: ["PAID", "PAID_DP", "PENDING"] } }
  });

  const revenueResult = await prisma.booking.aggregate({
    _sum: { paidAmount: true },
    where: { status: { in: ["PAID", "PAID_DP"] } }
  });
  const totalRevenue = revenueResult._sum?.paidAmount || 0;

  const pendingPayments = await prisma.payment.count({
    where: { paymentStatus: "PENDING" }
  });

  // Ambil semua booking valid untuk chart (Proporsi & per Lapangan)
  const validBookings = await prisma.booking.findMany({
    where: { status: { in: ["PAID", "PAID_DP", "PENDING"] } },
    include: { court: true }
  });

  const courtTypeMap = { Futsal: 0, Badminton: 0 };
  const courtBookingMap: Record<string, number> = {};
  
  validBookings.forEach(b => {
    if (b.court.type === "FUTSAL") courtTypeMap.Futsal += 1;
    else if (b.court.type === "BADMINTON") courtTypeMap.Badminton += 1;

    courtBookingMap[b.court.name] = (courtBookingMap[b.court.name] || 0) + 1;
  });

  const courtTypeData = [
    { name: "Futsal", value: courtTypeMap.Futsal },
    { name: "Badminton", value: courtTypeMap.Badminton }
  ];

  const courtBookingData = Object.entries(courtBookingMap)
    .map(([name, bookings]) => ({ name, bookings }))
    .sort((a, b) => b.bookings - a.bookings);

  // Data Trend (7 Hari Terakhir)
  const trendDataMap: Record<string, number> = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = format(d, "dd MMM", { locale: id });
    trendDataMap[dateStr] = 0;
  }

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentTrendBookings = await prisma.booking.findMany({
    where: {
      bookingDate: { gte: sevenDaysAgo },
      status: { in: ["PAID", "PAID_DP", "PENDING"] }
    }
  });

  recentTrendBookings.forEach(b => {
    const dateStr = format(b.bookingDate, "dd MMM", { locale: id });
    if (trendDataMap[dateStr] !== undefined) {
      trendDataMap[dateStr] += 1;
    }
  });

  const trendData = Object.entries(trendDataMap).map(([date, bookings]) => ({ date, bookings }));

  // Ambil 5 booking terbaru
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      court: true
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Statistik</h1>

      {/* Grid Metrik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-gray-500 text-sm font-medium mb-2">Total Pendapatan</span>
          <span className="text-3xl font-bold text-blue-600">Rp {totalRevenue.toLocaleString("id-ID")}</span>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-gray-500 text-sm font-medium mb-2">Total Reservasi</span>
          <span className="text-3xl font-bold text-gray-900">{totalBookings}</span>
          <span className="text-xs text-gray-400 mt-1">Total reservasi masuk</span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-gray-500 text-sm font-medium mb-2">Pelanggan Terdaftar</span>
          <span className="text-3xl font-bold text-gray-900">{totalUsers}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-gray-500 text-sm font-medium mb-2">Menunggu Verifikasi</span>
          <span className="text-3xl font-bold text-orange-600">{pendingPayments}</span>
          <span className="text-xs text-gray-400 mt-1">Pembayaran perlu dicek</span>
        </div>
      </div>

      {/* Render Charts */}
      <DashboardCharts 
        courtTypeData={courtTypeData}
        courtBookingData={courtBookingData}
        trendData={trendData}
      />

      {/* Tabel Booking Terbaru */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">5 Reservasi Terbaru</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada data reservasi.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Pelanggan</th>
                <th className="p-4 font-semibold text-gray-600">Lapangan</th>
                <th className="p-4 font-semibold text-gray-600">Jadwal</th>
                <th className="p-4 font-semibold text-gray-600">Status & Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{b.user.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-700">{b.court.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-700 text-sm">
                      {format(new Date(b.bookingDate), "dd MMM yyyy", { locale: id })} <br/>
                      <span className="text-gray-500">
                        {b.startTime.toISOString().substring(11, 16)} - {b.endTime.toISOString().substring(11, 16)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-start">
                      {b.status === "PAID" && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">LUNAS 100%</span>}
                      {b.status === "PAID_DP" && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">DP 50%</span>}
                      {b.status === "PENDING" && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold">PENDING</span>}
                      {b.status === "CANCELLED" && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">CANCELLED</span>}
                      
                      {b.status === "PAID_DP" && (
                        <form action={async () => { "use server"; await konfirmasiPelunasanCash(b.id); }}>
                          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                            💵 Terima Pelunasan (Rp {(b.totalPrice - b.paidAmount).toLocaleString("id-ID")})
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
