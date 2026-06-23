"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    // Jika berada di home page, intersep dan scroll secara smooth
    if (pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80; // Offset penyesuaian tinggi navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // Update URL hash di history browser tanpa men-trigger default jump
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center max-w-6xl">
        {/* Logo */}
        <Link href="/" className="text-xl font-heading font-black tracking-widest text-white hover:text-[#CFB53B] transition">
          TAUFIK<span className="text-[#CFB53B]">.</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex gap-8 text-sm font-medium tracking-wide text-gray-300">
            {['Home', 'About', 'Projects', 'Contact'].map((item) => (
              <li key={item}>
                <a 
                  href={`/#${item.toLowerCase()}`}
                  onClick={(e) => handleScrollToSection(e, item.toLowerCase())}
                  className="hover:text-white transition relative group cursor-pointer"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#CFB53B] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}