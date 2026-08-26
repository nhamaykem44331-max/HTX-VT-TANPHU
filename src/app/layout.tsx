import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import { COMPANY_INFO } from "@/lib/constants";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Google lấy favicon để hiện cạnh kết quả tìm kiếm. Trước đây site không khai
  // báo icon nào nên Google hiện hình quả cầu mặc định thay vì logo HTX.
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
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
    url: SITE_URL,
    siteName: COMPANY_INFO.name,
    title: "HTX Vận tải Ô tô Tân Phú — 30 năm hòa hợp cùng phát triển",
    description:
      "Doanh nghiệp HTX đa ngành hàng đầu Thái Nguyên với 7 lĩnh vực kinh doanh, doanh thu ~3.000 tỷ/năm.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY_INFO.name,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-512.png`,
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
