import ProjectCardAdmin from "./ProjectCardAdmin";

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

interface ProjectListAdminProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectListAdmin({ projects, loading, onEdit, onDelete }: ProjectListAdminProps) {
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-white mb-4">Daftar Proyek ({projects.length})</h3>
      {loading ? (
        <p className="text-gray-400">Memuat...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCardAdmin
              key={project.id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
