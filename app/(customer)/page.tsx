import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import { getSession } from "@/lib/auth";

// --- Inline SVGs ---
const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const ClockIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PhoneIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.436-4.136-7.032-7.032l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// --- Dummy Data ---
const courts = [
  { id: 1, name: "Lapangan Futsal 1", type: "Futsal", price: "Rp 150.000", image: ASSETS.COURT_FUTSAL_1 },
  { id: 2, name: "Lapangan Futsal 2", type: "Futsal", price: "Rp 150.000", image: ASSETS.COURT_FUTSAL_2 },
  { id: 3, name: "Lapangan Badminton 1", type: "Badminton", price: "Rp 50.000", image: ASSETS.COURT_BADMINTON_1 },
  { id: 4, name: "Lapangan Badminton 2", type: "Badminton", price: "Rp 50.000", image: ASSETS.COURT_BADMINTON_2 },
  { id: 5, name: "Lapangan Badminton 3", type: "Badminton", price: "Rp 50.000", image: ASSETS.COURT_BADMINTON_3 },
];

const features = [
  { title: "Booking Online 24 Jam", desc: "Pesan jadwal kapan saja tanpa harus telepon atau datang langsung.", icon: <ClockIcon className="w-8 h-8 text-blue-600" /> },
  { title: "Tanpa Bentrok Jadwal", desc: "Sistem cerdas kami memastikan tidak ada double booking.", icon: <ShieldIcon className="w-8 h-8 text-blue-600" /> },
  { title: "Pembayaran Mudah", desc: "Dukung pembayaran via QRIS, Virtual Account, dan Transfer Bank.", icon: <CheckCircleIcon className="w-8 h-8 text-blue-600" /> },
  { title: "Lokasi Strategis", desc: "Mudah dijangkau dengan fasilitas parkir luas dan aman.", icon: <LocationIcon className="w-8 h-8 text-blue-600" /> },
];

const testimonials = [
  { name: "Budi Santoso", role: "Kapten Tim Futsal", text: "Sejak ada web ini, cari jadwal kosong jadi gampang banget. Nggak perlu repot nunggu balasan WhatsApp lagi." },
  { name: "Andi Wijaya", role: "Pemain Badminton", text: "Fasilitas lapangan oke, dan bookingnya super cepat. Sangat recommended buat yang suka olahraga rutin." },
  { name: "Siti Rahma", role: "Koordinator Lomba", text: "Bantu banget buat block jadwal turnamen seharian. Pembayaran juga transparan." },
];

