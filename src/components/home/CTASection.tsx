import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export default function CTASection() {
  return (
    <section className="py-20" style={{ background: "linear-gradient(135deg, var(--teal) 0%, var(--navy) 100%)" }}>
      <div className="container-wide text-center">
        <h2 className="font-heading font-black text-white text-3xl md:text-4xl mb-4">
          Sẵn sàng hợp tác cùng HTX Tân Phú?
        </h2>
        <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
          Liên hệ ngay để được tư vấn miễn phí về các dịch vụ phù hợp với nhu cầu của bạn.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/lien-he" className="btn-primary">
            <ArrowRight size={16} />
            Gửi yêu cầu tư vấn
          </Link>
          <a href={`tel:${COMPANY_INFO.hotlineTel}`} className="btn-outline">
            <Phone size={16} />
            {COMPANY_INFO.hotline}
          </a>
        </div>
      </div>
    </section>
  );
}
