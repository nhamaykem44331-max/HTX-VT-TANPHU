"use client";
import { useState, useEffect } from "react";
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white shadow-lg py-2"
            : "bg-navy py-3"
        )}
      >
        <div className="container-wide flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img 
              src="/images/logo.png" 
              alt="Logo HTX Tân Phú" 
              className="h-12 w-auto object-contain rounded-sm bg-white p-1"
            />
            <div className="hidden sm:block">
              <div
                className={cn(
                  "font-heading font-bold text-sm leading-tight transition-colors",
                  scrolled ? "text-teal" : "text-teal-light"
                )}
              >
                HTX VẬN TẢI Ô TÔ
              </div>
              <div
                className={cn(
                  "font-heading font-black text-base leading-tight transition-colors",
                  scrolled ? "text-navy" : "text-white"
                )}
              >
                TÂN PHÚ
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-sm font-body font-semibold text-sm transition-all duration-200",
                    pathname.startsWith(item.href) && item.href !== "/"
                      ? scrolled
                        ? "text-orange-500"
                        : "text-orange-300"
                      : scrolled
                      ? "text-gray-700 hover:text-orange-500"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>
                {item.children && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-sm shadow-xl border border-gray-100 py-2 min-w-[220px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-body transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Hotline + Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.hotlineTel}`}
              className={cn(
                "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-semibold transition-colors",
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
                "lg:hidden p-2 rounded-sm transition-colors",
                scrolled ? "text-navy hover:bg-gray-100" : "text-white hover:bg-white/10"
              )}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="bg-navy px-6 py-4 flex items-center justify-between">
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
                        "flex-1 block px-6 py-3 font-body font-semibold text-sm transition-colors",
                        pathname.startsWith(item.href) && item.href !== "/"
                          ? "text-orange-500"
                          : "text-gray-800 hover:text-orange-500"
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        className="px-4 py-3 text-gray-400"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.href ? null : item.href
                          )
                        }
                        aria-label="Mở submenu"
                      >
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform",
                            openDropdown === item.href && "rotate-180"
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {item.children && openDropdown === item.href && (
                    <div className="bg-gray-50 border-t border-b border-gray-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-10 py-2.5 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="px-6 py-4 border-t border-gray-100">
              <a
                href={`tel:${COMPANY_INFO.hotlineTel}`}
                className="btn-primary w-full justify-center"
              >
                <Phone size={16} />
                {COMPANY_INFO.hotline}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
