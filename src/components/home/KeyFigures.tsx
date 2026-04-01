"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Calendar, Users, Truck, Warehouse, TrendingUp, Wrench } from "lucide-react";
import { KEY_FIGURES } from "@/lib/constants";

const iconComponents = {
  calendar: Calendar,
  users: Users,
  truck: Truck,
  crane: Wrench,
  warehouse: Warehouse,
  chart: TrendingUp,
};

function Counter({ target, suffix = "", prefix = "", duration = 2000 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("vi-VN")}{suffix}
    </span>
  );
}

export default function KeyFigures() {
  return (
    <section className="section-padding" style={{ background: "linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%)" }}>
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="font-heading font-black text-white text-3xl md:text-4xl mb-3">
            CON SỐ BIẾT NÓI
          </h2>
          <div className="w-16 h-1 rounded-sm bg-orange-400 mx-auto mb-4" />
          <p className="text-blue-100 text-lg">30 năm tích lũy — Những con số khẳng định uy tín</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {KEY_FIGURES.map((fig, i) => {
            const Icon = iconComponents[fig.icon as keyof typeof iconComponents] || TrendingUp;
            return (
              <div
                key={i}
                className="text-center p-6 rounded-sm border border-white/10 hover:border-orange-400/50 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-sm bg-orange-500/20 group-hover:bg-orange-500/30 flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon size={26} className="text-orange-400" />
                </div>
                <div className="font-heading font-black text-white text-3xl md:text-4xl mb-2">
                  <Counter
                    target={fig.value}
                    suffix={fig.suffix === "~" ? "" : fig.suffix}
                    prefix={fig.suffix === "~" ? "~" : ""}
                  />
                </div>
                <p className="text-blue-200/80 text-sm font-body">{fig.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
