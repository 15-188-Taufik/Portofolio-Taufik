"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProjectListAdmin from "./components/ProjectListAdmin";
import SettingsManager from "./components/SettingsManager";

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

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/taiking/projects");
      setProjects(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal load data", error);
    }
  };

  const handleEdit = (project: Project) => {
    router.push(`/admin/dashboard/edit/${project.id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus proyek ini?")) {
      try {
        await axios.delete(`/api/taiking/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error("Gagal menghapus proyek", error);
        alert("Gagal menghapus proyek.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header Dashboard */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-[#CFB53B] font-heading">Dashboard Admin</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/dashboard/create")}
              className="bg-[#FFF44F] hover:bg-[#CFB53B] text-black px-4 py-2 rounded text-sm font-bold transition transform hover:scale-105"
            >
              + Tambah Proyek Baru
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-bold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* List Proyek Terstruktur Full Width */}
        <ProjectListAdmin
          projects={projects}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Kelola CV & About Me Settings */}
        <SettingsManager />
      </div>
    </div>
  );
}