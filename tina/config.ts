import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ===================== COMPANY INFO =====================
      {
        name: "companyInfo",
        label: "Thông tin Công ty",
        path: "content/company",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          { type: "string", name: "name", label: "Tên doanh nghiệp", required: true },
          { type: "string", name: "shortName", label: "Tên rút gọn" },
          { type: "number", name: "founded", label: "Năm thành lập" },
          { type: "number", name: "years", label: "Số năm hoạt động" },
          { type: "string", name: "slogan", label: "Slogan" },
          { type: "string", name: "taxCode", label: "Mã số thuế" },
          { type: "string", name: "director", label: "Giám đốc" },
          { type: "string", name: "revenue", label: "Doanh thu" },
          { type: "string", name: "staff", label: "Nhân sự" },
          { type: "string", name: "website", label: "Website" },
          { type: "string", name: "hotline", label: "Hotline hiển thị" },
          { type: "string", name: "hotlineTel", label: "Hotline (số điện thoại)" },
          { type: "string", name: "email", label: "Email" },
          { type: "string", name: "zalo", label: "Zalo URL" },
          { type: "string", name: "facebook", label: "Facebook URL" },
          {
            type: "object",
            name: "addresses",
            label: "Địa chỉ",
            list: true,
            fields: [
              { type: "string", name: "key", label: "Key (ID)" },
              { type: "string", name: "label", label: "Tên chi nhánh" },
              { type: "string", name: "address", label: "Địa chỉ" },
              { type: "string", name: "phone", label: "Số điện thoại" },
              { type: "string", name: "mapUrl", label: "Google Maps URL" },
            ],
          },
        ],
      },

      // ===================== NEWS =====================
      {
        name: "news",
        label: "Tin tức",
        path: "content/news",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Tiêu đề", isTitle: true, required: true },
          { type: "string", name: "excerpt", label: "Mô tả ngắn", ui: { component: "textarea" } },
          { type: "string", name: "category", label: "Danh mục" },
          { type: "datetime", name: "date", label: "Ngày đăng" },
          { type: "string", name: "author", label: "Tác giả" },
          { type: "number", name: "readTime", label: "Thời gian đọc (phút)" },
          { type: "boolean", name: "featured", label: "Tin nổi bật?" },
          { type: "image", name: "image", label: "Ảnh đại diện" },
          { type: "rich-text", name: "body", label: "Nội dung bài viết", isBody: true },
        ],
      },

      // ===================== JOBS =====================
      {
        name: "jobs",
        label: "Tuyển dụng",
        path: "content/jobs",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Vị trí tuyển", isTitle: true, required: true },
          { type: "string", name: "department", label: "Phòng ban" },
          { type: "string", name: "location", label: "Địa điểm" },
          {
            type: "string",
            name: "type",
            label: "Loại hình",
            options: [
              { value: "full-time", label: "Toàn thời gian" },
              { value: "part-time", label: "Bán thời gian" },
              { value: "contract", label: "Hợp đồng" },
            ],
          },
          { type: "string", name: "deadline", label: "Hạn nộp (YYYY-MM-DD)" },
          { type: "string", name: "fieldId", label: "Lĩnh vực (slug)" },
          { type: "string", name: "description", label: "Mô tả công việc", ui: { component: "textarea" } },
          { type: "string", name: "requirements", label: "Yêu cầu", list: true },
          { type: "string", name: "benefits", label: "Quyền lợi", list: true },
          { type: "rich-text", name: "body", label: "Chi tiết (tuỳ chọn)", isBody: true },
        ],
      },

      // ===================== FIELDS =====================
      {
        name: "fields",
        label: "Lĩnh vực",
        path: "content/fields",
        format: "json",
        fields: [
          { type: "string", name: "slug", label: "Slug (URL)", required: true },
          { type: "string", name: "name", label: "Tên lĩnh vực", required: true },
          { type: "string", name: "icon", label: "Icon (Lucide name)" },
          { type: "string", name: "shortDesc", label: "Mô tả ngắn" },
          { type: "string", name: "description", label: "Mô tả chi tiết", ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Ảnh đại diện" },
          {
            type: "object",
            name: "stats",
            label: "Thống kê",
            list: true,
            fields: [
              { type: "string", name: "label", label: "Nhãn" },
              { type: "string", name: "value", label: "Giá trị" },
            ],
          },
          { type: "string", name: "features", label: "Đặc điểm", list: true },
          { type: "string", name: "services", label: "Dịch vụ", list: true },
        ],
      },

      // ===================== AWARDS =====================
      {
        name: "awards",
        label: "Giải thưởng",
        path: "content/awards",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Tên giải thưởng", required: true },
          { type: "string", name: "issuer", label: "Đơn vị trao tặng" },
          { type: "string", name: "year", label: "Năm" },
          { type: "image", name: "image", label: "Ảnh" },
          { type: "string", name: "description", label: "Mô tả" },
        ],
      },

      // ===================== PARTNERS =====================
      {
        name: "partners",
        label: "Đối tác",
        path: "content/partners",
        format: "json",
        fields: [
          { type: "string", name: "name", label: "Tên đối tác", required: true },
          { type: "string", name: "category", label: "Ngành" },
          { type: "image", name: "logo", label: "Logo" },
        ],
      },

      // ===================== TIMELINE =====================
      {
        name: "timeline",
        label: "Mốc lịch sử",
        path: "content/timeline",
        format: "json",
        fields: [
          { type: "string", name: "year", label: "Năm", required: true },
          { type: "string", name: "title", label: "Tiêu đề sự kiện", required: true },
          { type: "string", name: "description", label: "Mô tả sự kiện", ui: { component: "textarea" } },
          { type: "boolean", name: "milestone", label: "Mốc quan trọng?" },
        ],
      },
    ],
  },
});
