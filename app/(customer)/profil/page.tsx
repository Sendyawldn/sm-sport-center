import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default async function ProfilPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Saya</h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Nama Lengkap</label>
              <div className="mt-1 text-lg font-semibold text-gray-900">{user.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <div className="mt-1 text-lg font-semibold text-gray-900">{user.email || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Nomor Telepon</label>
              <div className="mt-1 text-lg font-semibold text-gray-900">{user.phone || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Tipe Akun</label>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {user.role === "ADMIN" ? (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Administrator</span>
                ) : (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Pelanggan</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-10 flex flex-col justify-center min-w-[200px]">
            {user.role === "ADMIN" && (
              <a 
                href="/admin/dashboard" 
                className="w-full text-center bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-xl hover:bg-blue-100 transition-colors mb-4 border border-blue-100"
              >
                Masuk ke Admin Panel
              </a>
            )}
            <form action={logout}>
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm"
              >
                Keluar (Logout)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
