-- ============================================================
-- Ho so ung tuyen (job_applications)
-- ============================================================
-- Truoc migration nay, form ung tuyen o trang /tuyen-dung chi hien
-- thong bao "thanh cong" gia bang setTimeout va KHONG luu gi ca.
-- Migration them bang luu ho so + bucket rieng tu cho file CV.
--
-- Migration chi THEM moi, khong sua/xoa bang nao dang chay.
-- Chay an toan nhieu lan (idempotent).
-- ============================================================

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Neu tin tuyen dung bi xoa, ho so van con: job_id thanh NULL
  -- nhung job_title da luu lai nen admin biet ung vien nop vi tri nao.
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  job_department TEXT DEFAULT '',

  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  cover_letter TEXT DEFAULT '',

  -- CV nam trong bucket RIENG TU 'cv-uploads'.
  -- Chi luu duong dan, khong luu URL cong khai.
  cv_path TEXT DEFAULT '',
  cv_file_name TEXT DEFAULT '',

  status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'reviewing', 'contacted', 'rejected', 'hired')),
  note TEXT DEFAULT '',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_status
  ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created
  ON job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_job
  ON job_applications(job_id);

-- Tu dong cap nhat updated_at (dung lai function co san trong schema chinh)
DROP TRIGGER IF EXISTS job_applications_updated ON job_applications;
CREATE TRIGGER job_applications_updated
  BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Bucket rieng tu cho CV
-- ============================================================
-- CV chua thong tin ca nhan (ho ten, dien thoai, dia chi, so CCCD...)
-- nen KHONG dung bucket cong khai 'website-images'.
-- public = false  ->  khong ai doc duoc bang URL truc tiep.
-- Admin xem CV qua signed URL sinh o /api/applications/cv (co kiem tra dang nhap).

INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-uploads', 'cv-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Cho phep backend ghi CV vao bucket.
-- Khong tao policy SELECT cong khai -> chi doc duoc qua signed URL.
DROP POLICY IF EXISTS "CV upload access" ON storage.objects;
CREATE POLICY "CV upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cv-uploads');

DROP POLICY IF EXISTS "CV delete access" ON storage.objects;
CREATE POLICY "CV delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'cv-uploads');
