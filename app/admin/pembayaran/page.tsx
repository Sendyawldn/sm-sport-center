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
      booking: {
        createdAt: "asc"
      }
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
                <th className="p-4 text-left font-semibold text-gray-900">Total Tagihan</th>
                <th className="p-4 text-center font-semibold text-gray-900">Aksi</th>
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
