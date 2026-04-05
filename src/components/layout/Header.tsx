"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { NAV_ITEMS, COMPANY_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          scrolled ? "bg-white py-2 shadow-lg" : "bg-navy py-3"
        )}
      >
        <div className="container-wide flex items-center justify-between">
          <Link href="/" className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Logo HTX Tân Phú"
              className="h-12 w-auto flex-shrink-0 object-contain"
            />

            <div className="min-w-0">
              <div
                className={cn(
                  "font-heading text-[10px] font-bold leading-tight transition-colors sm:text-sm",
                  scrolled ? "text-teal" : "text-teal-light"
                )}
              >
                HTX VẬN TẢI Ô TÔ
              </div>
              <div
                className={cn(
                  "font-heading text-sm font-black leading-tight transition-colors sm:text-base",
                  scrolled ? "text-navy" : "text-white"
                )}
              >
                TÂN PHÚ
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-semibold transition-all duration-200",
                    pathname.startsWith(item.href) && item.href !== "/"
                      ? scrolled
                        ? "text-orange-500"
                        : "text-orange-300"
                      : scrolled
                        ? "text-gray-700 hover:text-orange-500"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.label}
                  {item.children ? <ChevronDown size={14} /> : null}
                </Link>

                {item.children ? (
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[220px] rounded-sm border border-gray-100 bg-white py-2 shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.hotlineTel}`}
              className={cn(
                "hidden items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors md:flex",
                scrolled
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Phone size={14} />
              {COMPANY_INFO.hotline}
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              className={cn(
                "rounded-sm p-2 transition-colors lg:hidden",
                scrolled ? "text-navy hover:bg-gray-100" : "text-white hover:bg-white/10"
              )}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-navy px-6 py-4">
              <span className="font-heading font-bold text-white">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/70 hover:text-white"
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="py-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.href}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={cn(
                        "block flex-1 px-6 py-3 text-sm font-semibold transition-colors",
                        pathname.startsWith(item.href) && item.href !== "/"
                          ? "text-orange-500"
                          : "text-gray-800 hover:text-orange-500"
                      )}
                    >
                      {item.label}
                    </Link>

                    {item.children ? (
                      <button
                        className="px-4 py-3 text-gray-400"
                        onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                        aria-label="Mở submenu"
                      >
                        <ChevronDown
                          size={16}
                          className={cn("transition-transform", openDropdown === item.href && "rotate-180")}
                        />
                      </button>
                    ) : null}
                  </div>

                  {item.children && openDropdown === item.href ? (
                    <div className="border-y border-gray-100 bg-gray-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-10 py-2.5 text-sm text-gray-600 transition-colors hover:text-orange-500"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            <div className="border-t border-gray-100 px-6 py-4">
              <a href={`tel:${COMPANY_INFO.hotlineTel}`} className="btn-primary w-full justify-center">
                <Phone size={16} />
                {COMPANY_INFO.hotline}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
