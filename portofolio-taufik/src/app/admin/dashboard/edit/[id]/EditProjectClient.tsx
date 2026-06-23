"use client";

import ProjectForm from "@/app/admin/dashboard/components/ProjectForm";
import { useRouter } from "next/navigation";

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

interface EditProjectClientProps {
  project: Project;
}

export default function EditProjectClient({ project }: EditProjectClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-700 hover:border-white bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition duration-300 font-medium cursor-pointer"
          >
            &larr; Kembali ke Dashboard
          </button>
        </div>
        <ProjectForm
          editingProject={project}
          onSuccess={() => router.push("/admin/dashboard")}
          onCancel={() => router.push("/admin/dashboard")}
        />
      </div>
    </div>
  );
}
