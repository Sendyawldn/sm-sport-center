"use client";

import { useState } from "react";
import { verifyPayment, rejectPayment } from "@/app/actions/payment";

export default function AdminActionButtons({ paymentId }: { paymentId: string }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!confirm("Setujui pembayaran ini? Booking akan menjadi PAID.")) return;
    setLoading(true);
    const res = await verifyPayment(paymentId);
    setLoading(false);
    if (res.error) alert(res.error);
  };

  const handleReject = async () => {
    if (!confirm("Tolak pembayaran ini? Booking akan dibatalkan (CANCELLED).")) return;
    setLoading(true);
    const res = await rejectPayment(paymentId);
    setLoading(false);
    if (res.error) alert(res.error);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleVerify} 
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
      >
        Setujui
      </button>
      <button 
        onClick={handleReject}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
      >
        Tolak
      </button>
    </div>
  );
}
