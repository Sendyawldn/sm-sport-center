<div align="center">
  <img src="https://raw.githubusercontent.com/Sendyawldn/sm-sport-center/main/public/placeholder.png" alt="SM Sport Center Logo" width="120" />

  <h1 align="center">🏟️ SM Sport Center</h1>

  <p align="center">
    <strong>Sistem Reservasi Lapangan Futsal & Badminton Terintegrasi</strong>
  </p>

  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  </p>
</div>

---

## ✨ Fitur Utama

- **📅 Real-Time Booking System:** Pesan jadwal lapangan Futsal & Badminton tanpa bentrok.
- **⏱️ Pilihan Durasi Fleksibel:** Pengguna dapat memilih durasi bermain (1, 2, atau 3 jam) secara dinamis.
- **🔒 Anti Double-Booking:** Validasi ganda di frontend dan backend menggunakan transaksi database ACID untuk memastikan jadwal aman.
- **⏳ Auto-Cancel Cron (Lazy Expiration):** Pesanan dibatalkan otomatis jika melewati batas waktu tunggu pembayaran (15 menit).
- **💳 Pembayaran QRIS Dinamis:** Pop-up modal QRIS cerdas yang terintegrasi langsung di Riwayat Pesanan dengan polling status otomatis.
- **🛡️ Autentikasi Pengguna:** Login dan Registrasi berbasis Session JWT untuk Admin & Pelanggan.
- **👑 Dasbor Admin Terpadu:** Modul lengkap mencakup validasi pembayaran, statistik pendapatan, ekspor laporan, dan **Manajemen Lapangan** (Ubah harga & status ketersediaan secara langsung).
- **📱 Responsif:** Tampilan UI ramah pengguna baik dari ponsel maupun desktop.

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js (App Router)](https://nextjs.org) | Frontend & Backend SSR/API terpadu |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Mobile-first CSS framework |
| **ORM** | [Prisma](https://prisma.io) | Type-safe database client |
| **Database** | [PostgreSQL](https://postgresql.org) | Database relasional robust (ACID compliant) |
| **Keamanan** | `bcryptjs` & `jose` | Password hashing & JWT Session Cookies |

## 🚀 Persiapan & Instalasi (Development)

Pastikan Anda sudah menginstal **Node.js (versi 18+)** dan menjalankan server PostgreSQL lokal.

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/Sendyawldn/sm-sport-center.git
   cd sm-sport-center
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env` dan tambahkan `DATABASE_URL` serta `JWT_SECRET`.
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sm_sport_center?schema=public"
   JWT_SECRET="secret-key-super-aman"
   ```

4. **Inisialisasi Database (Push Schema & Seeding):**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
   *(Skrip seed akan otomatis membuat akun Admin bawaan: `admin@smsport.com` / `admin123`)*

5. **Jalankan Aplikasi:**
   Untuk menjalankan server Next.js di terminal pertama:
   ```bash
   npm run dev
   ```
   Untuk menjalankan **Cron Auto-Cancel** di terminal kedua:
   ```bash
   npx tsx scripts/cron.ts
   ```

## 📁 Struktur Direktori Penting

```text
sm-sport-center/
├── app/
│   ├── (customer)/      # Halaman pelanggan (Beranda, Jadwal, Profil)
│   ├── admin/           # Area khusus Admin (Validasi, Laporan)
│   └── actions/         # Server Actions Next.js (Auth, Booking, Payment)
├── components/          # Komponen UI React (Navbar, AuthModal, dll)
├── prisma/              # Prisma schema & seeding script
└── scripts/             # Skrip Cron Jobs (auto-cancel.ts)
```

## 📝 Akun Pengujian (Testing)

- **Admin Dashboard:** `/admin/dashboard`
  - **Email:** `admin@smsport.com`
  - **Password:** `admin123`

---

<div align="center">
  Dibuat dengan ❤️ untuk kemudahan olahraga Anda.
</div>