export default async function LandingPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900 scroll-smooth">
      {/* 1. Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">SM</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Sport Center</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Beranda</a>
              <a href="#lapangan" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Info Lapangan</a>
              <a href="#keunggulan" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Keunggulan</a>
              <a href="#kontak" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Kontak</a>
              {session && (
                <Link href="/riwayat" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  Riwayat Pesanan
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {!session ? (
                <>
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2">
                    Masuk
                  </Link>
                  <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition-colors shadow-sm">
                    Daftar
                  </Link>
                </>
              ) : (
                <div className="text-sm text-gray-600 font-medium px-4 py-2">
                  Halo, Akun Saya
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button className="text-gray-600 hover:text-gray-900">
                <MenuIcon className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="relative bg-white overflow-hidden">
        {/* Background Decorative SVG */}
        <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
          <svg className="absolute inset-0 h-full w-full object-cover text-gray-50" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,0 100,0 100,100 0,100" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-16 pb-24 lg:pt-32 lg:pb-40 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Booking Lapangan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Jadi Mudah</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              SM Sport Center menyediakan fasilitas lapangan Futsal dan Badminton premium. Cek jadwal real-time, pesan, dan bayar langsung dari HP Anda tanpa ribet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/booking" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 text-center">
                Booking Sekarang
              </Link>
              <a href="#lapangan" className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-full text-lg transition-all text-center">
                Lihat Fasilitas
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-16 lg:mt-0 z-10 flex justify-center">
            {/* Abstract Hero Graphic */}
            <svg className="w-full max-w-lg h-auto" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="50" width="300" height="200" rx="16" fill="#EFF6FF" />
              <rect x="70" y="70" width="260" height="160" rx="8" fill="#DBEAFE" />
              <circle cx="200" cy="150" r="40" fill="#3B82F6" opacity="0.8" />
              <path d="M150 150L250 150" stroke="#1D4ED8" strokeWidth="4" strokeDasharray="8 8" />
              <rect x="180" y="110" width="40" height="80" rx="4" fill="#60A5FA" />
            </svg>
          </div>
        </div>
      </header>

      {/* 3. Info Lapangan */}
      <section id="lapangan" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Fasilitas Kami</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Pilih dari 5 lapangan standar nasional yang rutin dirawat untuk kenyamanan permainan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courts.map((court) => (
              <div key={court.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={court.image} 
                    alt={court.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm border border-gray-200/50">
                    Masih Placeholder
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {court.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{court.name}</h3>
                  <div className="flex items-center text-gray-600 mb-6">
                    <span className="font-semibold text-blue-600 text-lg">{court.price}</span>
                    <span className="text-sm ml-1">/ jam</span>
                  </div>
                  <Link href="/booking" className="block w-full text-center bg-gray-50 hover:bg-blue-50 text-blue-600 border border-blue-100 hover:border-blue-200 font-semibold py-3 px-4 rounded-xl transition-colors">
                    Lihat Jadwal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Kenapa Pilih Kami (Keunggulan) */}
      <section id="keunggulan" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Kenapa Memilih Kami?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Kami selalu berusaha memberikan layanan terbaik agar pengalaman olahraga Anda lebih menyenangkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100/50">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Statistik */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/50">
            {/* TODO: Ambil angka-angka ini dari query database statistik admin */}
            <div className="px-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">5</div>
              <div className="text-blue-100 font-medium">Lapangan Premium</div>
            </div>
            <div className="px-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">1.2K+</div>
              <div className="text-blue-100 font-medium">Pelanggan Aktif</div>
            </div>
            <div className="px-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">8.5K+</div>
              <div className="text-blue-100 font-medium">Booking Selesai</div>
            </div>
            <div className="px-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">24/7</div>
              <div className="text-blue-100 font-medium">Online Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimoni */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Apa Kata Mereka?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Testimoni asli dari pelanggan setia SM Sport Center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                <svg className="absolute top-6 left-6 w-10 h-10 text-blue-100" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-600 italic relative z-10 mb-6 mt-4">"{testi.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testi.name}</h4>
                    <p className="text-sm text-gray-500">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
            
            <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white mb-6">
              Siap untuk bertanding?
            </h2>
            <p className="relative z-10 text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Jangan sampai kehabisan jadwal prime time. Pesan lapangan Anda sekarang dan dapatkan pengalaman olahraga terbaik.
            </p>
            <Link href="/booking" className="relative z-10 inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold px-10 py-4 rounded-full text-lg shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95">
              Booking Sekarang Juga
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer id="kontak" className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none">SM</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Sport Center</span>
              </div>
              <p className="text-gray-500 mb-6">
                Pusat kebugaran dan penyewaan lapangan Futsal serta Badminton berkualitas di kota Anda.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Menu Singkat</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Beranda</Link></li>
                <li><a href="#lapangan" className="text-gray-500 hover:text-blue-600 transition-colors">Info Lapangan</a></li>
                <li><Link href="/booking" className="text-gray-500 hover:text-blue-600 transition-colors">Pesan Jadwal</Link></li>
                <li><Link href="/login" className="text-gray-500 hover:text-blue-600 transition-colors">Masuk Akun</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Hubungi Kami</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <LocationIcon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-500">Jl. Olahraga No. 123, Komplek Stadion, Jakarta Pusat 10110</span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-gray-500">+62 812 3456 7890</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-gray-500">halo@smsport.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Jam Operasional</h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center text-gray-500">
                  <span>Senin - Jumat</span>
                  <span className="font-medium">08:00 - 23:00</span>
                </li>
                <li className="flex justify-between items-center text-gray-500">
                  <span>Sabtu - Minggu</span>
                  <span className="font-medium">06:00 - 24:00</span>
                </li>
                <li className="flex justify-between items-center text-gray-500">
                  <span>Hari Libur</span>
                  <span className="font-medium">Tetap Buka</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SM Sport Center. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="text-gray-400 text-sm hover:text-gray-600 cursor-pointer">Syarat & Ketentuan</span>
              <span className="text-gray-400 text-sm hover:text-gray-600 cursor-pointer">Kebijakan Privasi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
