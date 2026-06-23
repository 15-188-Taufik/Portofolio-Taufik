export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import GalaxyWrapper from '@/components/GalaxyWrapper';
import ProjectList from '@/components/ProjectList';
import prisma from '@/lib/prisma';
import GlobalSmoothScroll from '@/components/GlobalSmoothScroll';

async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    return [];
  }
}

async function getSettings() {
  try {
    const settingsList = await prisma.setting.findMany();
    return settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    return {};
  }
}

export default async function Home() {
  const projects = await getProjects();
  const settings = await getSettings();
  const cvUrl = settings.cvUrl || "/documents/TaufikHidayatNstResume.pdf";
  const aboutText = settings.aboutText;
  const skillsArray = settings.skills
    ? settings.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
    : ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'Prisma'];

  return (
    <>
      <GlobalSmoothScroll />
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
            {settings.heroSubtitle || "Seorang mahasiswa Informatika ITERA yang gemar mengubah baris kode menjadi pengalaman web yang estetis dan fungsional."}
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
              {aboutText ? (
                <p className="text-gray-400 leading-relaxed mb-6 text-lg whitespace-pre-line font-light">
                  {aboutText}
                </p>
              ) : (
                <p className="text-gray-400 leading-relaxed mb-6 text-lg font-light">
                  Halo! Saya <strong className="text-white">Taufik Hidayat NST</strong>, mahasiswa semester 6 di Institut Teknologi Sumatera (ITERA).
                  Saya memiliki passion yang mendalam dalam menciptakan antarmuka web yang intuitif dan responsif.
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {skillsArray.map((skill) => (
                  <span key={skill} className="bg-[#151515] border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:border-[#CFB53B] transition cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-10">
                <a 
                  href={cvUrl} 
                  target={cvUrl.startsWith("http") ? "_blank" : undefined}
                  rel={cvUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-block bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition" 
                  download
                >
                  Download CV
                </a>
              </div>
            </div>
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

          <ProjectList projects={projects} />
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