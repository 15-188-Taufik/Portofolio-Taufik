import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  liveDemoUrl: string | null;
  githubUrl: string | null;
  features: string[];
  isTopProject: boolean;
  techStack: string[];
  images: string[];
}

interface ProjectFormProps {
  editingProject: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ editingProject, onSuccess, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    liveDemoUrl: "",
    githubUrl: "",
    featuresString: "",
    isTopProject: false,
    techStackString: "",
    existingImages: [] as string[],
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setForm({
        title: editingProject.title,
        description: editingProject.description,
        liveDemoUrl: editingProject.liveDemoUrl || "",
        githubUrl: editingProject.githubUrl || "",
        featuresString: editingProject.features ? editingProject.features.join("\n") : "",
        isTopProject: editingProject.isTopProject || false,
        techStackString: editingProject.techStack.join(", "),
        existingImages: editingProject.images || [],
      });
      setNewFiles([]);
      setPreviewUrls([]);
    } else {
      resetFormState();
    }
  }, [editingProject]);

  const resetFormState = () => {
    setForm({
      title: "",
      description: "",
      liveDemoUrl: "",
      githubUrl: "",
      featuresString: "",
      isTopProject: false,
      techStackString: "",
      existingImages: [],
    });
    setNewFiles([]);
    setPreviewUrls([]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalImageUrls = [...form.existingImages];

      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((file) => formData.append("file", file));
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalImageUrls = [...finalImageUrls, ...uploadRes.data.urls];
      }

      const techStackArray = form.techStackString
        .split(",")
        .map((item) => item.trim())
        .filter((i) => i !== "");
      
      const featuresArray = form.featuresString
        .split("\n")
        .map((item) => item.trim())
        .filter((i) => i !== "");

      const payload = {
        title: form.title,
        description: form.description,
        liveDemoUrl: form.liveDemoUrl || null,
        githubUrl: form.githubUrl || null,
        features: featuresArray,
        isTopProject: form.isTopProject,
        techStack: techStackArray,
        images: finalImageUrls,
      };

      if (editingProject) {
        await axios.put(`/api/taiking/projects/${editingProject.id}`, payload);
        alert("Proyek berhasil diupdate!");
      } else {
        await axios.post("/api/taiking/projects", payload);
        alert("Proyek berhasil ditambah!");
      }

      resetFormState();
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 sticky top-8">
      <h3 className="text-xl font-bold text-[#FFF44F] mb-4 border-b border-gray-700 pb-2">
        {editingProject ? "Edit Proyek" : "Tambah Proyek Baru"}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Judul Proyek</label>
          <input
            className="w-full p-2 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition"
            placeholder="Judul Proyek"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Deskripsi Singkat</label>
          <textarea
            className="w-full p-2 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition h-24"
            placeholder="Deskripsi Singkat"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Fitur Utama (Satu per baris)</label>
          <textarea
            className="w-full p-2 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition h-32"
            placeholder="Login System&#10;Dark Mode&#10;Payment Gateway"
            value={form.featuresString}
            onChange={(e) => setForm({ ...form, featuresString: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Tech Stack (Pisahkan dengan koma)</label>
          <input
            className="w-full p-2 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition"
            placeholder="Next.js, Tailwind, Prisma"
            value={form.techStackString}
            onChange={(e) => setForm({ ...form, techStackString: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">Live Demo URL</label>
            <input
              className="w-full p-2 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition"
              placeholder="https://example.com"
              value={form.liveDemoUrl}
              onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">GitHub URL</label>
            <input
              className="w-full p-2 bg-black/40 border border-gray-700 rounded text-sm text-white focus:border-[#FFF44F] focus:outline-none transition"
              placeholder="https://github.com/user/repo"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="isTopProject"
            checked={form.isTopProject}
            onChange={(e) => setForm({ ...form, isTopProject: e.target.checked })}
            className="w-4 h-4 text-[#FFF44F] bg-gray-800 border-gray-600 rounded focus:ring-[#FFF44F] focus:ring-2 cursor-pointer"
          />
          <label htmlFor="isTopProject" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
            Jadikan sebagai Top Project (Halaman utama)
          </label>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Gambar Proyek</label>
          <div className="border border-dashed border-gray-600 p-4 rounded text-center cursor-pointer hover:border-[#FFF44F] transition relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-sm text-gray-400">Klik untuk upload gambar</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {form.existingImages.map((src, i) => (
            <div key={`old-${i}`} className="relative w-16 h-16 border border-blue-500 rounded overflow-hidden group">
              <Image src={src} alt="old" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(i)}
                className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold"
              >
                x
              </button>
            </div>
          ))}
          {previewUrls.map((src, i) => (
            <div key={`new-${i}`} className="relative w-16 h-16 border border-green-500 rounded overflow-hidden group">
              <Image src={src} alt="new" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold"
              >
                x
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 bg-[#FFF44F] hover:bg-[#CFB53B] text-black font-bold py-2 rounded transition disabled:opacity-50"
          >
            {uploading ? "Mengupload..." : editingProject ? "Update" : "Simpan"}
          </button>
          {(editingProject || form.title || form.description) && (
            <button
              type="button"
              onClick={() => {
                resetFormState();
                onCancel();
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
