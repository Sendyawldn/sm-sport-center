import { prisma } from "@/lib/prisma";
import AdminActionButtons from "./AdminActionButtons";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function VerifikasiPembayaranPage() {
  const pendingPayments = await prisma.payment.findMany({
    where: { paymentStatus: "PENDING" },
    include: {
      booking: {
        include: {
          court: true,
          user: true,
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Verifikasi Pembayaran</h1>

      {pendingPayments.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <p className="text-gray-500">Tidak ada pembayaran yang menunggu verifikasi saat ini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Pelanggan</th>
                <th className="p-4 font-semibold text-gray-600">Jadwal</th>
                <th className="p-4 font-semibold text-gray-600">Total</th>
                <th className="p-4 font-semibold text-gray-600">Bukti Transfer</th>
                <th className="p-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((payment: any) => (
                <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{payment.booking.user.name}</div>
                    <div className="text-sm text-gray-500">{payment.booking.user.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{payment.booking.court.name}</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(payment.booking.bookingDate), "dd MMM yyyy", { locale: id })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.booking.startTime.toISOString().substring(11, 16)} - {payment.booking.endTime.toISOString().substring(11, 16)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-blue-600">
                      Rp {payment.amount.toLocaleString("id-ID")}
                    </div>
                  </td>
                  <td className="p-4">
                    <a 
                      href={payment.proofUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat Bukti
                    </a>
                  </td>
                  <td className="p-4">
                    <AdminActionButtons paymentId={payment.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
