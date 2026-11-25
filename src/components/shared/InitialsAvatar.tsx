import { cn } from "@/lib/utils";

/** Lấy chữ cái đầu mỗi từ, tối đa 3 chữ: "Nguyễn Đức Điểm" → "NĐĐ", "Kế toán trưởng" → "KTT". */
export function getInitials(name: string) {
  return name
    .normalize("NFC")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => Array.from(word)[0])
    .join("")
    .toLocaleUpperCase("vi");
}

/** Ô chân dung dùng khi chưa có ảnh: chữ viết tắt trên nền màu thương hiệu. */
export default function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={name}
      className={cn("relative flex aspect-[3/4] flex-col items-center justify-center gap-4 overflow-hidden", className)}
      style={{ background: "linear-gradient(160deg, var(--navy) 0%, var(--navy-dark) 100%)" }}
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10" aria-hidden />
      <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full border border-white/5" aria-hidden />
      <span className="font-heading text-5xl font-bold tracking-wider text-white">{getInitials(name)}</span>
      <span className="h-1 w-10 rounded-full" style={{ backgroundColor: "var(--orange)" }} aria-hidden />
    </div>
  );
}
