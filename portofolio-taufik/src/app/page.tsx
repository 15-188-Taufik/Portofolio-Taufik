export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import GalaxyWrapper from '@/components/GalaxyWrapper'; 

const prisma = new PrismaClient();

async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />

      {/* =========== Hero Section =========== */}
      <section id="home" className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#050505]">
        
        <GalaxyWrapper />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-0 pointer-events-none"></div>

        <div className="relative z-10 px-6 max-w-4xl animate-fade-in-up">
          <p className="text-[#CFB53B] font-medium tracking-[0.2em] mb-4 uppercase text-sm md:text-base">
            Hello, World! I am
          </p>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 leading-tight">
            TAUFIK <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CFB53B] to-[#FFF44F]">HIDAYAT</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Seorang mahasiswa Informatika ITERA yang gemar mengubah baris kode menjadi pengalaman web yang estetis dan fungsional.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="#projects" className="bg-[#CFB53B] text-black font-bold px-8 py-3 rounded-full hover:bg-white transition transform hover:scale-105 shadow-[0_0_20px_rgba(207,181,59,0.4)]">
              Lihat Karyaku
            </Link>
            <Link href="#contact" className="border border-gray-600 text-white font-bold px-8 py-3 rounded-full hover:border-white hover:bg-white/10 transition">
              Kontak
            </Link>
          </div>
        </div>
      </section>

      {/* =========== Projects Section =========== */}
      <section id="projects" className="py-24 bg-[#050505] relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Selected Projects</h2>
            <div className="h-1 w-20 bg-[#CFB53B] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length === 0 && <p className="text-center col-span-full text-gray-500">Belum ada proyek.</p>}

            {projects.map((project) => (
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
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#CFB53B] transition cursor-pointer">{project.title}</h3>
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
                  {/* ----------------------------- */}

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== About Section =========== */}
      <section id="about" className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
                    <div className="absolute inset-0 bg-[#CFB53B] rounded-full blur-[50px] opacity-20 animate-pulse"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#CFB53B]/50 p-2">
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                            <Image src="/images/saya.jpg" alt="Taufik Hidayat NST" fill className="object-cover" />
                        </div>
                    </div>
                </div>

                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">About <span className="text-[#CFB53B]">Me</span></h2>
                    <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                        Halo! Saya <strong className="text-white">Taufik Hidayat NST</strong>, mahasiswa semester 6 di Institut Teknologi Sumatera (ITERA). 
                        Saya memiliki passion yang mendalam dalam menciptakan antarmuka web yang intuitif dan responsif.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'Prisma'].map((skill) => (
                            <span key={skill} className="bg-[#151515] border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:border-[#CFB53B] transition cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>
                     <div className="mt-10">
                        <a href="/documents/CV-Taufik-Hidayat-NST.pdf" className="inline-block bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition" download>
                            Download CV
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* =========== Footer =========== */}
      <footer id="contact" className="py-12 border-t border-white/10 bg-[#050505] text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Let's Work Together</h2>
        <div className="flex justify-center gap-8 mb-8">
            <a href="https://github.com/15-188-Taufik" target="_blank" className="text-gray-400 hover:text-white hover:scale-110 transition text-2xl">GitHub</a>
            <a href="https://www.instagram.com/thnst95" target="_blank" className="text-gray-400 hover:text-[#d62976] hover:scale-110 transition text-2xl">Instagram</a>
            <a href="mailto:taufik.hidayatnst02@gmail.com" className="text-gray-400 hover:text-[#CFB53B] hover:scale-110 transition text-2xl">Email</a>
        </div>
        <p className="text-gray-600 text-sm">&copy; 2025 Taufik Hidayat NST. All rights reserved.</p>
      </footer>
    </>
  );
}