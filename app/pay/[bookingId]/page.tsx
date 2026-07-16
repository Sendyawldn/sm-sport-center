import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PaymentClientUI from "./PaymentClientUI";

export default async function MobilePaymentPage({
  params,
}: {
  params: Promise<{ bookingId: string }> | { bookingId: string };
}) {
  const resolvedParams = await params;
  const bookingId = resolvedParams.bookingId;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { court: true },
  });

  if (!booking) {
    notFound();
  }

  // Calculate times
  const startTime = booking.startTime.toISOString().substring(11, 16);
  const endTime = booking.endTime.toISOString().substring(11, 16);

  // Format date
  const dateStr = format(booking.bookingDate, "dd MMMM yyyy", { locale: id });

  // Status check
  const isPaid = booking.status === "PAID" || booking.status === "PAID_DP";

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center font-sans">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#a6192e] p-6 text-center">
          <h1 className="text-white font-bold text-xl uppercase tracking-wider">SM Sport Center</h1>
          <p className="text-red-100 text-sm mt-1">Pembayaran QRIS Virtual</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Label */}
          <div className="flex justify-center mb-2">
            {isPaid ? (
              <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Sudah Dibayar
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Menunggu Pembayaran
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <span className="text-gray-500 text-sm font-medium">Lapangan</span>
              <span className="font-bold text-gray-900">{booking.court.name}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <span className="text-gray-500 text-sm font-medium">Tanggal</span>
              <span className="font-bold text-gray-900">{dateStr}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <span className="text-gray-500 text-sm font-medium">Waktu</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-sm shadow-sm">
                {startTime} - {endTime}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500 text-sm font-medium">Total Tagihan</span>
              <span className="text-xl font-black text-gray-900">
                Rp {booking.paidAmount.toLocaleString("id-ID")}
              </span>
            </div>
            
            {booking.paymentType === "DP_50" && (
              <div className="text-right text-[11px] text-blue-600 font-medium -mt-2">
                *Pembayaran DP 50%
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <PaymentClientUI 
            bookingId={bookingId} 
            isAlreadyPaid={isPaid} 
            paymentType={booking.paymentType} 
          />
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-400 text-xs">
        <p>Aman & Terenkripsi • SM Sport Center</p>
      </div>
    </div>
  );
}
