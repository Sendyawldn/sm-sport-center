"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ResumeQrisButtonProps {
  bookingId: string;
  amount: number;
  paymentType: "DP_50" | "LUNAS_100";
}

export default function ResumeQrisButton({ bookingId, amount, paymentType }: ResumeQrisButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrisUrl, setQrisUrl] = useState<string>("");
  const router = useRouter();

  // Polling logic when modal is open
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOpen) {
      // Generate QR URL targeting the mobile payment page
      const paymentUrl = `${window.location.protocol}//${window.location.host}/pay/${bookingId}`;
      setQrisUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentUrl)}`);

      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/bookings/${bookingId}/status`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === "PAID" || data.status === "PAID_DP") {
              setIsOpen(false);
              router.refresh(); // Refresh page to show updated status
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, bookingId, router]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Lanjutkan Bayar QRIS
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Scan QRIS</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Selesaikan pembayaran Anda menggunakan aplikasi E-Wallet atau M-Banking favorit Anda.
              </p>

              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6 flex justify-center">
                {qrisUrl ? (
                  <img src={qrisUrl} alt="QRIS Code" className="w-48 h-48 rounded-lg shadow-sm" />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 font-medium">Memuat QR...</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Pembayaran</div>
                <div className="text-3xl font-black text-gray-900">
                  Rp {amount.toLocaleString("id-ID")}
                </div>
                {paymentType === "DP_50" && (
                  <div className="text-xs font-medium text-blue-600 mt-1 bg-blue-100 inline-block px-2 py-0.5 rounded uppercase tracking-wider">
                    Termasuk Pembayaran DP 50%
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 text-blue-600 font-medium bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Menunggu Pembayaran...
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
