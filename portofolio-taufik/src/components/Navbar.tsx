"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            {['Home', 'Projects', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link href={`#${item.toLowerCase()}`} className="hover:text-white transition relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#CFB53B] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
            <li>
                <Link href="/login" className="text-[#CFB53B] border border-[#CFB53B]/30 px-4 py-1.5 rounded-full hover:bg-[#CFB53B] hover:text-black transition">
                    Admin
                </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}