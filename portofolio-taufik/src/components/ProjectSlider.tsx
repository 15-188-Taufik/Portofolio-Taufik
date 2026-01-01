"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProjectSlider({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Jika tidak ada gambar, tampilkan placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
        Tidak ada gambar tersedia
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-xl shadow-2xl border border-gray-800 group">
      {/* Container Gambar (Geser menggunakan Transform) */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <Image 
              src={src} 
              alt={`${title} - screenshot ${index + 1}`} 
              fill 
              className="object-cover"
              priority={index === 0} // Gambar pertama diload duluan
            />
          </div>
        ))}
      </div>

      {/* Tombol Navigasi (Hanya muncul jika gambar > 1) */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFF44F] hover:text-black transition backdrop-blur-sm"
          >
            &#10094;
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFF44F] hover:text-black transition backdrop-blur-sm"
          >
            &#10095;
          </button>

          {/* Indikator Titik di Bawah */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-[#FFF44F] scale-110' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}