import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import { COMPANY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL("https://htxtanphu.com"),
  title: {
    default: "HTX Vận tải Ô tô Tân Phú — Đa ngành, Chuyên nghiệp, Uy tín",
    template: "%s | HTX Tân Phú",
  },
  description:
    "HTX Vận tải Ô tô Tân Phú — 30 năm uy tín tại Thái Nguyên. Vận tải hàng hóa, cẩu lắp đặt, kinh doanh thép Hòa Phát, khách sạn Phương Anh, đại lý vé máy bay cấp 1.",
  keywords: [
    "HTX Tân Phú",
    "vận tải Thái Nguyên",
    "cẩu lắp đặt Thái Nguyên",
    "thép Hòa Phát Thái Nguyên",
    "khách sạn Phương Anh",
    "đại lý vé máy bay Thái Nguyên",
    "HTX vận tải ô tô",
  ],
  authors: [{ name: COMPANY_INFO.name }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://htxtanphu.com",
    siteName: COMPANY_INFO.name,
    title: "HTX Vận tải Ô tô Tân Phú — 30 năm hòa hợp cùng phát triển",
    description:
      "Doanh nghiệp HTX đa ngành hàng đầu Thái Nguyên với 7 lĩnh vực kinh doanh, doanh thu ~3.000 tỷ/năm.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HTX Vận tải Ô tô Tân Phú",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://htxtanphu.com",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY_INFO.name,
  url: "https://htxtanphu.com",
  logo: "https://htxtanphu.com/images/logo.svg",
  description:
    "HTX Vận tải Ô tô Tân Phú — 30 năm uy tín, 7 lĩnh vực kinh doanh tại Thái Nguyên",
  foundingDate: "1995",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tổ 13, Phường Cam Giá",
    addressLocality: "TP. Thái Nguyên",
    addressRegion: "Thái Nguyên",
    addressCountry: "VN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: COMPANY_INFO.hotline,
    contactType: "customer service",
    availableLanguage: "Vietnamese",
  },
  sameAs: [COMPANY_INFO.facebook],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="font-body antialiased">
        {isAdmin ? (
          // Admin pages: no Header/Footer, no pt-[60px]
          <>{children}</>
        ) : (
          // Public pages: full layout with Header/Footer
          <>
            <Header />
            <main className="pt-[72px] lg:pt-[76px]">{children}</main>
            <Footer />
            <FloatingButtons />
          </>
        )}
      </body>
    </html>
  );
}
