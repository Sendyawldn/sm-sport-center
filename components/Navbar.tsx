import Link from "next/link";
import { getSession } from "@/lib/auth";

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">SM</span>
            </div>
            <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">Sport Center</Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Beranda</Link>
            <Link href="/booking" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Jadwal & Booking</Link>
            {session && (
              <Link href="/riwayat" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                Riwayat Pesanan
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!session ? (
              <>
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2">
                  Masuk
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition-colors shadow-sm">
                  Daftar
                </Link>
              </>
            ) : (
              <Link href="/profil" className="text-sm text-gray-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                Akun Saya
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-gray-900">
              <MenuIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
