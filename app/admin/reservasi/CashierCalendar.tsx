"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOfflineBooking, processPelunasan } from "@/app/actions/adminBooking";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

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

const TIMEZONE = "Asia/Jakarta";

const getCourtImage = (type: string) => {
  if (type.toUpperCase() === "FUTSAL") {
    return "https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  }
  return "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
};

const HOURS = Array.from({ length: 16 }, (_, i) => {
  const h = i + 8; // 08:00 to 23:00
  return `${h.toString().padStart(2, "0")}:00`;
});

export default function CashierCalendar({ courts, bookings, initialDate }: CashierCalendarProps) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);
  const [sportFilter, setSportFilter] = useState("");
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const [selectedSlot, setSelectedSlot] = useState<{ court: Court; time: string } | null>(null);
  const [pelunasanSlot, setPelunasanSlot] = useState<{ booking: Booking; court: Court } | null>(null);

  // Form State
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const duration = 1; // Fixed 1 hour to match customer
  const [paymentType, setPaymentType] = useState<"DP_50" | "FULL_100">("FULL_100");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER_MANUAL">("CASH");
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    router.push(`/admin/reservasi?date=${newDate}`);
  };

  const isSlotPast = (timeStr: string) => {
    const todayStr = formatInTimeZone(currentTime, TIMEZONE, "yyyy-MM-dd");
    if (date > todayStr) return false;
    if (date < todayStr) return true;

    const currentHourStr = formatInTimeZone(currentTime, TIMEZONE, "HH:mm");
    return timeStr <= currentHourStr;
  };

  const getSlotStatus = (courtId: string, timeStr: string) => {
    const booking = bookings.find(b => b.courtId === courtId && b.startTime <= timeStr && b.endTime > timeStr);
    if (booking) return "BOOKED";

    const court = courts.find(c => c.id === courtId);
    if (court?.status === "MAINTENANCE") return "MAINTENANCE";

    if (isSlotPast(timeStr)) return "PAST";

    return "AVAILABLE";
  };

  const getBookingData = (courtId: string, timeStr: string) => {
    return bookings.find(b => b.courtId === courtId && b.startTime <= timeStr && b.endTime > timeStr);
  };

  const handleCellClick = (court: Court, time: string, status: string) => {
    if (status === "AVAILABLE") {
      setSelectedSlot({ court, time });
      
      // Reset form
      setGuestName("");
      setGuestPhone("");
      setPaymentType("FULL_100");
      setPaymentMethod("CASH");
    } else if (status === "BOOKED") {
      const bData = getBookingData(court.id, time);
      if (bData && bData.paymentType === "DP_50" && bData.status === "PAID_DP") {
        setPelunasanSlot({ booking: bData, court });
      }
    }
  };

  const handlePelunasan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pelunasanSlot) return;

    setLoading(true);
    const res = await processPelunasan(pelunasanSlot.booking.id);
    setLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      alert("Pelunasan berhasil diproses!");
      setPelunasanSlot(null);
      router.refresh();
    }
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
      router.refresh();
    }
  };

  const displayCourts = courts.filter((court) => {
    if (!sportFilter) return true;
    return court.type.toLowerCase() === sportFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto">
      {/* Filter Top Bar (similar to customer view but admin styled) */}
      <div className="bg-[#a6192e] rounded-2xl shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-white/10 rounded-full text-white shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex flex-col flex-1 text-white">
            <span className="text-xs font-semibold text-white/80 uppercase">Cabang Olahraga</span>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="bg-transparent font-bold text-base outline-none cursor-pointer appearance-none text-white [&>option]:text-gray-900"
            >
              <option value="">Semua Olahraga ▾</option>
              <option value="futsal">Futsal ▾</option>
              <option value="badminton">Badminton ▾</option>
            </select>
          </div>
        </div>

        <div className="w-px h-10 bg-white/20 hidden md:block"></div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-white/10 rounded-full text-white shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex flex-col flex-1 text-white pr-4">
            <span className="text-xs font-semibold text-white/80 uppercase">Pilih Tanggal</span>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="bg-transparent font-bold text-base outline-none cursor-pointer text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
      </div>

      {/* Grid of Courts (Card Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayCourts.map((court) => {
          const isMaintenance = court.status === "MAINTENANCE";
          return (
            <div key={court.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
              {/* Image Section */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={getCourtImage(court.type)} 
                  alt={court.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    {court.type}
                  </span>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{court.name}</h3>
                  <div className="text-gray-300 text-sm font-medium">
                    Rp {court.pricePerHour.toLocaleString("id-ID")} <span className="font-normal text-gray-400">/ jam</span>
                  </div>
                </div>
              </div>
              
              {/* Slots Section */}
              <div className="p-5 flex-1">
                <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pilih Jam Main
                </h4>
                
                {isMaintenance ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-orange-800 text-sm">Sedang Perawatan</div>
                      <div className="text-xs text-orange-600 mt-0.5">Lapangan tidak dapat dipesan.</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {HOURS.map((hour) => {
                      const status = getSlotStatus(court.id, hour);
                      
                      let btnStyle = "";
                      let label = "";
                      let bData = null;
                      
                      if (status === "AVAILABLE") {
                        btnStyle = "border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 cursor-pointer shadow-sm";
                        label = "Kosong";
                      } else if (status === "BOOKED") {
                        bData = getBookingData(court.id, hour);
                        const isDP = bData?.paymentType === "DP_50" && bData?.status === "PAID_DP";
                        if (isDP) {
                          btnStyle = "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm cursor-pointer hover:bg-yellow-100";
                        } else {
                          btnStyle = "bg-red-50 text-red-700 border-red-200 shadow-sm cursor-not-allowed";
                        }
                        label = bData?.guestName || "Penuh";
                      } else if (status === "PAST") {
                        btnStyle = "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through";
                        label = "Lewat";
                      }
                      
                      return (
                        <button
                          key={`${court.id}-${hour}`}
                          disabled={status !== "AVAILABLE" && !(status === "BOOKED" && bData?.paymentType === "DP_50" && bData?.status === "PAID_DP")}
                          onClick={() => handleCellClick(court, hour, status)}
                          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-200 ${btnStyle} relative group`}
                        >
                          <span className={`font-bold text-sm ${status === 'BOOKED' ? 'text-red-900' : ''}`}>{hour}</span>
                          <span className="text-[10px] uppercase font-medium mt-0.5 truncate w-full px-1 text-center">
                            {label}
                          </span>
                          {/* Tooltip for booked */}
                          {status === "BOOKED" && bData && (
                            <div className="absolute hidden group-hover:block z-20 bottom-full mb-2 w-32 bg-gray-900 text-white text-xs p-2 rounded shadow-lg text-center left-1/2 -translate-x-1/2">
                              {bData.guestName} <br />
                              <span className={bData.status === "PAID_DP" ? "text-blue-300" : "text-green-300"}>
                                {bData.status === "PAID_DP" ? "DP 50%" : "LUNAS"}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Tanggal:</span>
                  <span className="font-bold text-gray-900">{format(parseISO(date), "dd MMMM yyyy")}</span>
                  <span className="text-gray-500">Lapangan:</span>
                  <span className="font-bold text-gray-900">{selectedSlot.court.name}</span>
                  <span className="text-gray-500">Jam Mulai:</span>
                  <span className="font-bold text-gray-900">{selectedSlot.time}</span>
                </div>
              </div>

              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan / Instansi *</label>
                  <input 
                    type="text" 
                    required
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Contoh: Budi atau PT. Sukses"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp (Opsional)</label>
                  <input 
                    type="tel" 
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400 bg-white"
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900"
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
                    Rp {(paymentType === "DP_50" ? (selectedSlot.court.pricePerHour * duration) / 2 : selectedSlot.court.pricePerHour * duration).toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#a6192e] hover:bg-red-800 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "💾 Simpan & Kunci Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pelunasan */}
      {pelunasanSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Terima Pelunasan</h3>
              <button 
                onClick={() => setPelunasanSlot(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handlePelunasan} className="p-6">
              <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-yellow-700">Pelanggan:</span>
                  <span className="font-bold text-yellow-900">{pelunasanSlot.booking.guestName}</span>
                  <span className="text-yellow-700">Lapangan:</span>
                  <span className="font-bold text-yellow-900">{pelunasanSlot.court.name}</span>
                  <span className="text-yellow-700">Jam Mulai:</span>
                  <span className="font-bold text-yellow-900">{pelunasanSlot.booking.startTime}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Harga Total:</span>
                  <span className="font-medium text-gray-900">Rp {pelunasanSlot.court.pricePerHour.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-4">
                  <span className="text-gray-500">Sudah Dibayar (DP):</span>
                  <span className="font-medium text-green-600">- Rp {(pelunasanSlot.court.pricePerHour / 2).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-bold">Sisa Tagihan:</span>
                  <span className="text-2xl font-black text-red-600">
                    Rp {(pelunasanSlot.court.pricePerHour / 2).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Memproses..." : "✅ Terima Pelunasan & Lunas"}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
