import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  tone?: "light" | "dark";
}

export default function Breadcrumb({ items, tone = "light" }: BreadcrumbProps) {
  const styles =
    tone === "light"
      ? {
          shell: "bg-white/8 ring-1 ring-white/10 md:bg-transparent md:ring-0",
          home: "text-white/80 hover:text-white",
          link: "text-white/70 hover:text-white",
          current: "text-white",
          icon: "text-white/45",
        }
      : {
          shell: "bg-gray-50 ring-1 ring-gray-200 md:bg-transparent md:ring-0",
          home: "text-gray-500 hover:text-orange-500",
          link: "text-gray-500 hover:text-orange-500",
          current: "text-gray-800",
          icon: "text-gray-300",
        };

  return (
    <nav
      aria-label="Breadcrumb"
      className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        className={cn(
          "flex min-w-max items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:text-sm md:px-0 md:py-0",
          styles.shell
        )}
      >
        <Link href="/" className={cn("inline-flex shrink-0 items-center gap-1 transition-colors", styles.home)}>
          <Home size={14} />
          <span className="hidden sm:inline">Trang chủ</span>
        </Link>

        {items.map((item, index) => (
          <span key={`${item.label}-${index}`} className="flex min-w-0 shrink-0 items-center gap-1.5">
            <ChevronRight size={13} className={styles.icon} />
            {item.href ? (
              <Link
                href={item.href}
                className={cn("max-w-[6.5rem] truncate transition-colors sm:max-w-[10rem] md:max-w-none", styles.link)}
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn("max-w-[8.5rem] truncate font-medium sm:max-w-[14rem] md:max-w-none", styles.current)}>
                {item.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
