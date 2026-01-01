"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!captchaToken) {
      setError("Mohon centang 'I'm not a robot' terlebih dahulu.");
      setLoading(false);
      return;
    }

    // Login menggunakan NextAuth
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Login Gagal! Username atau Password salah.");
      setLoading(false);
    } else {
      // Jika berhasil, arahkan ke dashboard
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden">
      {/* Background Blobs (Hiasan) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[100px]"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#CFB53B] mb-2 text-center font-heading">Admin Access</h2>
        <p className="text-gray-400 text-center mb-8">Silakan masuk untuk mengelola konten.</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-black/50 border border-gray-700 rounded text-white focus:border-[#FFF44F] focus:outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-black/50 border border-gray-700 rounded text-white focus:border-[#FFF44F] focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-center my-2 transform scale-90 origin-center">
             {/* Site Key Kamu */}
             <ReCAPTCHA
                sitekey="6Ld1BzwsAAAAAFl1KxD9dUUtzRznQeuK6Jph7fel" 
                onChange={setCaptchaToken}
                theme="dark"
              />
          </div>

          <button
            type="submit"
            disabled={loading}
            // BAGIAN INI TADI TERPOTONG, SEKARANG SUDAH DIPERBAIKI:
            className={`w-full bg-[#FFF44F] text-black font-bold py-3 rounded transition transform hover:-translate-y-1 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#CFB53B]'}`}
          >
            {loading ? "Memproses..." : "Masuk Dashboard"}
          </button>
        </form>

        <div className="mt-6 text-center">
            <button onClick={() => router.push('/')} className="text-gray-500 text-sm hover:text-white">
                &larr; Kembali ke Home
            </button>
        </div>
      </div>
    </div>
  );
}