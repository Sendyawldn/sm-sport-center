import Link from "next/link";
import FilterBar from "@/components/FilterBar";

// --- Icons ---
const LocationIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const PhoneIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.436-4.136-7.032-7.032l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 scroll-smooth">
      {/* 2. Hero Section */}
      <header className="relative w-full h-[600px] md:h-[700px] flex flex-col justify-center items-start pt-20">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-black/40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-20">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Booking Lapangan Olahraga <br className="hidden md:block" />
            <span className="text-white">Secara Instan</span>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed font-medium">
            Platform all-in-one untuk sewa lapangan futsal dan badminton.
            Olahraga makin mudah, cepat, dan menyenangkan tanpa takut jadwal
            bentrok!
          </p>
        </div>
      </header>

      {/* Floating Filter Bar */}
      <FilterBar />

      {/* Stats Section */}
      <section className="py-16 bg-white relative z-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center divide-x-2 divide-[#a6192e] text-center">
            <div className="px-8 py-4">
              <div className="text-4xl font-extrabold text-gray-900 mb-1">
                2
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Futsal
              </div>
            </div>
            <div className="px-8 py-4">
              <div className="text-4xl font-extrabold text-gray-900 mb-1">
                3
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Badminton
              </div>
            </div>
            <div className="px-8 py-4">
              <div className="text-4xl font-extrabold text-gray-900 mb-1">
                10k+
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Penyewaan
              </div>
            </div>
            <div className="px-8 py-4">
              <div className="text-4xl font-extrabold text-gray-900 mb-1">
                24/7
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Buka Terus
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Venue */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="inline-block px-4 py-1.5 bg-red-50 text-[#a6192e] rounded-full text-sm font-bold mb-6 tracking-wide">
                FASILITAS PREMIUM
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Kelola venue lebih praktis dan menguntungkan.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Nikmati kemudahan bermain di lapangan futsal dan badminton
                berstandar nasional. Kami menyediakan ruang ganti yang bersih,
                area parkir luas, lantai anti-slip, dan pencahayaan optimal
                untuk permainan maksimal.
              </p>
              <Link
                href="/booking"
                className="text-[#a6192e] font-bold flex items-center gap-2 hover:underline text-lg"
              >
                Lihat Jadwal Lapangan{" "}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      alt="Futsal"
                    />
                  </div>
                  <div className="h-64 bg-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      alt="Badminton"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="h-64 bg-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      alt="Venue"
                    />
                  </div>
                  <div className="h-48 bg-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      alt="Futsal Court"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Mudah */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 flex justify-center">
              {/* Phone Mockup Illustration */}
              <div className="relative w-[300px] h-[600px] bg-white rounded-[3rem] shadow-2xl border-[12px] border-gray-900 overflow-hidden flex flex-col">
                <div className="w-full h-32 bg-[#a6192e] flex flex-col p-6 text-white justify-end">
                  <div className="text-sm font-medium opacity-80">
                    Halo, Kawan
                  </div>
                  <div className="font-bold text-xl">Booking Lapangan</div>
                </div>
                <div className="flex-1 p-5 flex flex-col gap-4 bg-gray-50 overflow-hidden">
                  <div className="w-full h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-[#a6192e]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="h-3 w-20 bg-gray-200 rounded-full mb-2"></div>
                        <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
                    <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="w-full h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="h-3 w-24 bg-gray-200 rounded-full mb-2"></div>
                        <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full mb-2"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="inline-block px-4 py-1.5 bg-red-50 text-[#a6192e] rounded-full text-sm font-bold mb-6 tracking-wide">
                RESERVASI INSTAN
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                Booking jadwal lapangan hanya dalam ketukan jari.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                Tidak perlu lagi repot datang ke lokasi atau antre menelpon
                hanya untuk mengecek ketersediaan jadwal. Sistem pintar kami
                menyajikan data real-time, bebas bentrok jadwal, 100% akurat.
              </p>
              <ul className="space-y-6 mb-10">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-bold text-lg">
                    Cek jadwal kosong kapan saja secara real-time
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-bold text-lg">
                    Konfirmasi otomatis setelah pembayaran sukses
                  </span>
                </li>
              </ul>
              <Link
                href="/booking"
                className="text-[#a6192e] font-bold flex items-center gap-2 hover:underline text-lg"
              >
                Mulai Pesan{" "}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  className="w-full h-56 object-cover rounded-3xl shadow-md hover:scale-105 transition-transform duration-500"
                  alt="Tim Olahraga"
                />
                <img
                  src="https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  className="w-full h-56 object-cover rounded-3xl mt-8 shadow-md hover:scale-105 transition-transform duration-500"
                  alt="Kompetisi"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="inline-block px-4 py-1.5 bg-red-50 text-[#a6192e] rounded-full text-sm font-bold mb-6 tracking-wide">
                KEUNGGULAN KAMI
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-10">
                Kenapa Memilih SM Sport Center?
              </h2>

              <div className="space-y-10">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    Lokasi Strategis
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Berada di pusat kota dengan akses jalan raya mudah dan area
                    parkir yang sangat luas untuk mengakomodasi banyak
                    kendaraan.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    Fasilitas Standar Nasional
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Lantai lapangan menggunakan material berkualitas tinggi
                    (Interlock & Vinyl), sangat aman dan nyaman untuk pijakan
                    lutut atlet.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    Buka 24 Jam
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Kami siap melayani kebutuhan olahraga Anda kapan pun tanpa
                    batasan waktu, dari pagi buta hingga tengah malam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial & CTA */}
      <section className="py-20 bg-gray-50 border-t border-gray-100 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Testimonial Box */}
          <div className="bg-[#a6192e] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-[#8b1526] p-12 flex items-center justify-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 L100,100 M100,0 L0,100"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="text-4xl font-extrabold text-white text-center relative z-10 leading-tight">
                Apa kata <br /> Pelanggan?
              </h3>
            </div>
            <div className="w-full md:w-2/3 p-12 md:p-16 bg-white flex flex-col justify-center relative">
              <div className="absolute top-8 right-12 text-[#a6192e] opacity-10 text-8xl font-serif">
                "
              </div>
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden shadow-sm">
                  <img
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-xl text-gray-900">
                    Budi Santoso
                  </div>
                  <div className="text-gray-500 font-medium">
                    Kapten Tim Futsal FC
                  </div>
                </div>
              </div>
              <p className="text-xl text-gray-700 italic relative z-10 leading-relaxed font-medium">
                "Lapangan terbaik di kota ini! Booking lewat website ini sangat
                revolusioner. Sangat mudah, cepat, dan transparan. Tidak pernah
                ada drama jadwal bentrok lagi saat mau main."
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-br from-[#a6192e] to-[#8b1526] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center items-start relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                SM Sport Center.
                <br />
                Temukan Jadwal Mainmu Sekarang!
              </h2>
              <p className="text-white/80 text-xl mb-10 leading-relaxed font-medium">
                Pilih lapangan, tentukan waktu, dan pastikan jadwalmu aman hanya
                dalam 1 menit tanpa perlu menelpon.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/booking"
                  className="bg-white text-[#a6192e] hover:bg-gray-100 font-extrabold py-4 px-10 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl text-lg flex items-center gap-2"
                >
                  Booking Sekarang
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-80 md:h-auto relative">
              {/* Background Image for CTA */}
              <img
                src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="CTA Background"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#8b1526] to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer
        id="kontak"
        className="bg-white pt-20 pb-10 border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 flex items-center justify-center">
                  <span className="font-extrabold text-3xl italic text-[#a6192e] tracking-tighter">
                    SM
                  </span>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">
                  Sport Center
                </span>
              </div>
              <p className="text-gray-500 mb-6 leading-relaxed font-medium">
                Pusat kebugaran dan penyewaan lapangan kelas turnamen. Booking
                cepat, aman, dan tanpa antre panjang.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">
                Navigasi Utama
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-[#a6192e] font-medium transition-colors"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/booking"
                    className="text-gray-500 hover:text-[#a6192e] font-medium transition-colors"
                  >
                    Fasilitas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/booking"
                    className="text-gray-500 hover:text-[#a6192e] font-medium transition-colors"
                  >
                    Pesan Jadwal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">
                Kontak Kami
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <LocationIcon className="w-6 h-6 text-[#a6192e] shrink-0 mt-0.5" />
                  <span className="text-gray-600 font-medium">
                    Jl. Olahraga No. 123, Komplek Stadion, Jakarta 10110
                  </span>
                </li>
                <li className="flex items-center gap-3 group">
                  <PhoneIcon className="w-6 h-6 text-[#a6192e] shrink-0" />
                  <span className="text-gray-600 font-medium">
                    +62 812 3456 7890
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">
                Operasional
              </h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-3">
                  <span className="font-medium">Senin - Jumat</span>
                  <span className="text-gray-900 font-bold">08:00 - 23:00</span>
                </li>
                <li className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-3">
                  <span className="font-medium">Sabtu - Minggu</span>
                  <span className="text-[#a6192e] font-bold">
                    06:00 - 24:00
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 font-medium text-sm">
              &copy; {new Date().getFullYear()} SM Sport Center. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
