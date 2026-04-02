-- ============================================================
-- HTX Tân Phú — Supabase Database Schema
-- Chạy script này trong Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tin tức
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Tin tức',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  author TEXT NOT NULL DEFAULT 'Ban Biên tập',
  read_time INTEGER NOT NULL DEFAULT 3,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tuyển dụng
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Thái Nguyên',
  type TEXT NOT NULL DEFAULT 'full-time' CHECK (type IN ('full-time', 'part-time', 'contract')),
  deadline DATE NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  field_id TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Đối tác
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT DEFAULT '',
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Giải thưởng
CREATE TABLE awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  year TEXT NOT NULL,
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Form liên hệ
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Cài đặt website
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_date ON news(date DESC);
CREATE INDEX idx_news_published ON news(published);
CREATE INDEX idx_jobs_published ON jobs(published);
CREATE INDEX idx_contact_status ON contact_submissions(status);

-- ============================================================
-- Auto updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER news_updated BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER jobs_updated BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 7. Homepage Sections
-- ============================================================
CREATE TABLE homepage_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng hero slides
CREATE TABLE hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  cta_text TEXT DEFAULT 'Khám phá dịch vụ',
  cta_link TEXT DEFAULT '/linh-vuc',
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng key figures (con số biết nói)
CREATE TABLE key_figures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  suffix TEXT DEFAULT '',
  prefix TEXT DEFAULT '',
  icon TEXT DEFAULT 'chart',
  sort_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true
);

-- Seed data mặc định cho homepage_sections
INSERT INTO homepage_sections (id, title, subtitle, enabled, sort_order) VALUES
  ('hero', 'Hero Banner', 'Banner chính trang chủ', true, 1),
  ('fields', 'Lĩnh vực hoạt động', '7 lĩnh vực kinh doanh đa dạng', true, 2),
  ('key_figures', 'Con số biết nói', '30 năm tích lũy', true, 3),
  ('equipment', 'Năng lực và thiết bị', 'Hệ thống hiện đại', true, 4),
  ('news', 'Tin tức & Sự kiện', 'Cập nhật mới nhất', true, 5),
  ('awards', 'Thành tích nổi bật', 'Giải thưởng và vinh danh', true, 6),
  ('partners', 'Đối tác tin cậy', 'Hợp tác cùng phát triển', true, 7),
  ('cta', 'Liên hệ ngay', 'Sẵn sàng phục vụ', true, 8)
ON CONFLICT (id) DO NOTHING;

-- Seed hero slides mặc định
INSERT INTO hero_slides (title, subtitle, description, sort_order) VALUES
  ('30 NĂM HÒA HỢP\nCÙNG PHÁT TRIỂN', 'HTX Vận tải Ô tô Tân Phú', 'Đa ngành, Chuyên nghiệp, Uy tín', 1),
  ('NĂNG LỰC CẨU LẮP\nHÀNG ĐẦU KHU VỰC', 'Cần cẩu 330 tấn', '9 cần cẩu từ 20 đến 330 tấn', 2),
  ('KHÁCH SẠN PHƯƠNG ANH\n41 PHÒNG TIÊU CHUẨN', 'Số 345 Thống Nhất, Tích Lương', 'Không gian thoáng đãng, Dịch vụ tận tâm', 3),
  ('NÔNG NGHIỆP SẠCH\nHỮU CƠ VIETGAP', 'Nông nghiệp hữu cơ VietGAP', '2ha rau sạch không hóa chất', 4);

-- Seed key figures mặc định
INSERT INTO key_figures (label, value, suffix, prefix, icon, sort_order) VALUES
  ('Năm hoạt động', 30, '+', '', 'calendar', 1),
  ('Cán bộ nhân viên', 150, '+', '', 'users', 2),
  ('Đầu xe các loại', 40, '', '', 'truck', 3),
  ('Cần cẩu (max 330 tấn)', 9, '', '', 'crane', 4),
  ('Nhà xưởng & Kho bãi', 10000, 'm²', '', 'warehouse', 5),
  ('Doanh thu/năm (tỷ đồng)', 2990, '', '~', 'chart', 6);

