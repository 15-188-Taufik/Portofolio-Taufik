"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalSmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Hanya aktif di homepage
    if (pathname !== "/") return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Mendeteksi link jangkar seperti #projects atau /#projects
      if (href.startsWith("#") || href.startsWith("/#")) {
        const hash = href.includes("#") ? href.split("#")[1] : "";
        if (!hash) return;

        const element = document.getElementById(hash);
        if (element) {
          e.preventDefault();
          const offset = 80; // Offset penyesuaian tinggi navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Perbarui hash URL secara tenang tanpa default jump browser
          window.history.pushState(null, "", `#${hash}`);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [pathname]);

  return null;
}
