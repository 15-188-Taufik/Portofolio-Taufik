import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export default function SettingsManager() {
  const [cvUrl, setCvUrl] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [skills, setSkills] = useState("");
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      setCvUrl(res.data.cvUrl || "");
      setAboutText(res.data.aboutText || "");
      setHeroSubtitle(res.data.heroSubtitle || "");
      setSkills(res.data.skills || "");
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data settings", error);
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleCvUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;

    setUploadingCv(true);
    try {
      const formData = new FormData();
      formData.append("file", cvFile);

      const uploadRes = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedUrl = uploadRes.data.urls[0];

      await axios.post("/api/settings", {
        key: "cvUrl",
        value: uploadedUrl,
      });

      setCvUrl(uploadedUrl);
      setCvFile(null);
      alert("CV berhasil diperbarui!");
    } catch (error: any) {
      console.error("Gagal upload CV", error);
      const errMsg = error.response?.data?.error || error.message || "Terjadi kesalahan tidak dikenal";
      alert(`Gagal mengunggah CV baru: ${errMsg}`);
    } finally {
      setUploadingCv(false);
    }
  };

  const handleAboutSave = async (e: FormEvent) => {
    e.preventDefault();
    setSavingAbout(true);

    try {
      await axios.post("/api/settings", {
        key: "aboutText",
        value: aboutText,
      });
      alert("Deskripsi About Me berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan About Me", error);
      alert("Gagal menyimpan deskripsi About Me.");
    } finally {
      setSavingAbout(false);
    }
  };

  const handleHeroSave = async (e: FormEvent) => {
    e.preventDefault();
    setSavingHero(true);

    try {
      await axios.post("/api/settings", {
        key: "heroSubtitle",
        value: heroSubtitle,
      });
      alert("Subjudul Hero berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan Subjudul Hero", error);
      alert("Gagal menyimpan Subjudul Hero.");
    } finally {
      setSavingHero(false);
    }
  };

  const handleSkillsSave = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSkills(true);

    try {
      await axios.post("/api/settings", {
        key: "skills",
        value: skills,
      });
      alert("Daftar keahlian berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan Skills", error);
      alert("Gagal menyimpan daftar keahlian.");
    } finally {
      setSavingSkills(false);
    }
  };

  if (loading) {
    return <p className="text-gray-400">Memuat pengaturan...</p>;
  }

  return (
    <div className="mt-16 border-t border-gray-800 pt-10">
      <h2 className="text-2xl font-bold text-[#CFB53B] mb-8 font-heading">
        Pengaturan Web (CV, Hero, About & Skills)
      </h2>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#FFF44F] mb-4 border-b border-gray-700 pb-2">
                Kelola CV (PDF)
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Unggah file resume/CV Anda dalam format PDF. File ini akan menggantikan CV lama Anda di link unduh halaman depan secara otomatis.
              </p>

              <div className="mb-4">
                <span className="text-xs text-gray-400 block mb-1">CV Aktif Saat Ini:</span>
                {cvUrl ? (
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline break-all block"
                  >
                    {cvUrl}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500 italic">Menggunakan default local PDF</span>
                )}
              </div>
            </div>

            <form onSubmit={handleCvUpload} className="flex flex-col gap-3 mt-4">
              <div className="relative border border-dashed border-gray-600 hover:border-[#FFF44F] p-4 rounded text-center cursor-pointer transition">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-xs text-gray-400">
                  {cvFile ? `File terpilih: ${cvFile.name}` : "Pilih file PDF CV baru"}
                </p>
              </div>
              
              <button
                type="submit"
                disabled={uploadingCv || !cvFile}
                className="w-full bg-[#FFF44F] hover:bg-[#CFB53B] text-black font-bold py-2 rounded text-sm transition disabled:opacity-50 cursor-pointer font-semibold"
              >
                {uploadingCv ? "Mengunggah..." : "Unggah CV Baru"}
              </button>
            </form>
          </div>

          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 flex flex-col">
            <h3 className="text-lg font-bold text-[#FFF44F] mb-4 border-b border-gray-700 pb-2">
              Kelola Teks About Me
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Perbarui deskripsi biografi singkat Anda yang muncul di section "About Me" pada halaman utama.
            </p>

            <form onSubmit={handleAboutSave} className="flex flex-col gap-4 flex-grow justify-between">
              <textarea
                className="w-full p-3 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition h-36 resize-none leading-relaxed"
                placeholder="Tulis biografi singkat Anda di sini..."
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                required
              />
              
              <button
                type="submit"
                disabled={savingAbout}
                className="w-full bg-[#FFF44F] hover:bg-[#CFB53B] text-black font-bold py-2 rounded text-sm transition disabled:opacity-50 cursor-pointer mt-4 font-semibold"
              >
                {savingAbout ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 flex flex-col">
            <h3 className="text-lg font-bold text-[#FFF44F] mb-4 border-b border-gray-700 pb-2">
              Kelola Subjudul Hero
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Ubah deskripsi subjudul perkenalan singkat yang berada tepat di bawah nama besar Anda di bagian atas halaman (Hero Section).
            </p>

            <form onSubmit={handleHeroSave} className="flex flex-col gap-4 flex-grow justify-between">
              <textarea
                className="w-full p-3 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition h-36 resize-none leading-relaxed"
                placeholder="Seorang mahasiswa Informatika ITERA yang gemar mengubah..."
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                required
              />
              
              <button
                type="submit"
                disabled={savingHero}
                className="w-full bg-[#FFF44F] hover:bg-[#CFB53B] text-black font-bold py-2 rounded text-sm transition disabled:opacity-50 cursor-pointer mt-4 font-semibold"
              >
                {savingHero ? "Menyimpan..." : "Simpan Subjudul"}
              </button>
            </form>
          </div>

          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 flex flex-col">
            <h3 className="text-lg font-bold text-[#FFF44F] mb-4 border-b border-gray-700 pb-2">
              Kelola Keahlian (Skills)
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Tuliskan teknologi/keahlian yang Anda kuasai. Pisahkan masing-masing keahlian menggunakan tanda koma (contoh: Next.js, React, Tailwind).
            </p>

            <form onSubmit={handleSkillsSave} className="flex flex-col gap-4 flex-grow justify-between">
              <textarea
                className="w-full p-3 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition h-36 resize-none leading-relaxed"
                placeholder="Next.js, React, TypeScript, Tailwind, Node.js, Prisma"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
              
              <button
                type="submit"
                disabled={savingSkills}
                className="w-full bg-[#FFF44F] hover:bg-[#CFB53B] text-black font-bold py-2 rounded text-sm transition disabled:opacity-50 cursor-pointer mt-4 font-semibold"
              >
                {savingSkills ? "Menyimpan..." : "Simpan Keahlian"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
