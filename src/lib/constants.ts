import type { NavItem } from "./types";
import companyData from "../../content/company/info.json";

// Chuyển đổi addresses từ array (TinaCMS) sang object (code cũ)
const addressesObj: Record<string, { label: string; address: string; phone: string; mapUrl: string }> = {};
for (const addr of companyData.addresses) {
  addressesObj[addr.key] = {
    label: addr.label,
    address: addr.address,
    phone: addr.phone,
    mapUrl: addr.mapUrl,
  };
}

export const COMPANY_INFO = {
  name: companyData.name,
  shortName: companyData.shortName,
  founded: companyData.founded,
  years: companyData.years,
  slogan: companyData.slogan,
  taxCode: companyData.taxCode,
  director: companyData.director,
  revenue: companyData.revenue,
  staff: companyData.staff,
  website: companyData.website,
  hotline: companyData.hotline,
  hotlineTel: companyData.hotlineTel,
  email: companyData.email,
  zalo: companyData.zalo,
  facebook: companyData.facebook,
  addresses: addressesObj,
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  {
    label: "Lĩnh vực",
    href: "/linh-vuc",
    children: [
      { label: "Vận tải hàng hóa", href: "/linh-vuc/van-tai" },
      { label: "Cẩu lắp đặt", href: "/linh-vuc/cau-lap-dat" },
      { label: "Kinh doanh thép", href: "/linh-vuc/kinh-doanh-thep" },
      {
        label: "Khách sạn Phương Anh",
        href: "/linh-vuc/khach-san-phuong-anh",
      },
      { label: "Nhà hàng & Sự kiện", href: "/linh-vuc/nha-hang-su-kien" },
      { label: "Đại lý vé máy bay", href: "/linh-vuc/ve-may-bay" },
      { label: "Nông nghiệp hữu cơ", href: "/linh-vuc/nong-nghiep" },
      { label: "Wonderland Nha Trang", href: "/linh-vuc/wonderland" },
    ],
  },
  { label: "Năng lực", href: "/nang-luc" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Tuyển dụng", href: "/tuyen-dung" },
  { label: "Liên hệ", href: "/lien-he" },
];

export const KEY_FIGURES = [
  { label: "Năm hoạt động", value: 30, suffix: "+", icon: "calendar" },
  { label: "Cán bộ nhân viên", value: 150, suffix: "+", icon: "users" },
  { label: "Đầu xe các loại", value: 40, suffix: "", icon: "truck" },
  { label: "Cần cẩu (max 330 tấn)", value: 9, suffix: "", icon: "crane" },
  {
    label: "Nhà xưởng & Kho bãi",
    value: 10000,
    suffix: "m²",
    icon: "warehouse",
  },
  { label: "Doanh thu/năm (tỷ đồng)", value: 2990, suffix: "~", icon: "chart" },
];

export const SERVICES_FOR_CONTACT = [
  "Vận tải hàng hóa",
  "Cẩu lắp đặt thiết bị",
  "Kinh doanh thép",
  "Đặt phòng khách sạn",
  "Đặt tiệc / Sự kiện",
  "Đặt vé máy bay",
  "Nông sản hữu cơ",
  "Khác",
];