CREATE INDEX idx_hero_slides_order ON hero_slides(sort_order);
CREATE INDEX idx_key_figures_order ON key_figures(sort_order);

-- Bảng Lĩnh vực (Fields)
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    stats JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    services JSONB DEFAULT '[]'::jsonb,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data for Fields
INSERT INTO public.fields (slug, name, icon, short_desc, description, image, stats, features, services, sort_order) VALUES
('van-tai', 'Vận tải hàng hóa', 'Truck', '26 xe tải 1.5–40 tấn, phạm vi toàn quốc', 'Dịch vụ vận tải hàng hóa chuyên nghiệp với đội xe đa dạng từ 1.5 đến 40 tấn. Trang bị GPS Vietmap, đảm bảo hàng hóa an toàn, đúng hẹn trên toàn quốc.', '/images/fields/van-tai.jpg', '[{"label": "Xe tải các loại", "value": "26 xe"}, {"label": "Tải trọng", "value": "1.5–40 tấn"}, {"label": "Xe khách", "value": "5 xe 29 chỗ"}, {"label": "Phạm vi", "value": "Toàn quốc"}]', '["GPS Vietmap theo dõi 24/7", "Tài xế được đào tạo chuyên nghiệp", "Bảo hiểm hàng hóa đầy đủ", "Hệ thống điều phối xe tự động", "Kết nối liên tỉnh Bắc–Trung–Nam"]', '["Vận chuyển hàng nguyên xe", "Vận chuyển hàng lẻ (LTL)", "Xe khách hợp đồng 29 chỗ", "Vận chuyển hàng công nghiệp nặng", "Logistics kho vận"]', 1),
('cau-lap-dat', 'Cẩu lắp đặt', 'Crane', '9 cần cẩu 20–330 tấn, lắp đặt thiết bị công nghiệp', 'Dịch vụ cẩu và lắp đặt thiết bị công nghiệp với 9 cần cẩu từ 20 đến 330 tấn — lớn nhất khu vực. Đội ngũ kỹ thuật giàu kinh nghiệm, an toàn tuyệt đối.', '/images/fields/cau-lap-dat.jpg', '[{"label": "Cần cẩu", "value": "9 chiếc"}, {"label": "Sức nâng", "value": "20–330 tấn"}, {"label": "Cẩu lớn nhất", "value": "330 tấn"}, {"label": "Kinh nghiệm", "value": "20+ năm"}]', '["Cần cẩu 330 tấn lớn nhất khu vực", "Đội kỹ thuật được chứng nhận an toàn", "Thiết bị hiện đại, bảo trì định kỳ", "Tư vấn phương án thi công tối ưu", "Hỗ trợ 24/7 cho các dự án khẩn cấp"]', '["Lắp đặt thiết bị nhà máy công nghiệp", "Cẩu hạ thủy công trình", "Vận chuyển thiết bị siêu trường", "Lắp đặt kết cấu thép", "Tư vấn giải pháp cẩu lắp"]', 2),
('kinh-doanh-thep', 'Kinh doanh thép', 'Factory', '200.000 tấn/năm, đối tác Hòa Phát', 'Đại lý phân phối thép Hòa Phát uy tín với sản lượng 200.000 tấn/năm. Hệ thống kho bãi hiện đại tại Yên Bình và Tích Lương, giao hàng nhanh toàn vùng.', '/images/fields/kinh-doanh-thep.jpg', '[{"label": "Sản lượng/năm", "value": "200.000 tấn"}, {"label": "Đối tác", "value": "Hòa Phát"}, {"label": "Kho bãi", "value": "Yên Bình + Tích Lương"}, {"label": "Diện tích kho", "value": "10.000 m²"}]', '["Đại lý chính thức thép Hòa Phát", "Kho bãi 10.000m² hiện đại", "Giá cạnh tranh, cập nhật thị trường", "Vận chuyển nhanh, đúng hẹn", "Hỗ trợ tín dụng linh hoạt"]', '["Thép xây dựng Hòa Phát", "Thép cuộn, thép cây", "Thép hình các loại", "Tôn lợp, tôn mạ kẽm", "Tư vấn vật liệu cho công trình"]', 3),
('khach-san-phuong-anh', 'Khách sạn Phương Anh', 'Hotel', '41 phòng, Số 345 Thống Nhất, Tích Lương', 'Khách sạn Phương Anh 3 sao với 41 phòng tiện nghi hiện đại tại trung tâm Thái Nguyên. Không gian thoáng đãng, dịch vụ chuyên nghiệp, giá cả hợp lý.', '/images/fields/khach-san.jpg', '[{"label": "Số phòng", "value": "41 phòng"}, {"label": "Hạng sao", "value": "3 sao"}, {"label": "Điện thoại", "value": "0839.881.881"}, {"label": "Địa chỉ", "value": "345 Thống Nhất"}]', '["41 phòng tiêu chuẩn và phòng VIP", "Wifi miễn phí tốc độ cao", "Bãi đỗ xe rộng rãi, miễn phí", "Nhà hàng phục vụ 3 bữa/ngày", "Phòng hội nghị sức chứa 200 khách"]', '["Phòng nghỉ ngắn hạn, dài hạn", "Tổ chức hội nghị, hội thảo", "Tiệc cưới, sinh nhật", "Dịch vụ đưa đón sân bay", "Đặt phòng theo nhóm, đoàn"]', 4),
('nha-hang-su-kien', 'Nhà hàng & Sự kiện', 'UtensilsCrossed', '~10 sự kiện/tuần, tiệc cưới, hội nghị', 'Dịch vụ nhà hàng và tổ chức sự kiện chuyên nghiệp. Trung bình 10 sự kiện mỗi tuần bao gồm tiệc cưới, hội nghị, sinh nhật, liên hoan, với đội ngũ đầu bếp giàu kinh nghiệm.', '/images/fields/nha-hang.jpg', '[{"label": "Sự kiện/tuần", "value": "~10"}, {"label": "Sức chứa", "value": "200+ khách"}, {"label": "Menu đa dạng", "value": "100+ món"}, {"label": "Kinh nghiệm", "value": "15+ năm"}]', '["Đội ngũ đầu bếp 5 sao giàu kinh nghiệm", "Thiết kế tiệc theo yêu cầu riêng", "Hệ thống âm thanh, ánh sáng chuyên nghiệp", "MC, DJ, ban nhạc theo yêu cầu", "Photobooth, trang trí bàn tiệc"]', '["Tiệc cưới trọn gói", "Hội nghị, sự kiện doanh nghiệp", "Tiệc sinh nhật, kỷ niệm", "Buffet theo nhóm", "Catering phục vụ tận nơi"]', 5),
('ve-may-bay', 'Đại lý vé máy bay', 'Plane', 'GDS Amadeus, website book.tanphuapg.com', 'Tân Phú APG — đại lý vé máy bay cấp 1 chính thức tại Thái Nguyên. Kết nối hệ thống GDS Amadeus toàn cầu, hỗ trợ đặt vé nội địa và quốc tế nhanh chóng.', '/images/fields/ve-may-bay.jpg', '[{"label": "Cấp đại lý", "value": "Cấp 1"}, {"label": "Hệ thống GDS", "value": "Amadeus"}, {"label": "Hãng hợp tác", "value": "10+ hãng"}, {"label": "Website đặt vé", "value": "book.tanphuapg.com"}]', '["Đại lý cấp 1 Vietjet Air chính thức", "Kết nối GDS Amadeus toàn cầu", "Đặt vé online 24/7 tại book.tanphuapg.com", "Hỗ trợ visa, hành lý, suất ăn", "Giá vé tốt nhất, không phụ thu"]', '["Vé máy bay nội địa", "Vé máy bay quốc tế", "Gói du lịch trọn gói", "Visa các nước", "Bảo hiểm du lịch"]', 6),
('nong-nghiep', 'Nông nghiệp hữu cơ', 'Leaf', '2ha rau sạch hữu cơ, VietGAP', 'Trang trại nông nghiệp hữu cơ 2ha ứng dụng công nghệ canh tác tiên tiến, không sử dụng thuốc trừ sâu hóa học. Rau sạch đạt chuẩn VietGAP cung cấp cho hệ thống nhà hàng và thị trường.', '/images/fields/nong-nghiep.jpg', '[{"label": "Diện tích", "value": "2 ha"}, {"label": "Tiêu chuẩn", "value": "VietGAP"}, {"label": "Sản phẩm", "value": "20+ loại rau"}, {"label": "Phương pháp", "value": "Hữu cơ"}]', '["Canh tác hữu cơ 100%, không hóa chất", "Đạt chứng nhận VietGAP", "Hệ thống tưới nhỏ giọt tự động", "Nhà kính hiện đại, kiểm soát dịch hại tự nhiên", "Truy xuất nguồn gốc minh bạch"]', '["Rau củ sạch theo mùa", "Giao rau tận nhà, tận quầy", "Cung ứng cho nhà hàng, bếp ăn", "Rau theo hợp đồng", "Tham quan, trải nghiệm nông trại"]', 7),
('wonderland', 'Wonderland Nha Trang', 'Building2', 'Lô 10-11 Phạm Văn Đồng, Nha Trang', 'Wonderland Nha Trang Hotel — khách sạn nghỉ dưỡng biển tại vị trí đắc địa đường Phạm Văn Đồng, Nha Trang. Trải nghiệm nghỉ dưỡng cao cấp bên bờ biển xanh.', '/images/fields/wonderland.jpg', '[{"label": "Địa chỉ", "value": "Lô 10-11 Phạm Văn Đồng"}, {"label": "Thành phố", "value": "Nha Trang"}, {"label": "Điện thoại", "value": "0258.3551.999"}, {"label": "Phong cách", "value": "Resort biển"}]', '["Vị trí đắc địa mặt biển Phạm Văn Đồng", "Hồ bơi view biển panorama", "Nhà hàng hải sản tươi sống", "Spa và khu thư giãn", "Dịch vụ đưa đón sân bay Cam Ranh"]', '["Phòng nghỉ view biển", "Gói nghỉ dưỡng cuối tuần", "Honeymoon package", "Ăn sáng buffet included", "Tour tham quan vịnh Nha Trang"]', 8)
ON CONFLICT (slug) DO NOTHING;

