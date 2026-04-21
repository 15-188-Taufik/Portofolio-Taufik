"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  images: string[];
  createdAt: Date;
  isTopProject: boolean;
};

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [showAll, setShowAll] = useState(false);

  // Ambil top projects yang ditandai admin
  const topProjects = projects.filter((p) => p.isTopProject);
  
  // Ambil maksimal 3 project untuk tampilan default
  // Jika ada top project, ambil top project saja (maksimal 3)
  // Jika tidak ada, ambil 3 project terbaru sebagai fallback
  const defaultProjects = topProjects.length > 0 
    ? topProjects.slice(0, 3) 
    : projects.slice(0, 3);

  const displayedProjects = showAll ? projects : defaultProjects;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedProjects.length === 0 && (
          <p className="text-center col-span-full text-gray-500">Belum ada proyek.</p>
        )}

        {displayedProjects.map((project) => (
          <div key={project.id} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-white/5">
            {/* Area Gambar */}
            <Link href={`/projects/${project.id}`} className="relative w-full aspect-video overflow-hidden bg-gray-900 block cursor-pointer">
               <Image 
                 src={project.images[0] || '/images/placeholder.jpg'} 
                 alt={project.title}
                 fill
                 className="object-cover group-hover:scale-110 transition duration-700"
               />
               {/* Overlay Gelap Halus */}
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
            </Link>
            
            {/* Area Konten */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack.slice(0, 3).map((tech, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-[#CFB53B] bg-[#CFB53B]/10 px-2 py-1 rounded">
                      {tech}
                  </span>
                  ))}
              </div>
              
              <Link href={`/projects/${project.id}`}>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#CFB53B] transition cursor-pointer">
                    {project.title}
                  </h3>
              </Link>
              
              <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4">
                  {project.description}
              </p>

              {/* --- TOMBOL CARD YANG BARU --- */}
              <div className="mt-auto pt-5 border-t border-white/5 flex justify-between items-center">
                 {/* Tanggal/Tahun di Kiri */}
                 <span className="text-[10px] font-mono text-gray-600">
                    {new Date(project.createdAt).getFullYear()}
                 </span>

                 {/* Tombol Keren di Kanan */}
                 <Link href={`/projects/${project.id}`} className="group/btn flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-bold text-gray-400 group-hover/btn:text-white transition-colors">Explore</span>
                    
                    {/* Lingkaran Panah */}
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:bg-[#FFF44F] group-hover/btn:border-[#FFF44F] transition-all duration-300">
                        <svg className="w-3 h-3 text-gray-400 group-hover/btn:text-black -rotate-45 group-hover/btn:rotate-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                 </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {projects.length > defaultProjects.length && (
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => setShowAll(!showAll)} 
            className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all duration-200 bg-transparent border border-white/20 rounded-full hover:bg-white/5 hover:border-[#CFB53B] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {showAll ? 'Show Less Projects' : 'Show More Projects'}
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
