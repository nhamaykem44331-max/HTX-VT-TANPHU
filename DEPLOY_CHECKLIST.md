# Deploy Checklist - HTX VT Tan Phu

Checklist nay la quy trinh deploy chuan cho du an `HTX-VT-TANPHU`.

Muc tieu:
- Giup cac model khac co the cap nhat code va deploy dung ngay tu lan dau.
- Tranh cac loi da tung gap tren du an nay nhu thieu env Vercel, loi upload anh, lech schema Supabase, hoac loi newline khi set env bang Vercel CLI tren Windows.

Thoi diem checklist nay duoc xac nhan: `2026-04-03`.

## 1. Thong tin co dinh cua du an

- GitHub repo: `https://github.com/nhamaykem44331-max/HTX-VT-TANPHU`
- Branch production hien dung: `main`
- Vercel scope: `nhamaykem44331-maxs-projects`
- Vercel project: `htx-vt-tanphu`
- Production URL: `https://htx-vt-tanphu.vercel.app`
- Supabase project ref: `cuqcimfkvvjrlkbwbrhf`
- Supabase URL: `https://cuqcimfkvvjrlkbwbrhf.supabase.co`

## 2. Quy tac truoc khi deploy

- Khong commit cac file secret nhu `.env.local`, `.env.vercel*`, hoac bat ky key private nao.
- Luon chay `git status --short` truoc khi commit de biet chinh xac minh dang day gi.
- Neu sua code lien quan UI, route, auth, API, upload, CMS, hoac data fetching thi phai chay `npm run build` truoc khi push.
- Neu thay doi schema hoac seed du lieu Supabase thi phai cap nhat file SQL tuong ung va chay bootstrap DB truoc khi deploy production.
- Neu thay doi env tren Vercel thi phai redeploy production sau khi set env. Chi doi env thoi la chua du.

## 3. Checklist local truoc khi push

- `npm install`
- `git status --short`
- Kiem tra `.env.local` da co du bien can thiet cho local.
- Chay `npm run build`
- Neu build fail thi khong push.

## 4. Bien moi truong local toi thieu

Tham chieu tu `.env.local.example`.

Bien local thuong dung:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_DB_URL`
- `SUPABASE_SERVICE_ROLE_KEY` neu co
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH` hoac de trong de dung fallback dev
- `JWT_SECRET`

## 5. Khi co thay doi lien quan Supabase

Neu thay doi bang, seed du lieu, bucket, policy, hoac logic upload:

1. Cap nhat mot trong cac file:
   - `supabase-schema.sql`
   - `supabase-storage-setup.sql`
   - `run-sql.mjs`
2. Dam bao `.env.local` co `SUPABASE_DB_URL`.
3. Chay:

```bash
npm run supabase:setup
```

4. Xac nhan DB da co du bang chinh:
   - `news`
   - `jobs`
   - `partners`
   - `awards`
   - `contact_submissions`
   - `site_settings`
   - `homepage_sections`
   - `hero_slides`
   - `key_figures`
   - `fields`
   - `equipments`
5. Xac nhan bucket `website-images` van hoat dong.

## 6. Checklist env tren Vercel

### Bien production bat buoc

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `ADMIN_USERNAME`
- `JWT_SECRET`

### Bien production khuyen nghi

- `SUPABASE_SERVICE_ROLE_KEY`

### Bien production tuy chon nhung can can than

- `ADMIN_PASSWORD_HASH`

Luu y rat quan trong:
- Neu set `ADMIN_PASSWORD_HASH` bang Vercel CLI tren Windows PowerShell theo kieu pipe hoac echo sai cach, value rat de bi dinh `\\r\\n`.
- Khi `ADMIN_PASSWORD_HASH` bi dinh newline, login admin tren production se bao sai tai khoan hoac mat khau du hash nhin co ve dung.
- Cach an toan hon tren Windows la dung `cmd /c` voi `--value`.
- Neu chua can hash rieng, co the bo `ADMIN_PASSWORD_HASH` de app dung fallback hien tai trong code.

## 7. Cach dang nhap Vercel CLI dung cho du an nay

```bash
npx --yes vercel whoami
npx --yes vercel link --yes --project htx-vt-tanphu --scope nhamaykem44331-maxs-projects
```

Sau khi link xong, `.vercel` se duoc tao local nhung da duoc ignore trong repo.

## 8. Cach kiem tra env hien co tren Vercel

```bash
npx --yes vercel env ls production --scope nhamaykem44331-maxs-projects
```

Neu can tai env ve file tam de kiem tra:

```bash
npx --yes vercel env pull .env.vercel.production --environment production --scope nhamaykem44331-maxs-projects
```

