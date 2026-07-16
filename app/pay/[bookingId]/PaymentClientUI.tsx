"use client";

import { useState } from "react";
import { simulateQrisPayment } from "@/app/actions/payment";
import { useRouter } from "next/navigation";

export default function PaymentClientUI({
  bookingId,
  isAlreadyPaid,
  paymentType,
}: {
  bookingId: string;
  isAlreadyPaid: boolean;
  paymentType: "DP_50" | "FULL_100";
}) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(isAlreadyPaid);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handlePay = async () => {
    if (paid) return;
    setLoading(true);
    setErrorMsg("");

    const res = await simulateQrisPayment(bookingId, paymentType);
    
    if (res.error) {
      setErrorMsg(res.error);
      setLoading(false);
    } else {
      setPaid(true);
      setLoading(false);
      // Optional: Refresh page to update server component status
      router.refresh();
    }
  };

  if (paid) {
    return (
      <button 
        disabled 
        className="w-full py-4 bg-green-500 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
        Pembayaran Berhasil
      </button>
    );
  }

  return (
    <>
      {errorMsg && (
        <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-center">
          {errorMsg}
        </div>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-lg"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </>
        ) : (
          "Bayar Sekarang"
        )}
      </button>
    </>
  );
}
