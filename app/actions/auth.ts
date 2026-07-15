"use server";

import { prisma } from "@/lib/prisma";
import { setSession, clearSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string; // can be email or phone
  const password = formData.get("password") as string;

  if (!name || !contact || !password) {
    return { error: "Semua field harus diisi" };
  }

  // Check if contact is email or phone
  const isEmail = contact.includes("@");
  const email = isEmail ? contact : null;
  const phone = !isEmail ? contact : null;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email ?? undefined },
          { phone: phone ?? undefined },
        ],
      },
    });

    if (existingUser) {
      return { error: "Email atau nomor telepon sudah terdaftar" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    await setSession({ id: user.id, role: user.role });
  } catch (error) {
    return { error: "Terjadi kesalahan pada server" };
  }

  redirect("/");
}

export async function login(formData: FormData) {
  const contact = formData.get("contact") as string;
  const password = formData.get("password") as string;

  if (!contact || !password) {
    return { error: "Semua field harus diisi" };
  }

  const isEmail = contact.includes("@");

  try {
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: contact } : { phone: contact },
    });

    if (!user) {
      return { error: "Kredensial tidak valid" };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: "Kredensial tidak valid" };
    }

    await setSession({ id: user.id, role: user.role });
    
    if (user.role === "ADMIN") {
      redirect("/admin/dashboard");
    } else {
      redirect("/");
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return { error: "Terjadi kesalahan pada server" };
  }
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
