"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Reservasi Kasir", href: "/admin/reservasi", icon: "🗓️" },
    { name: "Laporan Pendapatan", href: "/admin/laporan", icon: "💰" },
    { name: "Laporan Penggunaan", href: "/admin/laporan-penggunaan", icon: "📈" },
    { name: "Manajemen Lapangan", href: "/admin/lapangan", icon: "🎾" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 z-10 shadow-2xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">SM Admin</h2>
        <p className="text-gray-400 text-sm mt-1">Sport Center System</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`block px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                isActive 
                  ? "bg-[#a6192e] text-white font-bold shadow-lg shadow-red-900/20" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Masuk sebagai <br />
          <strong className="text-white">Administrator</strong>
        </div>
        <form action={logout}>
          <button type="submit" className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-gray-800 transition-colors" title="Logout">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
}
