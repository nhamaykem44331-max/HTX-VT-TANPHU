# Session Summary

Ngay cap nhat: `2026-04-03`

## Tong quan

Phien lam viec nay tap trung vao 4 nhom viec chinh:
- Hoan tat ket noi Supabase cho du an
- Sua luong upload anh tren production Vercel
- Them co che tu dong toi uu anh vuot nguong 4MB
- Bo sung tai lieu deploy de cac model khac co the lam theo dung quy trinh

## 1. Ket noi Supabase

Da thuc hien:
- Kiem tra va dong bo lai trang thai du an voi code hien tai
- Cau hinh Supabase cho project ref `cuqcimfkvvjrlkbwbrhf`
- Chay bootstrap schema va storage thanh cong
- Xac minh DB, bucket va storage policy hoat dong dung

File lien quan:
- `src/lib/supabase.ts`
- `run-sql.mjs`
- `supabase-schema.sql`
- `supabase-storage-setup.sql`
- `.env.local.example`

Ket qua:
- Du an da noi voi Supabase that
- Bucket `website-images` hoat dong
- Frontend/admin doc ghi du lieu duoc

## 2. Sua env va production Vercel

Da thuc hien:
- Link Vercel project `htx-vt-tanphu`
- Them env production truc tiep bang Vercel CLI
- Sua loi env bi dinh newline khi set bang PowerShell
- Redeploy production nhieu lan de dam bao env moi duoc ap dung dung

Ket qua:
- Production URL `https://htx-vt-tanphu.vercel.app` da hoat dong on dinh
- Login admin va upload/delete anh da test pass tren site live

Luu y quan trong:
- Khi set env tren Windows cho Vercel, uu tien `cmd /c ... --value ...`
- Neu `ADMIN_PASSWORD_HASH` bi dinh newline, login production se loi
- Production hien dang chay on dinh voi fallback admin:
  - username: `admin`
  - password: `admin123`

## 3. Sua loi upload anh

Van de da gap:
- Upload anh tren production bi `fetch failed`
- Parse loi bi vo JSON
- Nut xoa anh gay canh bao INP do dung `confirm()` native
- Gioi han file 5MB khong an toan voi Vercel Functions

Da sua:
- Dong bo gioi han upload xuong `4MB`
- Sua `ImageUploader` de parse ca text response va JSON response an toan
- Bo `confirm()` native, thay bang modal `DeleteConfirm`
- Cai thien thong bao loi de nguoi dung de hieu hon

File lien quan:
- `src/components/admin/ImageUploader.tsx`
- `src/app/api/upload/route.ts`
- `src/app/api/upload/delete/route.ts`

Ket qua:
- Upload/delete anh tren production da hoat dong
- Loi `Unexpected token ... is not valid JSON` da duoc loai bo
- Thao tac thay anh muot hon

## 4. Tu dong toi uu anh lon hon 4MB

Da thuc hien:
- Them co che nen anh ngay tren client
- Neu JPEG/PNG/WebP vuot 4MB, he thong tu:
  - giam quality
  - giam kich thuoc neu can
  - chuyen sang WebP de toi uu dung luong
- Hien thong bao cho nguoi dung biet anh da duoc toi uu tu bao nhieu xuong bao nhieu

Gioi han hien tai:
- Anh raster lon hon 4MB se duoc tu dong toi uu
- SVG qua lon se bao loi ro rang, khong nen tu dong bang canvas

File lien quan:
- `src/components/admin/ImageUploader.tsx`

Ket qua:
- He thong co the tu dong dua nhieu anh lon ve duoi nguong upload an toan
- Giam kha nang gap loi payload limit cua Vercel

## 5. Tai lieu va quy trinh deploy

Da thuc hien:
- Tao checklist deploy chuan cho du an
- Them diem dan trong README

File lien quan:
- `DEPLOY_CHECKLIST.md`
- `README.md`

Noi dung checklist gom:
- Buoc local truoc khi push
- Buoc Supabase bootstrap
- Buoc Vercel env
- Buoc production deploy
- Smoke test sau deploy
- Cac loi dac thu da gap tren du an nay

## 6. Cac commit chinh trong phien

- `6216eab` - `Add Supabase bootstrap and config support`
- `fed1684` - `Fix production Supabase upload fallback`
- `1fda1ae` - `Ignore Vercel local environment artifacts`
- `4e58bbb` - `Improve image replacement upload handling`
- `66a68e5` - `Add automatic image compression before upload`
- `9fe3f2a` - `Add deployment checklist documentation`

## 7. Trang thai hien tai

- GitHub `main` da day du thay doi
- Vercel production da chay on
- Supabase da noi thanh cong
- Upload/delete anh tren production da test pass
- He thong tu dong toi uu anh lon da co mat
- Repo local sach tai thoi diem tao file nay

## 8. Ghi chu cho phien sau

Neu tiep tuc phat trien du an, nen doc theo thu tu:

1. `README.md`
2. `DEPLOY_CHECKLIST.md`
3. `SESSION_SUMMARY.md`

Neu co deploy moi:
- Luon build local truoc
- Neu sua DB, chay `npm run supabase:setup`
- Neu sua env Vercel, phai redeploy production
- Sau deploy, smoke test lai admin login va upload anh
