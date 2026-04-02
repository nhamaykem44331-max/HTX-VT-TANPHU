-- Tạo bucket công khai cho ảnh website
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-images', 'website-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: cho phép đọc công khai (ai cũng xem được ảnh)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'website-images');

-- Policy: cho phép upload/update/delete qua service role (chỉ admin backend)
CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'website-images');

CREATE POLICY "Admin update access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'website-images');

CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'website-images');
