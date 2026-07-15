"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function BookingContent() {
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
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  // Generate hours: 08:00 to 23:00
  const hours = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

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
    const now = new Date();
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
    );
    setIsBooking(false);

    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({
        text: "Booking berhasil ditahan selama 15 menit. Silakan lakukan pembayaran.",
        type: "success",
      });
      setSelectedSlot(null);
      // Refresh
      setLoading(true);
      const data = await fetch(`/api/courts?date=${selectedDate}`).then((r) =>
        r.json(),
      );
      if (data.courts) setCourts(data.courts);
      if (data.bookings) setBookings(data.bookings);
      setLoading(false);
    }
  };

  const displayCourts = courts.filter((court) => {
    if (!sportFilter) return true;
    return court.type.toLowerCase() === sportFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 sm:px-6 lg:px-8 font-sans">
      <FilterBar className="mb-10 relative z-20 max-w-7xl" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Jadwal Lapangan
        </h1>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-gray-500">
              Memuat jadwal...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-600 min-w-[100px] sticky left-0 z-10">
                    Jam
                  </th>
                  {displayCourts.map((court) => (
                    <th
                      key={court.id}
                      className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 min-w-[150px]"
                    >
                      {court.name}
                      <div className="text-xs font-normal text-gray-500 mt-1">
                        Rp {court.pricePerHour.toLocaleString("id-ID")} / jam
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour} className="group">
                    <td className="p-4 border-b border-gray-100 font-medium text-gray-500 sticky left-0 bg-white group-hover:bg-gray-50 z-10 border-r">
                      {hour}
                    </td>
                    {displayCourts.map((court) => {
                      const status = getSlotStatus(court.id, hour);

                      let bgClass = "bg-white";
                      let textClass = "text-gray-400";
                      let label = "";
                      let cursor = "cursor-default";

                      if (status === "PAST") {
                        bgClass = "bg-gray-100";
                        textClass = "text-gray-400 line-through";
                        label = "Lewat";
                      } else if (status === "MAINTENANCE") {
                        bgClass = "bg-orange-50";
                        textClass = "text-orange-600";
                        label = "Perawatan";
                      } else if (status === "BOOKED") {
                        bgClass = "bg-red-50";
                        textClass = "text-red-600";
                        label = "Dipesan";
                      } else if (status === "AVAILABLE") {
                        bgClass =
                          "bg-green-50 hover:bg-green-100 transition-colors";
                        textClass = "text-green-700 font-medium";
                        label = "Tersedia";
                        cursor = "cursor-pointer";
                      }

                      return (
                        <td
                          key={`${court.id}-${hour}`}
                          className={`p-3 border-b border-gray-100 border-l border-r border-dashed border-gray-200 ${bgClass} ${cursor}`}
                          onClick={() => handleSlotClick(court, hour)}
                        >
                          <div className={`text-sm text-center ${textClass}`}>
                            {label}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Konfirmasi Booking
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-500">Lapangan</span>
                <span className="font-semibold text-gray-900">
                  {selectedSlot.court.name}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-500">Tanggal</span>
                <span className="font-semibold text-gray-900">
                  {format(parseISO(selectedDate), "dd MMMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-500">Waktu</span>
                <span className="font-semibold text-gray-900">
                  {selectedSlot.time} -{" "}
                  {`${parseInt(selectedSlot.time.split(":")[0]) + 1}:00`}
                </span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-gray-500">Total Harga</span>
                <span className="font-bold text-blue-600 text-lg">
                  Rp {selectedSlot.court.pricePerHour.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setSelectedSlot(null);
                  setMessage(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isBooking}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isBooking}
              >
                {isBooking ? "Memproses..." : "Pesan & Hold 15 Menit"}
              </button>
            </div>
          </div>
        </div>
      )}
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
