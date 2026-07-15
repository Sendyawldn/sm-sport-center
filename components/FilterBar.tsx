"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");

  const [sportOpen, setSportOpen] = useState(false);
  
  // Close dropdown when clicking outside (simple approach for now, or just toggle on click)
  // Usually we'd use a ref and useEffect, but for simplicity we can toggle on the button.
  // We'll use a backdrop invisible button to close it.

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sport) params.append("sport", sport);
    if (date) params.append("date", date);
    router.push(`/booking?${params.toString()}`);
  };

  // Label display logic
  const sportLabel = sport === "futsal" ? "Futsal" : sport === "badminton" ? "Badminton" : "Semua Olahraga";
  const dateLabel = date ? new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : "dd/mm/yyyy";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 sm:-mt-14">
      {sportOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setSportOpen(false)}></div>
      )}
      {/* Background merah solid, sudut membulat seperti pada referensi */}
      <div className="bg-[#a6192e] rounded-xl shadow-xl w-full relative z-50">
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center justify-between p-4 md:p-5 gap-4 md:gap-0">
          
          <div className="flex flex-1 items-center justify-between w-full">
            {/* 1. Cabang Olahraga */}
            <div 
              className="flex-1 flex items-center gap-4 relative cursor-pointer group px-2"
              onClick={() => setSportOpen(!sportOpen)}
            >
              <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center shrink-0">
                {/* Icon aktivitas/olahraga */}
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-white/90">Cabang Olahraga</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[15px] font-bold text-white">{sportLabel}</span>
                  <svg className={`w-4 h-4 text-white transition-transform ${sportOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Custom Dropdown Menu */}
              {sportOpen && (
                <div className="absolute top-16 left-0 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 overflow-hidden">
                  <div 
                    className="px-6 py-3 hover:bg-gray-50 text-gray-800 hover:text-[#0056b3] text-[17px] cursor-pointer transition-colors"
                    onClick={() => setSport("")}
                  >
                    Semua Olahraga
                  </div>
                  <div 
                    className="px-6 py-3 hover:bg-gray-50 text-gray-800 hover:text-[#0056b3] text-[17px] cursor-pointer transition-colors"
                    onClick={() => setSport("futsal")}
                  >
                    Futsal
                  </div>
                  <div 
                    className="px-6 py-3 hover:bg-gray-50 text-gray-800 hover:text-[#0056b3] text-[17px] cursor-pointer transition-colors"
                    onClick={() => setSport("badminton")}
                  >
                    Badminton
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] h-10 bg-white/20 mx-2"></div>

            {/* 2. Tanggal */}
            <div className="flex-1 flex items-center gap-4 relative cursor-pointer group px-2">
              <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center shrink-0">
                {/* Icon kalender */}
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-white/90">Pilih Tanggal</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[15px] font-bold text-white">{dateLabel}</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Invisible Input overlay */}
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10"
              />
            </div>
          </div>

          {/* 3. Button */}
          <div className="w-full md:w-auto md:ml-4 flex-shrink-0">
            <button 
              type="submit" 
              className="w-full md:w-auto bg-white text-[#a6192e] hover:bg-gray-100 font-bold text-[15px] py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
            >
              Temukan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
