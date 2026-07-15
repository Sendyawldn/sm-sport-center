import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function RiwayatPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.id },
    include: {
      court: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Riwayat Pesanan Anda</h1>

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-gray-500">Anda belum memiliki pesanan.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{booking.court.name}</h3>
                    {booking.status === "PENDING" && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-bold">Menunggu Pembayaran</span>}
                    {booking.status === "PAID_DP" && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">DP 50%</span>}
                    {booking.status === "PAID" && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">LUNAS</span>}
                    {booking.status === "CANCELLED" && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">DIBATALKAN</span>}
                  </div>
                  
                  <div className="text-gray-600 space-y-1">
                    <p>Tanggal: {format(new Date(booking.bookingDate), "dd MMMM yyyy", { locale: id })}</p>
                    <p>Waktu: {booking.startTime.toISOString().substring(11, 16)} - {booking.endTime.toISOString().substring(11, 16)}</p>
                    <p className="font-bold text-blue-600 mt-2">Total: Rp {booking.totalPrice.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-end min-w-[250px]">
                  {booking.status === "PENDING" && (
                    <div className="bg-orange-50 text-orange-700 p-3 rounded-lg text-sm text-center border border-orange-100 mb-2">
                      Selesaikan pembayaran di halaman booking.
                    </div>
                  )}
                  {booking.status === "PAID_DP" && (
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm text-center border border-blue-100 mb-2">
                      Sisa pembayaran Rp {(booking.totalPrice - booking.paidAmount).toLocaleString("id-ID")} dilunasi di lokasi.
                    </div>
                  )}
                  {(booking.status === "PAID" || booking.status === "PAID_DP") && (
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full">
                      Unduh Tiket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
