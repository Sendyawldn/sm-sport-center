import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ResumeQrisButton from "./ResumeQrisButton";

export default async function RiwayatPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Ambil semua data booking
  let bookings = await prisma.booking.findMany({
    where: { userId: session.id },
    include: {
      court: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const now = Date.now();
  const EXPIRATION_MS = 15 * 60 * 1000; // 15 menit

  // 1. Lazy Expiration Check
  const updatedBookings = await Promise.all(
    bookings.map(async (booking: any) => {
      if (booking.status === "PENDING") {
        const bookingTime = new Date(booking.createdAt).getTime();
        if (now - bookingTime > EXPIRATION_MS) {
          // Sudah kedaluwarsa, otomatis batalkan
          const updated = await prisma.booking.update({
            where: { id: booking.id },
            data: { status: "CANCELLED" },
            include: { court: true, payment: true },
          });
          return updated;
        }
      }
      return booking;
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Riwayat Pesanan Anda</h1>

        {updatedBookings.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-gray-500">Anda belum memiliki pesanan.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {updatedBookings.map((booking: any) => {
              const bookingTime = new Date(booking.createdAt).getTime();
              const expiresAt = new Date(bookingTime + EXPIRATION_MS);
              const isPendingActive = booking.status === "PENDING" && now <= expiresAt.getTime();

              // Calculate payment amount dynamically based on payment history or assumed defaults
              // We'll safely fallback to total/2 if it was a DP flow (assuming UI only allowed DP for now)
              const paymentMethod = booking.payment?.[0]?.paymentMethod || "QRIS";
              const amountToPay = booking.status === "PAID_DP" ? (booking.totalPrice - booking.paidAmount) : booking.totalPrice / 2; // Simplification, depends on your actual logic

              return (
                <div key={booking.id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{booking.court.name}</h3>
                      {booking.status === "PENDING" && <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Menunggu Pembayaran</span>}
                      {booking.status === "PAID_DP" && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">DP 50%</span>}
                      {booking.status === "PAID" && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">LUNAS</span>}
                      {booking.status === "CANCELLED" && <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-red-100 uppercase">Dibatalkan</span>}
                    </div>
                    
                    <div className="text-gray-500 flex flex-wrap items-center gap-4 text-sm">
                      <p className="flex items-center gap-1.5 whitespace-nowrap">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {format(new Date(booking.bookingDate), "dd MMM yyyy", { locale: id })}
                      </p>
                      <p className="flex items-center gap-1.5 whitespace-nowrap">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {booking.startTime.toISOString().substring(11, 16)} - {booking.endTime.toISOString().substring(11, 16)}
                      </p>
                      <p className="font-bold text-blue-600 text-sm whitespace-nowrap">
                        Rp {booking.totalPrice.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex-shrink-0 flex flex-col md:flex-row items-center gap-3">
                    {isPendingActive && (
                      <>
                        <div className="bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 text-xs text-orange-800 text-center w-full md:w-auto">
                          <span className="font-bold whitespace-nowrap">⏳ Batas: {format(expiresAt, "HH:mm")} WIB</span>
                        </div>
                        <div className="w-full md:w-auto">
                          <ResumeQrisButton 
                            bookingId={booking.id} 
                            amount={booking.totalPrice / 2} 
                            paymentType="DP_50" 
                          />
                        </div>
                      </>
                    )}
                    
                    {booking.status === "PAID_DP" && (
                      <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium border border-blue-100 text-center w-full md:w-auto">
                        Sisa Rp {(booking.totalPrice - booking.paidAmount).toLocaleString("id-ID")} di lokasi
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
