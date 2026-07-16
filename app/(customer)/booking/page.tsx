"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBooking } from "@/app/actions/booking";

import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { format, parseISO } from "date-fns";
import FilterBar from "@/components/FilterBar";

type Court = {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
  status: string;
};

type Booking = {
  id: string;
  courtId: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: string;
};

const TIMEZONE = "Asia/Jakarta";

const getCourtImage = (type: string) => {
  if (type.toUpperCase() === "FUTSAL") {
    return "https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  }
  return "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sportFilter = searchParams?.get("sport") || "";
  const dateFilter = searchParams?.get("date") || "";

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState<{
    court: Court;
    time: string;
  } | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [paymentType, setPaymentType] = useState<"DP_50" | "FULL_100">("FULL_100");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [qrisUrl, setQrisUrl] = useState<string>("");

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  // Generate hours: 08:00 to 23:00
  const hours = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pendingBookingId) {
      const paymentUrl = `${window.location.protocol}//${window.location.host}/pay/${pendingBookingId}`;
      setQrisUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentUrl)}`);

      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/bookings/${pendingBookingId}/status`);
          const data = await res.json();
          if (data.status === "PAID" || data.status === "PAID_DP") {
            clearInterval(interval);
            setMessage({
              text: "Pembayaran berhasil! Mengalihkan...",
              type: "success",
            });
            setTimeout(() => {
              router.push("/riwayat");
            }, 1500);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [pendingBookingId, router]);

  useEffect(() => {
    if (dateFilter) {
      setSelectedDate(dateFilter);
    } else {
      const now = new Date();
      const todayStr = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd");
      setSelectedDate(todayStr);
    }
  }, [dateFilter]);

  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/courts?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.courts) setCourts(data.courts);
        if (data.bookings) setBookings(data.bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const isSlotPast = (timeStr: string) => {
    const now = currentTime;
    const todayStr = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd");
    if (selectedDate > todayStr) return false;
    if (selectedDate < todayStr) return true;

    const currentHourStr = formatInTimeZone(now, TIMEZONE, "HH:mm");
    return timeStr <= currentHourStr;
  };

  const getSlotStatus = (courtId: string, timeStr: string) => {
    if (isSlotPast(timeStr)) return "PAST";

    const overlapping = bookings.find((b) => {
      if (b.courtId !== courtId) return false;
      // Simple logic since duration is 1 hour and timeStr is like "08:00"
      // start_baru < end_existing AND end_baru > start_existing
      const endHour = parseInt(timeStr.split(":")[0]) + 1;
      const endTimeStr = `${endHour.toString().padStart(2, "0")}:00`;

      return timeStr < b.endTime && endTimeStr > b.startTime;
    });

    if (overlapping) return "BOOKED";

    const court = courts.find((c) => c.id === courtId);
    if (court?.status === "MAINTENANCE") return "MAINTENANCE";

    return "AVAILABLE";
  };

  const handleSlotClick = (court: Court, time: string) => {
    const status = getSlotStatus(court.id, time);
    if (status === "AVAILABLE") {
      setSelectedSlot({ court, time });
      setMessage(null);
      setPendingBookingId(null);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    setMessage(null);

    const res = await createBooking(
      selectedSlot.court.id,
      selectedDate,
      selectedSlot.time,
      1,
      paymentType
    );

    setIsBooking(false);

    if (res.error) {
      setMessage({ text: res.error, type: "error" });
      return;
    }

    if (res.bookingId) {
      setPendingBookingId(res.bookingId);
    }
  };

  const displayCourts = courts.filter((court) => {
    if (!sportFilter) return true;
    return court.type.toLowerCase() === sportFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      {/* Banner Section */}
      <div className="relative pt-32 pb-24 bg-[#a6192e] overflow-hidden">
        {/* Topographic background SVG */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,160 C320,300 420,0 720,160 C1020,320 1120,0 1440,160" stroke="white" strokeWidth="1.5" />
            <path d="M0,80 C320,220 420,-80 720,80 C1020,240 1120,-80 1440,80" stroke="white" strokeWidth="1" />
            <path d="M0,240 C320,380 420,80 720,240 C1020,400 1120,80 1440,240" stroke="white" strokeWidth="1" />
            <path d="M0,120 C400,0 600,320 1000,160 C1200,80 1300,200 1440,120" stroke="white" strokeWidth="1" />
            <path d="M0,200 C400,80 600,400 1000,240 C1200,160 1300,280 1440,200" stroke="white" strokeWidth="1.5" strokeDasharray="6,4"/>
            <path d="M0,40 C400,-80 600,240 1000,80 C1200,0 1300,120 1440,40" stroke="white" strokeWidth="1" opacity="0.6"/>
            <path d="M0,280 C400,160 600,480 1000,320 C1200,240 1300,360 1440,280" stroke="white" strokeWidth="1" opacity="0.6"/>
          </svg>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 uppercase tracking-wider italic">
            DAFTAR LAPANGAN {sportFilter ? sportFilter.toUpperCase() : "OLAHRAGA"}
          </h1>
          <p className="text-white/90 text-sm md:text-base font-medium max-w-2xl">
            Informasi semua jadwal lapangan olahraga yang telah terdaftar dan dapat di-booking melalui website SM Sport Center.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <FilterBar className="-mt-12 mb-10 relative z-20 max-w-7xl mx-auto" />
        <div className="max-w-7xl mx-auto pb-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : displayCourts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
              Tidak ada lapangan yang tersedia.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCourts.map((court) => {
                const isMaintenance = court.status === "MAINTENANCE";
                return (
                  <div key={court.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
                    {/* Hero Image */}
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
                    
                    {/* Time Slots */}
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
                          {hours.map((hour) => {
                            const status = getSlotStatus(court.id, hour);
                            
                            let btnStyle = "";
                            let label = "";
                            
                            if (status === "AVAILABLE") {
                              btnStyle = "border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 cursor-pointer shadow-sm";
                              label = "Kosong";
                            } else if (status === "BOOKED") {
                              btnStyle = "bg-red-50 text-red-500 border-red-200 opacity-70 cursor-not-allowed";
                              label = "Penuh";
                            } else if (status === "PAST") {
                              btnStyle = "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through";
                              label = "Lewat";
                            }
                            
                            return (
                              <button
                                key={`${court.id}-${hour}`}
                                disabled={status !== "AVAILABLE"}
                                onClick={() => handleSlotClick(court, hour)}
                                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-200 ${btnStyle}`}
                              >
                                <span className="font-bold text-sm">{hour}</span>
                                <span className="text-[10px] uppercase font-medium mt-0.5">{label}</span>
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
          )}
        </div>

      {/* Booking Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="text-xl font-bold text-gray-900">
                Detail Pemesanan
              </h3>
              <button 
                onClick={() => {
                  setSelectedSlot(null);
                  setMessage(null);
                  setPendingBookingId(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {message.type === "error" 
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    }
                  </svg>
                  {message.text}
                </div>
              )}

              {!pendingBookingId ? (
                <>
                  {/* Order Info Card */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm font-medium">Lapangan</span>
                      <span className="font-bold text-gray-900">{selectedSlot.court.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm font-medium">Tanggal</span>
                      <span className="font-bold text-gray-900">{format(parseISO(selectedDate), "dd MMMM yyyy")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm font-medium">Waktu</span>
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm">
                        {selectedSlot.time} - {`${parseInt(selectedSlot.time.split(":")[0]) + 1}:00`}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="text-gray-500 text-sm font-medium">Harga Normal</span>
                      <span className="font-bold text-gray-900">
                        Rp {selectedSlot.court.pricePerHour.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Metode Pembayaran</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentType("DP_50")}
                        className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                          paymentType === "DP_50" 
                            ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-sm" 
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        {paymentType === "DP_50" && (
                          <div className="absolute top-2 right-2">
                            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="font-bold text-gray-900 text-sm">DP 50%</div>
                        <div className="text-[11px] text-gray-500 mt-1 leading-snug">Sisa dilunasi di lokasi</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType("FULL_100")}
                        className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                          paymentType === "FULL_100" 
                            ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-sm" 
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        {paymentType === "FULL_100" && (
                          <div className="absolute top-2 right-2">
                            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="font-bold text-gray-900 text-sm">Lunas 100%</div>
                        <div className="text-[11px] text-gray-500 mt-1 leading-snug">Bayar penuh sekarang</div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-600/5 rounded-2xl border border-blue-100 p-4 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Total Tagihan</div>
                      <div className="text-2xl font-black text-gray-900">
                        Rp {(paymentType === "DP_50" ? selectedSlot.court.pricePerHour / 2 : selectedSlot.court.pricePerHour).toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 space-y-4 text-center">
                  <h4 className="text-lg font-bold text-gray-900">Scan QR untuk Membayar</h4>
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    {qrisUrl && <img src={qrisUrl} alt="QRIS" className="w-48 h-48" />}
                  </div>
                  <p className="text-sm text-gray-500">
                    Gunakan kamera HP Anda untuk scan QR code ini.
                    Halaman ini otomatis tertutup jika pembayaran di HP berhasil.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-blue-600 text-sm font-semibold animate-pulse mt-4">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menunggu pembayaran di HP Anda...
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-white">
              {!pendingBookingId ? (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isBooking}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                >
                  {isBooking ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      Dapatkan QRIS Pembayaran
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedSlot(null);
                    setPendingBookingId(null);
                  }}
                  className="w-full py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                >
                  Batal / Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Memuat...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
