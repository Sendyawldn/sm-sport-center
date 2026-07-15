"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { logout } from "@/app/actions/auth";

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export default function Navbar({ session, user }: { session: any, user?: any }) {
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

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
                  className="text-gray-600 hover:text-[#991b1b] font-medium px-4 py-2 cursor-pointer"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => { setAuthMode("register"); setIsAuthModalOpen(true); }}
                  className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold px-6 py-2.5 rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  Daftar
                </button>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-md transition-colors border ${
                    isAccountMenuOpen 
                      ? 'border-[#991b1b] text-[#991b1b] bg-red-50' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {user?.name ? user.name : "Akun Saya"}
                  <svg className={`w-4 h-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
                    {/* Click overlay to close dropdown when clicking outside */}
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsAccountMenuOpen(false)}></div>
                    <form action={logout}>
                      <button 
                        type="submit" 
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-gray-900 hover:opacity-70 transition-opacity">
              <MenuIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          defaultMode={authMode} 
        />
      )}
    </nav>
  );
}
