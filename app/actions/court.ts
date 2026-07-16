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
