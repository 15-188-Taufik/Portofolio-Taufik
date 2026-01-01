"use client";

import dynamic from 'next/dynamic';

// Pindahkan logika dynamic import ke sini (Client Component)
const GalaxyBackground = dynamic(() => import('./GalaxyBackground'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050505] z-0" />
});

export default function GalaxyWrapper() {
  return <GalaxyBackground />;
}