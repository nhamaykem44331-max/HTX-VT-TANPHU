"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

// Default fallback inside component is not needed since the data-service provides it

export default function HeroBanner({ slides = [] }: { slides?: any[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % Math.max(slides.length, 1)), [slides.length]);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % Math.max(slides.length, 1));

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 60px)", minHeight: "520px" }}>
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          {/* Background */}
          {slide.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          ) : (
            <ImagePlaceholder
              label={slide.subtitle}
              className="w-full h-full rounded-none"
              aspectRatio="wide"
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-wide">
              <div className="max-w-2xl">
                <p className="text-orange-300 font-body font-semibold text-sm tracking-widest uppercase mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                  HTX Vận tải Ô tô Tân Phú
                </p>
                <h1
                  className="font-heading font-black text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 whitespace-pre-line opacity-0 animate-slide-up"
                  style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                >
                  {slide.title}
                </h1>
                <p
                  className="text-white/80 text-base md:text-lg leading-relaxed mb-8 opacity-0 animate-slide-up"
                  style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
                >
                  {slide.description}
                </p>
                <div
                  className="flex flex-wrap gap-4 opacity-0 animate-slide-up"
                  style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
                >
                  {slide.cta_text && (
                    <Link href={slide.cta_link || '/'} className="btn-primary">
                      {slide.cta_text}
                    </Link>
                  )}
                  <Link href="/lien-he" className="btn-outline">
                    Liên hệ ngay
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Slide tiếp"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-sm transition-all duration-300 ${
              i === current ? "w-8 h-2 bg-orange-400" : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