Sau khi kiem tra xong, nen xoa file nay ngay vi no chua secret.

## 9. Cach set env tren Vercel an toan tren Windows

Luon uu tien dung `cmd /c` cho cac env nhay cam hoac env can chinh xac tung ky tu:

```bash
cmd /c "npx --yes vercel env add NEXT_PUBLIC_SUPABASE_URL production --force --yes --value https://your-project.supabase.co --scope nhamaykem44331-maxs-projects"
cmd /c "npx --yes vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --force --yes --value your_publishable_key --scope nhamaykem44331-maxs-projects"
cmd /c "npx --yes vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY production --force --yes --value your_publishable_key --scope nhamaykem44331-maxs-projects"
cmd /c "npx --yes vercel env add ADMIN_USERNAME production --force --yes --value admin --scope nhamaykem44331-maxs-projects"
cmd /c "npx --yes vercel env add JWT_SECRET production --force --yes --value your_secret --scope nhamaykem44331-maxs-projects"
```

Neu can xoa env:

```bash
npx --yes vercel env rm ADMIN_PASSWORD_HASH production --yes --scope nhamaykem44331-maxs-projects
```

## 10. Cach deploy production chuan

### Cach chuan nhat

1. Commit code:

```bash
git status --short
git add .
git commit -m "Your commit message"
git push origin main
```

2. Neu Vercel dang auto-deploy tu GitHub, cho deployment production chay.

### Cach chu dong bang CLI

Sau khi link project:

```bash
npx --yes vercel deploy --prod --yes --scope nhamaykem44331-maxs-projects
```

Chi deploy production sau khi:
- `npm run build` da pass
- env production da dung
- schema Supabase da san sang neu co lien quan DB

## 11. Smoke test sau deploy

Bat buoc kiem tra it nhat cac buoc sau:

1. Mo trang chu production:
   - `https://htx-vt-tanphu.vercel.app`
2. Mo admin login:
   - `https://htx-vt-tanphu.vercel.app/admin/login`
3. Dang nhap admin.
4. Vao:
   - `/admin/trang-chu`
5. Upload thu 1 anh o phan Hero Banner.
6. Kiem tra anh upload xong khong con loi `fetch failed`.
7. Vao:
   - `/admin/tin-tuc`
   - `/admin/tuyen-dung`
   - `/admin/linh-vuc`
   - `/admin/thiet-bi`
8. Kiem tra frontend public:
   - `/`
   - `/linh-vuc`
   - `/nang-luc`
   - `/tin-tuc`
   - `/tuyen-dung`

## 12. Checklist rieng cho upload anh

Neu upload anh loi:

1. Kiem tra Vercel env production co du:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
2. Neu vua sua env, redeploy production lai.
3. Kiem tra bucket `website-images` con ton tai tren Supabase.
4. Kiem tra policy storage co con dung.
5. Kiem tra route:
   - `src/app/api/upload/route.ts`
   - `src/app/api/upload/delete/route.ts`
   - `src/lib/supabase.ts`
6. Kiem tra login admin co dang hoat dong khong, vi upload yeu cau auth.

## 13. Checklist rieng cho admin login

Neu login production loi:

1. Kiem tra `ADMIN_USERNAME`
2. Kiem tra `JWT_SECRET`
3. Neu dang dung `ADMIN_PASSWORD_HASH`, kiem tra xem value tren Vercel co bi dinh newline khong.
4. Neu nghi ngo hash loi, tam xoa `ADMIN_PASSWORD_HASH` de quay ve fallback hien tai cua code.
5. Redeploy production lai sau khi sua env.

## 14. Khi nao can commit them sau deploy

Can commit neu trong qua trinh deploy phat sinh thay doi local nhu:
- `.gitignore`
- `README.md`
- `DEPLOY_CHECKLIST.md`
- script bootstrap
- file config Vercel hoac Supabase

Khong commit:
- `.env.local`
- `.env.vercel.production`
- bat ky secret file tam nao

## 15. Ket qua deploy duoc coi la thanh cong khi

- `npm run build` pass o local
- production deploy tren Vercel o trang thai `READY`
- admin login hoat dong
- upload anh hoat dong
- frontend public khong loi
- data tu Supabase hien thi dung

## 16. Goi y thao tac chuan cho cac model khac

Luon di theo thu tu nay:

1. Doc `git status --short`
2. Doc `README.md`
3. Doc `DEPLOY_CHECKLIST.md`
4. Chay `npm run build`
5. Neu sua DB, chay `npm run supabase:setup`
6. Neu sua env, cap nhat env roi redeploy
7. Smoke test sau deploy
8. Chi ket thuc khi production da duoc kiem tra