-- Bảng Thiết bị (Equipments)
CREATE TABLE IF NOT EXISTS public.equipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data for Equipments
INSERT INTO public.equipments (name, category, description, sort_order) VALUES
('Xe tải 40 tấn Hyundai', 'Xe tải', 'Trọng tải 40 tấn, trang bị GPS Vietmap', 1),
('Xe tải 20 tấn', 'Xe tải', 'Đội xe 26 chiếc phủ khắp cả nước', 2),
('Xe khách 29 chỗ', 'Xe tải', '5 xe khách phục vụ hợp đồng', 3),
('Cần cẩu 330 tấn', 'Cần cẩu', 'Cẩu lớn nhất khu vực Đông Bắc', 4),
('Cần cẩu 100 tấn', 'Cần cẩu', 'Linh hoạt trong các công trình vừa', 5),
('Cần cẩu 50 tấn', 'Cần cẩu', 'Lắp đặt thiết bị công nghiệp nhẹ', 6),
('Kho bãi Yên Bình', 'Kho bãi', '5.000m² kho chứa thép hiện đại', 7),
('Kho bãi Tích Lương', 'Kho bãi', 'Kho phân phối hàng trung chuyển', 8),
('Hệ thống GPS Vietmap', 'Công nghệ', 'Theo dõi đội xe thời gian thực', 9),
('Phần mềm Skyhotel PMS', 'Công nghệ', 'Quản lý khách sạn chuyên nghiệp', 10),
('GDS Amadeus', 'Công nghệ', 'Hệ thống đặt vé toàn cầu', 11),
('Base.vn HRM/CRM', 'Công nghệ', 'Quản lý nhân sự và khách hàng', 12);
