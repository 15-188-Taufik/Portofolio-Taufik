"use client";

import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  liveDemoUrl: string | null;
  githubUrl: string | null; // Baru
  features: string[];       // Baru
  techStack: string[];
  images: string[];
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    liveDemoUrl: "",
    githubUrl: "",        // Baru
    featuresString: "",   // Baru (Input teks area, dipisah enter)
    techStackString: "", 
    existingImages: [] as string[],
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/taiking/projects");
      setProjects(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal load data", error);
    }
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
    setForm(prev => ({ ...prev, existingImages: prev.existingImages.filter((_, i) => i !== index) }));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalImageUrls = [...form.existingImages];

      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((file) => formData.append('file', file));
        const uploadRes = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrls = [...finalImageUrls, ...uploadRes.data.urls];
      }

      const techStackArray = form.techStackString.split(',').map(item => item.trim()).filter(i => i !== "");
      // Pisahkan fitur berdasarkan Enter (\n)
      const featuresArray = form.featuresString.split('\n').map(item => item.trim()).filter(i => i !== "");

      const payload = {
        title: form.title,
        description: form.description,
        liveDemoUrl: form.liveDemoUrl,
        githubUrl: form.githubUrl, // Kirim ke API
        features: featuresArray,   // Kirim ke API
        techStack: techStackArray,
        images: finalImageUrls
      };

      if (isEditing) {
        await axios.put(`/api/taiking/projects/${currentId}`, payload);
        alert("Proyek berhasil diupdate!");
      } else {
        await axios.post("/api/taiking/projects", payload);
        alert("Proyek berhasil ditambah!");
      }
      resetForm();
      fetchProjects(); 
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", liveDemoUrl: "", githubUrl: "", featuresString: "", techStackString: "", existingImages: [] });
    setNewFiles([]);
    setPreviewUrls([]);
    setIsEditing(false);
    setCurrentId("");
  };

  const handleEdit = (project: Project) => {
    setIsEditing(true);
    setCurrentId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      liveDemoUrl: project.liveDemoUrl || "",
      githubUrl: project.githubUrl || "",
      featuresString: project.features ? project.features.join("\n") : "", 
      techStackString: project.techStack.join(", "),
      existingImages: project.images || []
    });
    setNewFiles([]);
    setPreviewUrls([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus?")) {
      await axios.delete(`/api/taiking/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
            <h1 className="text-3xl font-bold text-[#CFB53B] font-heading">Dashboard Admin</h1>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div className="lg:col-span-1">
                <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 sticky top-8">
                    <h3 className="text-xl font-bold text-[#FFF44F] mb-4 border-b border-gray-700 pb-2">
                    {isEditing ? "Edit Proyek" : "Tambah Proyek Baru"}
                    </h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input className="input-field" placeholder="Judul Proyek" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        
                        <textarea className="input-field h-24" placeholder="Deskripsi Singkat" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                        
                        {/* INPUT FITUR BARU */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">Fitur Utama (Satu per baris)</label>
                            <textarea 
                                className="input-field h-32" 
                                placeholder="Login System&#10;Dark Mode&#10;Payment Gateway" 
                                value={form.featuresString} 
                                onChange={(e) => setForm({ ...form, featuresString: e.target.value })} 
                            />
                        </div>

                        <input className="input-field" placeholder="Tech Stack (Pisah koma)" value={form.techStackString} onChange={(e) => setForm({ ...form, techStackString: e.target.value })} />
                        
                        <div className="flex gap-2">
                            <input className="input-field" placeholder="Live Demo URL" value={form.liveDemoUrl} onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })} />
                            <input className="input-field" placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
                        </div>

                        {/* UPLOAD GAMBAR */}
                        <div className="border border-dashed border-gray-600 p-4 rounded text-center cursor-pointer hover:border-[#FFF44F] transition relative">
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                            <p className="text-sm text-gray-400">Klik untuk upload gambar</p>
                        </div>

                        {/* PREVIEW */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.existingImages.map((src, i) => (
                             <div key={`old-${i}`} className="relative w-16 h-16 border border-blue-500 rounded overflow-hidden group">
                                <Image src={src} alt="old" fill className="object-cover" />
                                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center">x</button>
                             </div>
                          ))}
                          {previewUrls.map((src, i) => (
                             <div key={`new-${i}`} className="relative w-16 h-16 border border-green-500 rounded overflow-hidden group">
                                <Image src={src} alt="new" fill className="object-cover" />
                                <button type="button" onClick={() => removeNewFile(i)} className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center">x</button>
                             </div>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button type="submit" disabled={uploading} className="flex-1 bg-[#FFF44F] hover:bg-[#CFB53B] text-black font-bold py-2 rounded transition disabled:opacity-50">
                                {uploading ? "Mengupload..." : (isEditing ? "Update" : "Simpan")}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300">Batal</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* LIST */}
            <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">Daftar Proyek ({projects.length})</h3>
                {loading ? <p>Memuat...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((p) => (
                        <div key={p.id} className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 hover:border-[#CFB53B]/50 transition flex flex-col">
                            {p.images && p.images.length > 0 && (
                              <div className="w-full h-32 relative mb-3 rounded overflow-hidden">
                                <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                              </div>
                            )}
                            <h4 className="font-bold text-[#CFB53B] mb-1">{p.title}</h4>
                            <div className="flex justify-between mt-auto pt-2 border-t border-gray-700">
                                <button onClick={() => handleEdit(p)} className="text-blue-400 text-xs hover:underline">Edit</button>
                                <button onClick={() => handleDelete(p.id)} className="text-red-400 text-xs hover:underline">Hapus</button>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
      <style jsx>{`
        .input-field { width: 100%; padding: 0.5rem; background-color: rgba(0,0,0,0.4); border: 1px solid #374151; border-radius: 0.375rem; font-size: 0.875rem; color: white; outline: none; }
        .input-field:focus { border-color: #FFF44F; }
      `}</style>
    </div>
  );
}