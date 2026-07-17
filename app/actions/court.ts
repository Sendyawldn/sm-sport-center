"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { CourtStatus } from "@prisma/client";

export async function updateCourt(courtId: string, pricePerHour: number, status: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    if (pricePerHour < 0) {
      throw new Error("Harga tidak boleh kurang dari 0");
    }

    if (!["AVAILABLE", "MAINTENANCE"].includes(status)) {
      throw new Error("Status tidak valid");
    }

    const court = await prisma.court.update({
      where: { id: courtId },
      data: {
        pricePerHour,
        status: status as CourtStatus,
      },
    });

    revalidatePath("/admin/lapangan");
    revalidatePath("/booking"); // Revalidate customer page
    
    return { success: true, court };
  } catch (error: any) {
    console.error("Error updating court:", error);
    return { success: false, error: error.message || "Gagal memperbarui lapangan" };
  }
}

export async function createCourt(name: string, type: string, pricePerHour: number, status: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    if (!name || name.trim() === "") {
      throw new Error("Nama lapangan tidak boleh kosong");
    }

    if (pricePerHour < 0) {
      throw new Error("Harga tidak boleh kurang dari 0");
    }

    if (!["FUTSAL", "BADMINTON"].includes(type)) {
      throw new Error("Tipe lapangan tidak valid");
    }

    if (!["AVAILABLE", "MAINTENANCE"].includes(status)) {
      throw new Error("Status tidak valid");
    }

    const court = await prisma.court.create({
      data: {
        name: name.trim(),
        type: type as any,
        pricePerHour,
        status: status as CourtStatus,
      },
    });

    revalidatePath("/admin/lapangan");
    revalidatePath("/booking");
    
    return { success: true, court };
  } catch (error: any) {
    console.error("Error creating court:", error);
    return { success: false, error: error.message || "Gagal menambahkan lapangan" };
  }
}

export async function deleteCourt(courtId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    // Check if court has bookings
    const existingBookings = await prisma.booking.findFirst({
      where: { courtId },
    });

    if (existingBookings) {
      return { 
        success: false, 
        error: "Lapangan tidak bisa dihapus karena sudah memiliki riwayat pemesanan. Ubah statusnya menjadi 'Perbaikan' untuk menonaktifkannya." 
      };
    }

    await prisma.court.delete({
      where: { id: courtId },
    });

    revalidatePath("/admin/lapangan");
    revalidatePath("/booking");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting court:", error);
    return { success: false, error: error.message || "Gagal menghapus lapangan" };
  }
}
