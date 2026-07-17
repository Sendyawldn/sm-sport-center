"use client";

import { useState } from "react";
import { updateCourt, createCourt, deleteCourt } from "@/app/actions/court";

type Court = {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
  status: string;
};

export default function CourtClientUI({
  initialCourts,
}: {
  initialCourts: Court[];
}) {
  const [courts, setCourts] = useState<Court[]>(initialCourts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<string>("AVAILABLE");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addType, setAddType] = useState("FUTSAL");
  const [addPrice, setAddPrice] = useState<number | string>("");

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
        prev.map((c) =>
          c.id === id
            ? { ...c, pricePerHour: editPrice, status: editStatus }
            : c,
        ),
      );
      setEditingId(null);
      showToast("success", "Data lapangan berhasil diperbarui!");
    } else {
      showToast("error", res.error || "Terjadi kesalahan saat menyimpan");
    }

    setLoadingId(null);
  };

  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId("new");
    const res = await createCourt(addName, addType, Number(addPrice) || 0, "AVAILABLE");
    if (res.success && res.court) {
      setCourts((prev) => [
        ...prev,
        {
          id: res.court.id,
          name: res.court.name,
          type: res.court.type,
          pricePerHour: res.court.pricePerHour,
          status: res.court.status,
        },
      ]);
      setIsAddModalOpen(false);
      setAddName("");
      setAddType("FUTSAL");
      setAddPrice("");
      showToast("success", "Lapangan baru berhasil ditambahkan!");
    } else {
      showToast("error", res.error || "Gagal menambahkan lapangan");
    }
    setLoadingId(null);
  };

  const handleDeleteCourt = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus lapangan "${name}"?`))
      return;

    setLoadingId(id);
    const res = await deleteCourt(id);
    if (res.success) {
      setCourts((prev) => prev.filter((c) => c.id !== id));
      showToast("success", "Lapangan berhasil dihapus!");
    } else {
      showToast("error", res.error || "Gagal menghapus lapangan");
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
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {toastMessage.text}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#a6192e] hover:bg-red-800 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Lapangan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">
                  Nama Lapangan
                </th>
                <th className="p-4 font-semibold text-gray-600">Tipe</th>
                <th className="p-4 font-semibold text-gray-600">Harga / Jam</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courts.map((court) => {
                const isEditing = editingId === court.id;
                const isLoading = loadingId === court.id;

                return (
                  <tr
                    key={court.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-gray-900">
                        {court.name}
                      </div>
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
                            onChange={(e) =>
                              setEditPrice(parseInt(e.target.value) || 0)
                            }
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => saveCourt(court.id)}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-700 font-bold px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={isLoading}
                            className="text-gray-500 hover:text-gray-700 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEditing(court)}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCourt(court.id, court.name)
                            }
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            {isLoading ? "..." : "Hapus"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Lapangan */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Tambah Lapangan Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddCourt} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Nama Lapangan
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Misal: Lapangan Futsal 3"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Tipe Olahraga
                </label>
                <select
                  value={addType}
                  onChange={(e) => setAddType(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 font-medium"
                >
                  <option value="FUTSAL">Futsal</option>
                  <option value="BADMINTON">Badminton</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Harga per Jam (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingId === "new"}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {loadingId === "new" ? "Menyimpan..." : "Simpan Lapangan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
