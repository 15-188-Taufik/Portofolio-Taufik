import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

// Setup Font Google
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700", "900"],
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Taufik Hidayat NST | Portfolio",
  description: "Mahasiswa Informatika ITERA - Front End Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${montserrat.variable} ${inter.variable} font-body bg-[#0a0a0a] text-gray-200 antialiased selection:bg-[#CFB53B] selection:text-black`}>
        {children}
      </body>
    </html>
  );
}