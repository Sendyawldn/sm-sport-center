import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 z-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">SM Admin</h2>
          <p className="text-gray-400 text-sm mt-1">Sport Center System</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin/dashboard" className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors text-gray-300">
            📊 Dashboard
          </Link>
          <Link href="/admin/reservasi" className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors text-gray-300">
            🗓️ Reservasi Kasir
          </Link>
          <Link href="/admin/laporan" className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors text-gray-300">
            📈 Laporan Ekspor
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
          Masuk sebagai <br />
          <strong className="text-white">Administrator</strong>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
