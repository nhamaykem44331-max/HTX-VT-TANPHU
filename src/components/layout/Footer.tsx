import Link from "next/link";
import { Phone, Mail, MapPin, Facebook } from "lucide-react";
import { COMPANY_INFO, NAV_ITEMS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--navy-dark)" }}>
      <div className="container-wide py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: Về HTX */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img 
                src="/images/logo.png" 
                alt="Logo HTX Tân Phú" 
                className="h-12 w-auto object-contain rounded-sm bg-white p-1"
              />
              <div>
                <div className="font-heading font-bold text-xs text-teal-light leading-tight">
                  HTX VẬN TẢI Ô TÔ
                </div>
                <div className="font-heading font-black text-base text-white leading-tight">
                  TÂN PHÚ
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              30 năm uy tín — đa ngành, chuyên nghiệp. Cam kết mang lại giá trị
              bền vững cho khách hàng và cộng đồng.
            </p>
            <p className="text-orange-400 font-heading font-semibold text-sm italic mb-5">
              "{COMPANY_INFO.slogan}"
            </p>
            <div className="flex gap-3">
              <a
                href={COMPANY_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-sm bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                <Facebook size={16} className="text-white" />
              </a>
              <a
                href={COMPANY_INFO.zalo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo"
                className="w-9 h-9 rounded-sm bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-colors text-white font-bold text-xs"
              >
                Z
              </a>
            </div>
          </div>

          {/* Col 2: Liên kết nhanh */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-5">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-orange-400 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-sm bg-orange-500 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://book.tanphuapg.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-orange-400 text-sm transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-orange-500 flex-shrink-0" />
                  Đặt vé máy bay
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Liên hệ */}
          <div>
            <h3 className="font-heading font-bold text-white text-base mb-5">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              {Object.values(COMPANY_INFO.addresses).map((addr) => (
                <li key={addr.label} className="flex gap-3">
                  <MapPin
                    size={16}
                    className="text-orange-400 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <div className="text-white text-xs font-semibold mb-0.5">
                      {addr.label}
                    </div>
                    <div className="text-white/60 text-xs">{addr.address}</div>
                  </div>
                </li>
              ))}
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-orange-400 flex-shrink-0" />
                <a
                  href={`tel:${COMPANY_INFO.hotlineTel}`}
                  className="text-white/80 hover:text-orange-400 text-sm transition-colors font-semibold"
                >
                  {COMPANY_INFO.hotline}
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-orange-400 flex-shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-white/60 hover:text-orange-400 text-sm transition-colors"
                >
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-wide py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            © {year} {COMPANY_INFO.name}. Bản quyền thuộc về HTX Tân Phú.
          </p>
          <p className="text-white/40 text-xs">
            MST: {COMPANY_INFO.taxCode} | Designed by{" "}
            <span className="text-orange-400">Tân Phú APG</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
