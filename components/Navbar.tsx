"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthModal from "./AuthModal";

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export default function Navbar({ session }: { session: any }) {
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Helper to determine active link styles
  const getLinkClasses = (path: string) => {
    if (pathname === path) {
      return "text-[#991b1b] font-bold transition-colors";
    }
    return "text-gray-600 hover:text-[#991b1b] font-medium transition-colors";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <span className="font-extrabold text-3xl italic text-[#991b1b] tracking-tighter">SM</span>
            </div>
            <Link href="/" className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">Sport Center</Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={getLinkClasses("/")}>Beranda</Link>
            <Link href="/booking" className={getLinkClasses("/booking")}>Jadwal & Booking</Link>
            {session && (
              <Link href="/riwayat" className={getLinkClasses("/riwayat")}>
                Riwayat Pesanan
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!session ? (
              <>
                <button 
                  onClick={() => { setAuthMode("login"); setIsAuthModalOpen(true); }}
                  className="text-gray-600 hover:text-[#991b1b] font-medium px-4 py-2"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => { setAuthMode("register"); setIsAuthModalOpen(true); }}
                  className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold px-6 py-2.5 rounded-md transition-colors shadow-sm"
                >
                  Daftar
                </button>
              </>
            ) : (
              <Link href="/profil" className={`text-sm font-bold px-5 py-2.5 rounded-md transition-colors border ${
                pathname === '/profil' 
                  ? 'border-[#991b1b] text-[#991b1b] bg-red-50' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}>
                Akun Saya
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-gray-900 hover:opacity-70 transition-opacity">
              <MenuIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultMode={authMode} 
      />
    </nav>
  );
}
