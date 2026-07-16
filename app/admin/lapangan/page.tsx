import { prisma } from "@/lib/prisma";
import CourtClientUI from "./CourtClientUI";

export const dynamic = 'force-dynamic';

export default async function AdminLapanganPage() {
  const courts = await prisma.court.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Convert decimal to number for Client Component
  const initialCourts = courts.map(c => ({
    id: c.id,
    name: c.name,
    type: c.type,
    pricePerHour: Number(c.pricePerHour),
    status: c.status,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Lapangan</h1>
        <p className="text-gray-500 mt-2">
          Atur harga per jam dan status ketersediaan lapangan. Perubahan akan langsung terlihat oleh pelanggan.
        </p>
      </div>

      <CourtClientUI initialCourts={initialCourts} />
    </div>
  );
}
