"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createOfflineBooking } from "@/app/actions/adminBooking";

interface Court {
  id: string;
  name: string;
  type: string;
  status: string;
  pricePerHour: number;
}

interface Booking {
  id: string;
  courtId: string;
  startTime: string;
  endTime: string;
  status: string;
  bookingSource: string;
  guestName: string;
  paymentType: string;
}

interface CashierCalendarProps {
  courts: Court[];
  bookings: Booking[];
  initialDate: string;
}

const HOURS = Array.from({ length: 16 }, (_, i) => {
  const h = i + 8; // 08:00 to 23:00
  return `${h.toString().padStart(2, "0")}:00`;
});

export default function CashierCalendar({ courts, bookings, initialDate }: CashierCalendarProps) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);
  const [selectedSlot, setSelectedSlot] = useState<{ court: Court; time: string } | null>(null);

  // Form State
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [duration, setDuration] = useState(1);
  const [paymentType, setPaymentType] = useState<"DP_50" | "FULL_100">("FULL_100");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER_MANUAL">("CASH");
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    router.push(`/admin/reservasi?date=${newDate}`);
  };

  const getSlotData = (courtId: string, time: string) => {
    // Check if court is maintenance
    const court = courts.find(c => c.id === courtId);
    if (court?.status === "MAINTENANCE") return { status: "MAINTENANCE" };

    // Find overlapping booking
    const booking = bookings.find(b => {
      return b.courtId === courtId && b.startTime <= time && b.endTime > time;
    });

    if (booking) return { status: "BOOKED", booking };
    return { status: "AVAILABLE" };
  };

  const handleCellClick = (court: Court, time: string, status: string) => {
    if (status !== "AVAILABLE") return; // cannot click booked/maintenance
    setSelectedSlot({ court, time });
    
    // Reset form
    setGuestName("");
    setGuestPhone("");
    setDuration(1);
    setPaymentType("FULL_100");
    setPaymentMethod("CASH");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setLoading(true);
    const res = await createOfflineBooking({
      courtId: selectedSlot.court.id,
      bookingDate: date,
      startTimeStr: selectedSlot.time,
      duration,
      guestName,
      guestPhone,
      paymentType,
      paymentMethod,
    });
    setLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      alert("Reservasi Offline berhasil disimpan!");
      setSelectedSlot(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Date Picker Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Jadwal Harian</h2>
          <p className="text-gray-500 text-sm">Pilih slot kosong untuk membuat reservasi kasir</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Calendar Matrix */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-4 bg-gray-50 border-b border-r border-gray-200 sticky left-0 z-10 w-24 text-center text-sm font-semibold text-gray-600">
                Jam
              </th>
              {courts.map((court) => (
                <th key={court.id} className="p-4 bg-gray-50 border-b border-gray-200 text-center text-sm font-semibold text-gray-600 min-w-[150px]">
                  {court.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour}>
                <td className="p-3 bg-gray-50 border-b border-r border-gray-200 sticky left-0 z-10 text-center text-sm font-medium text-gray-700">
                  {hour}
                </td>
                {courts.map((court) => {
                  const slotData = getSlotData(court.id, hour);
                  
                  let cellClasses = "p-2 border-b border-gray-100 relative h-16 ";
                  let content = null;

                  if (slotData.status === "MAINTENANCE") {
                    cellClasses += "bg-orange-50";
                    content = <div className="text-xs text-orange-600 font-medium text-center">Maintenance</div>;
                  } else if (slotData.status === "BOOKED" && slotData.booking) {
                    const b = slotData.booking;
                    const isDP = b.paymentType === "DP_50";
                    cellClasses += "bg-red-50 border-l-4 border-l-red-500";
                    content = (
                      <div className="flex flex-col text-xs p-1">
                        <span className="font-bold text-red-900 truncate">{b.guestName}</span>
                        <span className={`font-semibold mt-1 ${isDP ? 'text-blue-600' : 'text-green-600'}`}>
                          {isDP ? 'DP 50%' : 'LUNAS'}
                        </span>
                        {b.bookingSource === "OFFLINE_CASHIER" && (
                          <span className="text-[10px] text-gray-500 mt-0.5">Walk-in</span>
                        )}
                      </div>
                    );
                  } else {
                    cellClasses += "bg-green-50 hover:bg-green-100 cursor-pointer transition-colors";
                    content = <div className="text-xs text-green-700 font-medium text-center opacity-0 hover:opacity-100">KOSONG +</div>;
                  }

                  return (
                    <td 
                      key={`${court.id}-${hour}`} 
                      className={cellClasses}
                      onClick={() => handleCellClick(court, hour, slotData.status)}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form Reservasi */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Reservasi Kasir</h3>
              <button 
                onClick={() => setSelectedSlot(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Tanggal:</span>
                  <span className="font-bold text-gray-900">{date}</span>
                  <span className="text-gray-500">Lapangan:</span>
                  <span className="font-bold text-gray-900">{selectedSlot.court.name}</span>
                  <span className="text-gray-500">Jam Mulai:</span>
                  <span className="font-bold text-gray-900">{selectedSlot.time}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Jam)</label>
                  <select 
                    value={duration} 
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    {[1, 2, 3, 4, 5].map(h => (
                      <option key={h} value={h}>{h} Jam</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan / Instansi *</label>
                  <input 
                    type="text" 
                    required
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Budi atau PT. Sukses"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp (Opsional)</label>
                  <input 
                    type="tel" 
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="08123456789"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilihan Pembayaran</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentType === 'FULL_100' ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'}`}>
                      <input 
                        type="radio" 
                        name="paymentType" 
                        value="FULL_100"
                        checked={paymentType === "FULL_100"}
                        onChange={() => setPaymentType("FULL_100")}
                        className="sr-only" 
                      />
                      <span className={`font-bold ${paymentType === 'FULL_100' ? 'text-green-700' : 'text-gray-600'}`}>Lunas 100%</span>
                    </label>
                    <label className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentType === 'DP_50' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}>
                      <input 
                        type="radio" 
                        name="paymentType" 
                        value="DP_50"
                        checked={paymentType === "DP_50"}
                        onChange={() => setPaymentType("DP_50")}
                        className="sr-only" 
                      />
                      <span className={`font-bold ${paymentType === 'DP_50' ? 'text-blue-700' : 'text-gray-600'}`}>DP 50%</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Metode Pembayaran</label>
                  <select 
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="CASH">Uang Tunai (Cash)</option>
                    <option value="TRANSFER_MANUAL">Transfer Bank / EDC / QRIS</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium">Total Harga:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    Rp {(selectedSlot.court.pricePerHour * duration).toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "💾 Simpan & Kunci Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
