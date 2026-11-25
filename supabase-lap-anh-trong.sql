-- Lấp các ô ảnh đang trống trên website (25/11/2026).
-- Chạy trong Supabase SQL Editor SAU KHI bản deploy chứa thư mục public/images/thiet-bi/ đã lên production,
-- nếu không các ô sẽ hiện ảnh vỡ.
-- Chỉ ghi vào ô đang trống (NULL hoặc ''), không đè ảnh đã có. Chạy lại nhiều lần không sao.
-- Nguồn và giấy phép ảnh: NGUON-ANH.md

BEGIN;

-- 1. Năng lực & thiết bị: 3 xe chưa có ảnh (ảnh minh họa CC0 từ Wikimedia Commons)
UPDATE public.equipments SET image = '/images/thiet-bi/xe-tai-40-tan-hyundai.webp'
WHERE id = '56bf06c5-1cfb-4330-8c40-73205b521acd' /* Xe tải 40 tấn Hyundai */ AND COALESCE(image, '') = '';

UPDATE public.equipments SET image = '/images/thiet-bi/xe-tai-20-tan.webp'
WHERE id = 'c864610b-46d4-435f-b395-e166a9df65c7' /* Xe tải 20 tấn */ AND COALESCE(image, '') = '';

UPDATE public.equipments SET image = '/images/thiet-bi/xe-khach-29-cho.webp'
WHERE id = 'a66a8d4d-f444-48d3-b60f-6f433733cef5' /* Xe khách 29 chỗ */ AND COALESCE(image, '') = '';

-- 2. Trang Giới thiệu: ảnh cạnh đoạn giới thiệu (dùng ảnh chụp thật cổng kho bãi Tân Phú đã có trên Storage)
UPDATE public.site_settings
SET value = jsonb_set(
      value,
      '{gioiThieu,introImage}',
      to_jsonb('https://cuqcimfkvvjrlkbwbrhf.supabase.co/storage/v1/object/public/website-images/equipment/1775187259927-Kho_Y_n_b_nh-optimized.webp'::text)
    ),
    updated_at = NOW()
WHERE key = 'page_editor_content'
  AND COALESCE(value #>> '{gioiThieu,introImage}', '') = '';

-- Kiểm tra: cả 4 dòng phải có ảnh
SELECT name AS muc, image AS anh FROM public.equipments
WHERE id IN ('56bf06c5-1cfb-4330-8c40-73205b521acd', 'c864610b-46d4-435f-b395-e166a9df65c7', 'a66a8d4d-f444-48d3-b60f-6f433733cef5')
UNION ALL
SELECT 'Giới thiệu - introImage', value #>> '{gioiThieu,introImage}' FROM public.site_settings WHERE key = 'page_editor_content';

COMMIT;
