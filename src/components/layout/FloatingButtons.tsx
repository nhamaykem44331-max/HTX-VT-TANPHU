"use client";
import { useState, useEffect } from "react";
import { Phone, ArrowUp } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3 items-center">
      {/* Zalo */}
      <a
        href={COMPANY_INFO.zalo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        title="Chat Zalo"
        className="w-12 h-12 rounded-sm shadow-lg flex items-center justify-center text-white font-black text-base transition-transform hover:scale-110 animate-bounce"
        style={{ backgroundColor: "#0068FF", animationDuration: "2s" }}
      >
        Z
      </a>

      {/* Hotline */}
      <a
        href={`tel:${COMPANY_INFO.hotlineTel}`}
        aria-label="Gọi hotline"
        title={COMPANY_INFO.hotline}
        className="w-12 h-12 rounded-sm shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
        style={{ backgroundColor: "var(--orange)" }}
      >
        <Phone size={20} />
      </a>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
        className={cn(
          "w-10 h-10 rounded-sm shadow-md flex items-center justify-center text-white transition-all duration-300",
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ backgroundColor: "var(--navy)" }}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
