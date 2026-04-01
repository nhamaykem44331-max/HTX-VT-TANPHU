// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      // ===================== COMPANY INFO =====================
      {
        name: "companyInfo",
        label: "Th\xF4ng tin C\xF4ng ty",
        path: "content/company",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          global: true
        },
        fields: [
          { type: "string", name: "name", label: "T\xEAn doanh nghi\u1EC7p", required: true },
          { type: "string", name: "shortName", label: "T\xEAn r\xFAt g\u1ECDn" },
          { type: "number", name: "founded", label: "N\u0103m th\xE0nh l\u1EADp" },
          { type: "number", name: "years", label: "S\u1ED1 n\u0103m ho\u1EA1t \u0111\u1ED9ng" },
          { type: "string", name: "slogan", label: "Slogan" },
          { type: "string", name: "taxCode", label: "M\xE3 s\u1ED1 thu\u1EBF" },
          { type: "string", name: "director", label: "Gi\xE1m \u0111\u1ED1c" },
          { type: "string", name: "revenue", label: "Doanh thu" },
          { type: "string", name: "staff", label: "Nh\xE2n s\u1EF1" },
          { type: "string", name: "website", label: "Website" },
          { type: "string", name: "hotline", label: "Hotline hi\u1EC3n th\u1ECB" },
          { type: "string", name: "hotlineTel", label: "Hotline (s\u1ED1 \u0111i\u1EC7n tho\u1EA1i)" },
          { type: "string", name: "email", label: "Email" },
          { type: "string", name: "zalo", label: "Zalo URL" },
          { type: "string", name: "facebook", label: "Facebook URL" },
          {
            type: "object",
            name: "addresses",
            label: "\u0110\u1ECBa ch\u1EC9",
            list: true,
            fields: [
              { type: "string", name: "key", label: "Key (ID)" },
              { type: "string", name: "label", label: "T\xEAn chi nh\xE1nh" },
              { type: "string", name: "address", label: "\u0110\u1ECBa ch\u1EC9" },
              { type: "string", name: "phone", label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" },
              { type: "string", name: "mapUrl", label: "Google Maps URL" }
            ]
          }
        ]
      },
      // ===================== NEWS =====================
      {
        name: "news",
        label: "Tin t\u1EE9c",
        path: "content/news",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Ti\xEAu \u0111\u1EC1", isTitle: true, required: true },
          { type: "string", name: "excerpt", label: "M\xF4 t\u1EA3 ng\u1EAFn", ui: { component: "textarea" } },
          { type: "string", name: "category", label: "Danh m\u1EE5c" },
          { type: "datetime", name: "date", label: "Ng\xE0y \u0111\u0103ng" },
          { type: "string", name: "author", label: "T\xE1c gi\u1EA3" },
          { type: "number", name: "readTime", label: "Th\u1EDDi gian \u0111\u1ECDc (ph\xFAt)" },
          { type: "boolean", name: "featured", label: "Tin n\u1ED5i b\u1EADt?" },
          { type: "image", name: "image", label: "\u1EA2nh \u0111\u1EA1i di\u1EC7n" },
          { type: "rich-text", name: "body", label: "N\u1ED9i dung b\xE0i vi\u1EBFt", isBody: true }
        ]
      },
      // ===================== JOBS =====================
      {
        name: "jobs",
        label: "Tuy\u1EC3n d\u1EE5ng",
        path: "content/jobs",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "V\u1ECB tr\xED tuy\u1EC3n", isTitle: true, required: true },
          { type: "string", name: "department", label: "Ph\xF2ng ban" },
          { type: "string", name: "location", label: "\u0110\u1ECBa \u0111i\u1EC3m" },
          {
            type: "string",
            name: "type",
            label: "Lo\u1EA1i h\xECnh",
            options: [
              { value: "full-time", label: "To\xE0n th\u1EDDi gian" },
              { value: "part-time", label: "B\xE1n th\u1EDDi gian" },
              { value: "contract", label: "H\u1EE3p \u0111\u1ED3ng" }
            ]
          },
          { type: "string", name: "deadline", label: "H\u1EA1n n\u1ED9p (YYYY-MM-DD)" },
          { type: "string", name: "fieldId", label: "L\u0129nh v\u1EF1c (slug)" },
          { type: "string", name: "description", label: "M\xF4 t\u1EA3 c\xF4ng vi\u1EC7c", ui: { component: "textarea" } },
          { type: "string", name: "requirements", label: "Y\xEAu c\u1EA7u", list: true },
          { type: "string", name: "benefits", label: "Quy\u1EC1n l\u1EE3i", list: true },
          { type: "rich-text", name: "body", label: "Chi ti\u1EBFt (tu\u1EF3 ch\u1ECDn)", isBody: true }
        ]
      },
      // ===================== FIELDS =====================
      {
        name: "fields",
        label: "L\u0129nh v\u1EF1c",
        path: "content/fields",
        format: "json",
        fields: [
          { type: "string", name: "slug", label: "Slug (URL)", required: true },
          { type: "string", name: "name", label: "T\xEAn l\u0129nh v\u1EF1c", required: true },
          { type: "string", name: "icon", label: "Icon (Lucide name)" },
          { type: "string", name: "shortDesc", label: "M\xF4 t\u1EA3 ng\u1EAFn" },
          { type: "string", name: "description", label: "M\xF4 t\u1EA3 chi ti\u1EBFt", ui: { component: "textarea" } },
          { type: "image", name: "image", label: "\u1EA2nh \u0111\u1EA1i di\u1EC7n" },
          {
            type: "object",
            name: "stats",
            label: "Th\u1ED1ng k\xEA",
            list: true,
            fields: [
              { type: "string", name: "label", label: "Nh\xE3n" },
              { type: "string", name: "value", label: "Gi\xE1 tr\u1ECB" }
            ]
          },
          { type: "string", name: "features", label: "\u0110\u1EB7c \u0111i\u1EC3m", list: true },
          { type: "string", name: "services", label: "D\u1ECBch v\u1EE5", list: true }
        ]
      },
      // ===================== AWARDS =====================
      {
        name: "awards",
        label: "Gi\u1EA3i th\u01B0\u1EDFng",
        path: "content/awards",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "T\xEAn gi\u1EA3i th\u01B0\u1EDFng", required: true },
          { type: "string", name: "issuer", label: "\u0110\u01A1n v\u1ECB trao t\u1EB7ng" },
          { type: "string", name: "year", label: "N\u0103m" },
          { type: "image", name: "image", label: "\u1EA2nh" },
          { type: "string", name: "description", label: "M\xF4 t\u1EA3" }
        ]
      },
      // ===================== PARTNERS =====================
      {
        name: "partners",
        label: "\u0110\u1ED1i t\xE1c",
        path: "content/partners",
        format: "json",
        fields: [
          { type: "string", name: "name", label: "T\xEAn \u0111\u1ED1i t\xE1c", required: true },
          { type: "string", name: "category", label: "Ng\xE0nh" },
          { type: "image", name: "logo", label: "Logo" }
        ]
      },
      // ===================== TIMELINE =====================
      {
        name: "timeline",
        label: "M\u1ED1c l\u1ECBch s\u1EED",
        path: "content/timeline",
        format: "json",
        fields: [
          { type: "string", name: "year", label: "N\u0103m", required: true },
          { type: "string", name: "title", label: "Ti\xEAu \u0111\u1EC1 s\u1EF1 ki\u1EC7n", required: true },
          { type: "string", name: "description", label: "M\xF4 t\u1EA3 s\u1EF1 ki\u1EC7n", ui: { component: "textarea" } },
          { type: "boolean", name: "milestone", label: "M\u1ED1c quan tr\u1ECDng?" }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
