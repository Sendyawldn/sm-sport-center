"use client";

import { useState } from "react";
import { uploadPaymentProof } from "@/app/actions/payment";

export default function PaymentForm({ bookingId }: { bookingId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Silakan pilih file bukti transfer.");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("bookingId", bookingId);
    formData.append("file", file);

    const res = await uploadPaymentProof(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="text-sm text-gray-600 mb-1">
        Transfer ke <strong>BCA 1234567890</strong> a.n SM Sport Center
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-200 rounded-lg"
      />
      
      {error && <p className="text-red-500 text-xs">{error}</p>}
      
      <button
        type="submit"
        disabled={loading || !file}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? "Mengunggah..." : "Upload Bukti"}
      </button>
    </form>
  );
}
