import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ProjectSlider from '@/components/ProjectSlider';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    return project;
  } catch (error) {
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage(props: PageProps) {
  const params = await props.params;
  const project = await getProject(params.id);

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#121212] text-white pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        {/* --- TOMBOL KEMBALI YANG BARU (GAYA APPLE/GLASS) --- */}
        <Link 
          href="/#projects" 
          className="group inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-[#FFF44F]/10 hover:border-[#FFF44F]/50 transition-all duration-300 mb-10"
        >
            {/* Ikon Panah dalam Lingkaran */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FFF44F] transition-colors duration-300">
                <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </div>
            {/* Teks */}
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Kembali ke Home</span>
        </Link>
        {/* --------------------------------------------------- */}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#CFB53B]">
                {project.title}
            </h1>
            <div className="flex gap-3">
                {/* Tombol GitHub */}
                {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#24292e] hover:bg-black text-white px-5 py-2 rounded-full border border-gray-700 transition font-bold text-sm transform hover:scale-105">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        Repository
                    </a>
                )}
                {/* Tombol Live Demo */}
                {project.liveDemoUrl && (
                    <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#FFF44F] hover:bg-[#CFB53B] text-black px-5 py-2 rounded-full font-bold transition text-sm transform hover:scale-105 shadow-[0_0_15px_rgba(255,244,79,0.3)]">
                        Live Demo 🚀
                    </a>
                )}
            </div>
        </div>

        <div className="mb-12">
          <ProjectSlider images={project.images} title={project.title} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="md:col-span-2 space-y-8">
            {/* Deskripsi */}
            <section>
                <h2 className="text-2xl font-bold text-[#FFF44F] mb-4 border-b border-gray-800 pb-2">Tentang Proyek</h2>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg text-justify font-light">
                {project.description}
                </div>
            </section>

            {/* FITUR UTAMA */}
            {project.features && project.features.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-[#FFF44F] mb-4 border-b border-gray-800 pb-2">Fitur Utama</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {project.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 bg-[#1E1E1E] p-4 rounded-xl border border-gray-800/50 hover:border-[#FFF44F]/30 transition">
                                <span className="text-[#FFF44F] mt-0.5 font-bold">✓</span>
                                <span className="text-gray-300 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
          </div>

          <div className="md:col-span-1 space-y-8">
            <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-gray-800 sticky top-24 shadow-xl">
              <h3 className="text-xl font-bold text-[#CFB53B] mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span key={index} className="bg-white/5 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-[#FFF44F] hover:text-[#FFF44F] transition cursor-default">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700 text-gray-500 text-xs text-center">
                <p>Terakhir diupdate</p>
                <p className="text-gray-400 font-medium">{new Date(project.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}