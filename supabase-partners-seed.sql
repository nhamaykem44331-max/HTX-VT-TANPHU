INSERT INTO public.partners (name, logo, category, sort_order)
SELECT seed.name, seed.logo, seed.category, seed.sort_order
FROM (
  VALUES
    ('Tập đoàn Hòa Phát', '', 'thep', 0),
    ('Vietjet Air', '', 'hang-khong', 1),
    ('Vietnam Airlines', '', 'hang-khong', 2),
    ('Bamboo Airways', '', 'hang-khong', 3),
    ('BIDV Thái Nguyên', '', 'ngan-hang', 4),
    ('Vietcombank', '', 'ngan-hang', 5),
    ('Agribank', '', 'ngan-hang', 6),
    ('KKC Việt Nam', '', 'cong-nghiep', 7),
    ('Samsung Display Vietnam', '', 'cong-nghiep', 8),
    ('Khu CN Yên Bình', '', 'khu-cong-nghiep', 9),
    ('Liên minh HTX Việt Nam', '', 'to-chuc', 10),
    ('UBND tỉnh Thái Nguyên', '', 'co-quan', 11),
    ('Amadeus GDS', '', 'cong-nghe', 12),
    ('Vietmap', '', 'cong-nghe', 13),
    ('Skyhotel PMS', '', 'cong-nghe', 14),
    ('Pacific Airlines', '', 'hang-khong', 15)
) AS seed(name, logo, category, sort_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.partners existing
  WHERE existing.name = seed.name
);
