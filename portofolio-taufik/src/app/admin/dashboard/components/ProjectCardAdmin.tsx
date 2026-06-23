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

interface ProjectCardAdminProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCardAdmin({ project, onEdit, onDelete }: ProjectCardAdminProps) {
  return (
    <div 
      className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 hover:border-[#CFB53B]/50 hover:bg-[#242424] transition duration-300 flex flex-col cursor-pointer select-none" 
      onClick={() => onEdit(project)}
    >
      {project.images && project.images.length > 0 && (
        <div className="w-full h-32 relative mb-3 rounded overflow-hidden">
          <Image src={project.images[0]} alt={project.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-[#CFB53B]">{project.title}</h4>
        {project.isTopProject && (
          <span className="bg-[#FFF44F] text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            Top
          </span>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 mt-auto pt-4 border-t border-gray-800">
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} 
          className="flex-1 py-2 px-4 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg text-sm font-medium transition duration-300 text-center cursor-pointer"
        >
          Hapus
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(project); }} 
          className="flex-1 py-2 px-4 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500 rounded-lg text-sm font-medium transition duration-300 text-center cursor-pointer"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
