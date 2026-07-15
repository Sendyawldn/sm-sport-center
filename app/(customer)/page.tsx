import Link from "next/link";
import FilterBar from "@/components/FilterBar";

// --- Custom SVGs ---
const FutsalCourtSVG = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 400 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="400" height="240" fill="#15803d" />
    <rect
      x="20"
      y="20"
      width="360"
      height="200"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="200"
      y1="20"
      x2="200"
      y2="220"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <circle
      cx="200"
      cy="120"
      r="30"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <circle cx="200" cy="120" r="4" fill="white" />
    <rect
      x="20"
      y="60"
      width="50"
      height="120"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <path
      d="M70 95 A 25 25 0 0 1 70 145"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <rect
      x="330"
      y="60"
      width="50"
      height="120"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <path
      d="M330 95 A 25 25 0 0 0 330 145"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
  </svg>
);

const BadmintonCourtSVG = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 400 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="400" height="240" fill="#0f766e" />
    <rect
      x="40"
      y="20"
      width="320"
      height="200"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="200"
      y1="10"
      x2="200"
      y2="230"
      stroke="#fcd34d"
      strokeWidth="4"
      strokeDasharray="4 2"
    />
    <line
      x1="140"
      y1="20"
      x2="140"
      y2="220"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="260"
      y1="20"
      x2="260"
      y2="220"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="60"
      y1="20"
      x2="60"
      y2="220"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="340"
      y1="20"
      x2="340"
      y2="220"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="40"
      y1="40"
      x2="360"
      y2="40"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="40"
      y1="200"
      x2="360"
      y2="200"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="40"
      y1="120"
      x2="140"
      y2="120"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
    <line
      x1="260"
      y1="120"
      x2="360"
      y2="120"
      stroke="white"
      strokeWidth="3"
      opacity="0.9"
    />
  </svg>
);

// --- Icons ---
const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
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
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

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

// --- Data ---
const courts = [
  {
    id: 1,
    name: "Lapangan Futsal 1",
    type: "Futsal",
    price: "Rp 150.000",
    svg: <FutsalCourtSVG />,
  },
  {
    id: 2,
    name: "Lapangan Futsal 2",
    type: "Futsal",
    price: "Rp 150.000",
    svg: <FutsalCourtSVG />,
  },
  {
    id: 3,
    name: "Lapangan Badminton 1",
    type: "Badminton",
    price: "Rp 50.000",
    svg: <BadmintonCourtSVG />,
  },
  {
    id: 4,
    name: "Lapangan Badminton 2",
    type: "Badminton",
    price: "Rp 50.000",
    svg: <BadmintonCourtSVG />,
  },
  {
    id: 5,
    name: "Lapangan Badminton 3",
    type: "Badminton",
    price: "Rp 50.000",
    svg: <BadmintonCourtSVG />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 scroll-smooth">
      {/* 2. Hero Section - Bright Layout */}
      <header className="relative w-full h-[600px] md:h-[700px] flex flex-col justify-center items-start pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        ></div>

        {/* Light overlay for readability if needed, or gradient */}
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

      {/* Stats Section (Like the bright reference) */}
      <section className="py-16 bg-white relative z-10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center divide-x-2 divide-[#991b1b] text-center">
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

      {/* 3. Info Lapangan - Light Theme Cards */}
      <section
        id="lapangan"
        className="py-20 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilihan Lapangan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fasilitas berstandar turnamen yang dirawat setiap hari untuk
              kenyamanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courts.map((court) => (
              <div
                key={court.id}
                className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="relative h-56 w-full flex items-center justify-center bg-gray-100 overflow-hidden p-6">
                  <div className="w-full h-full relative z-0 opacity-90 group-hover:scale-105 transition-transform duration-700">
                    {court.svg}
                  </div>
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full text-xs font-bold text-[#b91c1c] shadow-sm">
                    {court.type}
                  </div>
                </div>
                <div className="p-8 border-t border-gray-50">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                    {court.name}
                  </h3>
                  <div className="flex items-center text-gray-500 mb-8">
                    <span className="font-bold text-[#b91c1c] text-2xl">
                      {court.price}
                    </span>
                    <span className="text-sm ml-2 font-medium">/ jam</span>
                  </div>
                  <Link
                    href="/booking"
                    className="block w-full text-center bg-gray-50 hover:bg-[#b91c1c] hover:text-white text-gray-700 border border-gray-200 hover:border-transparent font-bold py-4 px-4 rounded-full transition-all hover:shadow-lg"
                  >
                    Pilih Jadwal
                  </Link>
                </div>
              </div>
            ))}
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
                  <span className="font-extrabold text-3xl italic text-[#991b1b] tracking-tighter">
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
                    className="text-gray-500 hover:text-[#991b1b] font-medium transition-colors"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <a
                    href="#lapangan"
                    className="text-gray-500 hover:text-[#991b1b] font-medium transition-colors"
                  >
                    Fasilitas
                  </a>
                </li>
                <li>
                  <Link
                    href="/booking"
                    className="text-gray-500 hover:text-[#991b1b] font-medium transition-colors"
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
                  <LocationIcon className="w-6 h-6 text-[#991b1b] shrink-0 mt-0.5" />
                  <span className="text-gray-600 font-medium">
                    Jl. Olahraga No. 123, Komplek Stadion, Jakarta 10110
                  </span>
                </li>
                <li className="flex items-center gap-3 group">
                  <PhoneIcon className="w-6 h-6 text-[#991b1b] shrink-0" />
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
                  <span className="text-[#991b1b] font-bold">
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
