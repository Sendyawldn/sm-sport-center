"use client";

import { useActionState, useEffect, useState } from "react";
import { login, register } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const initialState: any = { error: "", success: false, redirectUrl: "" };

export default function AuthModal({ 
  isOpen, 
  onClose, 
  defaultMode = "login" 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  defaultMode?: "login" | "register";
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  
  const [loginState, loginAction, isLoginPending] = useActionState(login, initialState);
  const [registerState, registerAction, isRegisterPending] = useActionState(register, initialState);

  // Handle successful login/register
  useEffect(() => {
    if (loginState?.success && isOpen) {
      onClose();
      if (loginState.redirectUrl) {
        router.push(loginState.redirectUrl);
      } else {
        router.refresh();
      }
    }
  }, [loginState, isOpen, onClose, router]);

  useEffect(() => {
    if (registerState?.success && isOpen) {
      onClose();
      router.refresh();
    }
  }, [registerState, isOpen, onClose, router]);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const isPending = isLoginPending || isRegisterPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-full p-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 flex items-center justify-center bg-red-50 rounded-2xl">
              <span className="font-extrabold text-3xl italic text-[#a6192e] tracking-tighter">SM</span>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {mode === "login" ? "Selamat Datang!" : "Buat Akun Baru"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            {mode === "login" 
              ? "Masuk untuk melanjutkan pemesanan jadwal." 
              : "Daftar sekarang untuk kemudahan reservasi."}
          </p>
        </div>

        {mode === "login" && loginState?.error && (
          <div className="bg-red-50 text-[#a6192e] p-4 rounded-xl text-sm mb-6 border border-red-100 font-bold text-center">
            {loginState.error}
          </div>
        )}

        {mode === "register" && registerState?.error && (
          <div className="bg-red-50 text-[#a6192e] p-4 rounded-xl text-sm mb-6 border border-red-100 font-bold text-center">
            {registerState.error}
          </div>
        )}

        <form action={mode === "login" ? loginAction : registerAction} className="space-y-5" autoComplete="off">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
              <input 
                name="name" 
                type="text" 
                required 
                className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a6192e]/30 focus:border-[#a6192e] transition-colors font-medium"
                placeholder="Masukkan nama Anda"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email atau No. Telepon</label>
            <input 
              name="contact" 
              type="text" 
              required 
              className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a6192e]/30 focus:border-[#a6192e] transition-colors font-medium"
              placeholder="contoh@email.com atau 0812..."
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a6192e]/30 focus:border-[#a6192e] transition-colors font-medium"
              placeholder="Masukkan password"
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#a6192e] hover:bg-[#8b1526] text-white font-extrabold py-4 px-4 rounded-xl transition-transform active:scale-95 shadow-md disabled:opacity-50 disabled:active:scale-100 mt-4 text-lg"
          >
            {isPending 
              ? (mode === "login" ? "Memproses..." : "Mendaftarkan...") 
              : (mode === "login" ? "Masuk" : "Daftar Akun")}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 font-medium">
            {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button 
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#a6192e] hover:underline font-extrabold"
            >
              {mode === "login" ? "Daftar di sini" : "Masuk di sini"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
