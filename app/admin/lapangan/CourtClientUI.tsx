"use client";

import { useState } from "react";
import { updateCourt } from "@/app/actions/court";

type Court = {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
  status: string;
};

export default function CourtClientUI({ initialCourts }: { initialCourts: Court[] }) {
  const [courts, setCourts] = useState<Court[]>(initialCourts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<string>("AVAILABLE");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const startEditing = (court: Court) => {
    setEditingId(court.id);
    setEditPrice(court.pricePerHour);
    setEditStatus(court.status);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveCourt = async (id: string) => {
    setLoadingId(id);
    const res = await updateCourt(id, editPrice, editStatus);
    
    if (res.success && res.court) {
      setCourts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, pricePerHour: editPrice, status: editStatus } : c))
      );
      setEditingId(null);
      showToast("success", "Data lapangan berhasil diperbarui!");
    } else {
      showToast("error", res.error || "Terjadi kesalahan saat menyimpan");
    }
    
    setLoadingId(null);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg border text-white font-medium flex items-center gap-2 animate-fade-in ${
            toastMessage.type === "success"
              ? "bg-green-600 border-green-700"
              : "bg-red-600 border-red-700"
          }`}
        >
          {toastMessage.type === "success" ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toastMessage.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Nama Lapangan</th>
                <th className="p-4 font-semibold text-gray-600">Tipe</th>
                <th className="p-4 font-semibold text-gray-600">Harga / Jam</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courts.map((court) => {
                const isEditing = editingId === court.id;
                const isLoading = loadingId === court.id;

                return (
                  <tr key={court.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{court.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                        {court.type}
                      </div>
                    </td>
                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 font-medium">Rp</span>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={editPrice}
                            onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-bold bg-white"
                            disabled={isLoading}
                          />
                        </div>
                      ) : (
                        <div className="font-medium text-gray-900">
                          Rp {court.pricePerHour.toLocaleString("id-ID")}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-bold text-gray-900"
                          disabled={isLoading}
                        >
                          <option value="AVAILABLE">Tersedia</option>
                          <option value="MAINTENANCE">Perbaikan</option>
                        </select>
                      ) : (
                        <div>
                          {court.status === "AVAILABLE" ? (
                            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center w-max gap-1">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                              Tersedia
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center w-max gap-1">
                              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                              Perbaikan
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={isLoading}
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => saveCourt(court.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                              </>
                            ) : (
                              "Simpan"
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(court)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
