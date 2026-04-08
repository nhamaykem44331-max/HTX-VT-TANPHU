"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { COMPANY_INFO, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isActiveItem(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getCurrentSectionLabel(pathname: string) {
  for (const item of NAV_ITEMS) {
    if (isActiveItem(pathname, item.href)) {
      return item.label;
    }

    if (!item.children) {
      continue;
    }

    for (const child of item.children) {
      if (isActiveItem(pathname, child.href)) {
        return item.label;
      }
    }
  }

  return "Trang chủ";
}

function getMenuHint(item: (typeof NAV_ITEMS)[number]) {
  if (!item.children) {
    return "Mở trang";
  }

  return `${item.children.length} chuyên mục`;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const currentSectionLabel = getCurrentSectionLabel(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-[0_8px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 lg:border-b-0 lg:shadow-none lg:backdrop-blur-0",
          scrolled ? "lg:bg-white lg:shadow-lg" : "lg:bg-navy"
        )}
      >
        <div className="container-wide">
          <div className="flex h-[72px] items-center justify-between gap-3 lg:h-auto lg:py-3">
            <Link href="/" className="flex min-w-0 flex-shrink-0 items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white p-1 shadow-sm lg:h-auto lg:w-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="Logo HTX Tan Phu"
                  className="h-9 w-auto object-contain lg:h-12"
                />
              </div>

              <div className="min-w-0">
                <div
                  className={cn(
                    "font-heading text-[9px] font-bold uppercase tracking-[0.18em] text-teal lg:text-[10px]",
                    scrolled ? "lg:text-teal" : "lg:text-teal-light"
                  )}
                >
                  HTX Vận Tải Ô Tô
                </div>
                <div
                  className={cn(
                    "mt-1 font-heading text-sm font-black leading-none tracking-[0.08em] text-navy lg:text-base",
                    scrolled ? "lg:text-navy" : "lg:text-white"
                  )}
                >
                  TÂN PHÚ
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) => {
                const active = isActiveItem(pathname, item.href);

                return (
                  <div key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-semibold transition-all duration-200",
                        active
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
                );
              })}
            </nav>

            <div className="flex items-center gap-2 lg:gap-3">
              <a
                href={`tel:${COMPANY_INFO.hotlineTel}`}
                className={cn(
                  "hidden items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors md:hidden lg:flex",
                  scrolled
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                <Phone size={14} />
                {COMPANY_INFO.hotline}
              </a>

              <a
                href={`tel:${COMPANY_INFO.hotlineTel}`}
                aria-label="Gọi hotline"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition-transform hover:scale-[1.02] lg:hidden"
              >
                <Phone size={16} />
              </a>

              <button
                onClick={() => setMobileOpen((current) => !current)}
                aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden",
                  mobileOpen
                    ? "border-orange-200 bg-orange-50 text-orange-600"
                    : "border-gray-200 bg-white text-navy shadow-sm hover:border-orange-200 hover:text-orange-500"
                )}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />

          <div className="absolute inset-x-3 bottom-3 top-[78px] flex flex-col overflow-hidden rounded-[28px] border border-white/50 bg-white/95 shadow-[0_28px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl">
            <div className="bg-[linear-gradient(135deg,#1F2656_0%,#2C3576_55%,#404B99_100%)] px-5 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                    Điều hướng nhanh
                  </p>
                  <p className="mt-2 font-heading text-xl font-bold">Khám phá HTX Tân Phú</p>
                  <span className="mt-3 inline-flex rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-orange-100">
                    {currentSectionLabel}
                  </span>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Đóng menu"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-3 overflow-y-auto p-4">
              {NAV_ITEMS.map((item) => {
                const active = isActiveItem(pathname, item.href);

                return (
                  <div
                    key={item.href}
                    className={cn(
                      "overflow-hidden rounded-2xl border bg-white transition-colors",
                      active ? "border-orange-200 shadow-[0_10px_30px_rgba(227,120,58,0.12)]" : "border-gray-100"
                    )}
                  >
                    <div className="flex items-stretch">
                      <Link href={item.href} className="flex flex-1 items-center justify-between px-4 py-4">
                        <div>
                          <p className={cn("font-heading text-[15px] font-bold", active ? "text-orange-600" : "text-gray-900")}>
                            {item.label}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">{getMenuHint(item)}</p>
                        </div>

                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            active ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {active ? "Đang xem" : "Mở"}
                        </span>
                      </Link>

                      {item.children ? (
                        <button
                          className="px-4 text-gray-400"
                          onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                          aria-label="Mở submenu"
                        >
                          <ChevronDown
                            size={18}
                            className={cn("transition-transform", openDropdown === item.href && "rotate-180")}
                          />
                        </button>
                      ) : null}
                    </div>

                    {item.children && openDropdown === item.href ? (
                      <div className="grid gap-1 border-t border-gray-100 bg-gray-50 p-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-white hover:text-orange-600"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-gray-50 p-4">
              <a
                href={`tel:${COMPANY_INFO.hotlineTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
              >
                <Phone size={15} />
                Gọi ngay
              </a>
              <Link
                href="/tin-tuc"
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700"
              >
                Tin mới
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
