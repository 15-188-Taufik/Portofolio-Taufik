import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Ini bagian PENTING: Memberi tahu Tailwind untuk scan folder src
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-gold': '#CFB53B',
        'accent-yellow': '#FFF44F',
        'card-bg': '#1E1E1E',
      },
      fontFamily: {
        // Menggunakan variabel font yang kita set di layout.tsx
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;