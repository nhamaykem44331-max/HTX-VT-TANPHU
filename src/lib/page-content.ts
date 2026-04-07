import { timeline as defaultTimeline } from '@/data/timeline'
import { COMPANY_INFO } from '@/lib/constants'
import { createServerSupabase } from '@/lib/supabase'

export const PAGE_EDITOR_CONTENT_KEY = 'page_editor_content'

export interface EditableStatItem {
  label: string
  value: string
  color?: string
}

export interface EditableCardItem {
  title: string
  description: string
  iconKey?: string
  color?: string
}

export interface EditableTimelineItem {
  year: string
  title: string
  description: string
  milestone?: boolean
}

export interface EditableLeaderItem {
  name: string
  title: string
  bio: string
  image: string
  awards: string[]
}

export interface EditableBranchItem {
  name: string
  address: string
  phone: string
  hours: string
  mapEmbed?: string
  main?: boolean
}

export interface EditableSpecialContactItem {
  title: string
  phone: string
  subtitle: string
}

export interface PageEditorContent {
  gioiThieu: {
    bannerTitle: string
    bannerSubtitle: string
    bannerImage: string
    introTitle: string
    introParagraphs: string[]
    introImage: string
    introStats: EditableStatItem[]
    missionTitle: string
    missionCards: EditableCardItem[]
    timelineTitle: string
    timelineItems: EditableTimelineItem[]
    leadersTitle: string
    leaders: EditableLeaderItem[]
    responsibilityTitle: string
    responsibilities: EditableCardItem[]
  }
  linhVuc: {
    bannerTitle: string
    bannerSubtitle: string
    bannerImage: string
    sectionTitle: string
    sectionSubtitle: string
  }
  nangLuc: {
    bannerTitle: string
    bannerSubtitle: string
    bannerImage: string
    overviewStats: EditableStatItem[]
    equipmentTitle: string
    equipmentSubtitle: string
    certificationsTitle: string
    certificationsSubtitle: string
    certifications: string[]
  }
  tinTuc: {
    bannerTitle: string
    bannerSubtitle: string
    bannerImage: string
    categories: string[]
    listTitle: string
  }
  tuyenDung: {
    bannerTitle: string
    bannerSubtitle: string
    bannerImage: string
    benefits: EditableCardItem[]
    sectionTitle: string
    sectionSubtitle: string
    filters: string[]
    ctaTitle: string
    ctaDescription: string
    ctaEmail: string
    ctaButtonLabel: string
  }
  lienHe: {
    bannerTitle: string
    bannerSubtitle: string
    bannerImage: string
    consultationTitle: string
    consultationSubtitle: string
    quickHotlineLabel: string
    quickEmailLabel: string
    zaloUrl: string
    facebookUrl: string
    headquartersTitle: string
    headquartersAddress: string
    headquartersPhone: string
    headquartersEmail: string
    headquartersHours: string
    branches: EditableBranchItem[]
    specialContacts: EditableSpecialContactItem[]
    mapTitle: string
    mapSubtitle: string
    mapEmbed: string
  }
}

export const DEFAULT_PAGE_EDITOR_CONTENT: PageEditorContent = {
  gioiThieu: {
    bannerTitle: 'Giới thiệu HTX Tân Phú',
    bannerSubtitle: '30 năm hòa hợp cùng phát triển',
    bannerImage: '',
    introTitle: 'Giới thiệu chung',
    introParagraphs: [
      'HTX Vận tải Ô tô Tân Phú được thành lập năm 1995 tại Thái Nguyên, là một trong những hợp tác xã lớn và uy tín nhất tỉnh với hơn 30 năm xây dựng và phát triển.',
      'Từ một đơn vị vận tải nhỏ, HTX đã không ngừng mở rộng, hiện diện trong 7 lĩnh vực kinh doanh đa dạng, tạo việc làm ổn định cho hơn 150 lao động, đóng góp tích cực vào phát triển kinh tế địa phương.',
    ],
    introImage: '',
    introStats: [
      { label: 'Thành lập', value: '1995' },
      { label: 'Nhân sự', value: '150+' },
      { label: 'Kinh nghiệm', value: '30 năm' },
      { label: 'MST', value: COMPANY_INFO.taxCode },
    ],
    missionTitle: 'Sứ mệnh & Tầm nhìn',
    missionCards: [
      {
        title: 'Sứ mệnh',
        description:
          'Cung cấp dịch vụ vận tải, cẩu lắp đặt, thương mại và dịch vụ đa dạng với chất lượng cao nhất, tạo giá trị bền vững cho khách hàng, thành viên và cộng đồng.',
        iconKey: 'target',
        color: 'var(--orange)',
      },
      {
        title: 'Tầm nhìn',
        description:
          'Trở thành tập đoàn HTX đa ngành hàng đầu khu vực Đông Bắc Việt Nam vào năm 2030, với đội ngũ chuyên nghiệp và năng lực vận hành hiện đại.',
        iconKey: 'eye',
        color: 'var(--teal)',
      },
      {
        title: 'Giá trị cốt lõi',
        description:
          'Uy tín - Chuyên nghiệp - Đoàn kết - Sáng tạo - Phát triển bền vững. "Gieo Uy Tín, Gặt Thành Công" là kim chỉ nam trong mọi hoạt động.',
        iconKey: 'heart',
        color: 'var(--navy)',
      },
    ],
    timelineTitle: 'Lịch sử 30 năm phát triển',
    timelineItems: defaultTimeline.map((item) => ({
      year: item.year,
      title: item.title,
      description: item.description,
      milestone: Boolean(item.milestone),
    })),
    leadersTitle: 'Ban lãnh đạo',
    leaders: [
      {
        name: 'Nguyễn Đức Điểm',
        title: 'Giám đốc HTX',
        bio: 'Người sáng lập và dẫn dắt HTX Tân Phú qua 30 năm phát triển. Được Thủ tướng Chính phủ khen thưởng và nhiều danh hiệu doanh nhân tiêu biểu.',
        image: '',
        awards: ['Thủ tướng khen thưởng', 'Doanh nhân tiêu biểu Thái Nguyên'],
      },
      {
        name: 'Phó Giám đốc',
        title: 'Phụ trách kỹ thuật',
        bio: 'Phụ trách kỹ thuật và an toàn vận hành đội xe, cẩu. Kinh nghiệm nhiều năm trong lĩnh vực vận tải và cơ khí.',
        image: '',
        awards: ['Chiến sĩ thi đua cơ sở'],
      },
      {
        name: 'Kế toán trưởng',
        title: 'Phụ trách tài chính',
        bio: 'Quản lý tài chính, kế toán cho toàn bộ 7 lĩnh vực kinh doanh của HTX, đảm bảo minh bạch và hiệu quả vận hành.',
        image: '',
        awards: ['Lao động giỏi'],
      },
    ],
    responsibilityTitle: 'Trách nhiệm xã hội',
    responsibilities: [
      {
        title: 'Tạo việc làm',
        description:
          'Tạo việc làm ổn định cho hơn 150 lao động địa phương với thu nhập bền vững và chế độ đầy đủ.',
      },
      {
        title: 'Đóng góp ngân sách',
        description:
          'Đóng góp tích cực vào ngân sách địa phương, đồng hành cùng phát triển hạ tầng và dịch vụ công.',
      },
      {
        title: 'Hỗ trợ cộng đồng',
        description:
          'Thường xuyên tham gia hoạt động thiện nguyện, hỗ trợ hộ khó khăn và các chương trình cộng đồng.',
      },
      {
        title: 'Phát triển bền vững',
        description:
          'Đẩy mạnh quy trình thân thiện môi trường trong vận tải, cẩu lắp và nông nghiệp hữu cơ.',
      },
    ],
  },
  linhVuc: {
    bannerTitle: 'Lĩnh vực hoạt động',
    bannerSubtitle: 'Đa ngành kinh tế - Một nền tảng vững chắc',
    bannerImage: '',
    sectionTitle: 'ĐA NGÀNH, CHUYÊN NGHIỆP, UY TÍN',
    sectionSubtitle: 'HTX Tân Phú phát triển các lĩnh vực kinh doanh phục vụ mọi nhu cầu',
  },
  nangLuc: {
    bannerTitle: 'Năng lực & Thiết bị',
    bannerSubtitle: 'Cơ sở vật chất hiện đại - Đảm bảo chất lượng dịch vụ',
    bannerImage: '',
    overviewStats: [
      { value: '26+', label: 'Đầu xe tải các loại', color: 'var(--orange)' },
      { value: '9', label: 'Cần cẩu (max 330T)', color: 'var(--teal)' },
      { value: '10.000m²', label: 'Nhà xưởng & Kho bãi', color: 'var(--navy)' },
      { value: '35 tỷ', label: 'Vốn cố định', color: '#6366f1' },
    ],
    equipmentTitle: 'HỆ THỐNG THIẾT BỊ',
    equipmentSubtitle: 'Đầu tư không ngừng để đáp ứng mọi yêu cầu khách hàng',
    certificationsTitle: 'CHỨNG NHẬN & TIÊU CHUẨN',
    certificationsSubtitle: 'Hoạt động đúng pháp luật, đảm bảo an toàn tuyệt đối',
    certifications: [
      'Giấy phép kinh doanh vận tải hàng hóa hợp lệ',
      'Chứng nhận an toàn lao động cẩu lắp đặt',
      'Chứng nhận VietGAP nông nghiệp hữu cơ',
      'Đại lý vé máy bay cấp 1 được BSP cấp phép',
      'Tiêu chuẩn phòng cháy chữa cháy kho bãi',
      'Kiểm định định kỳ toàn bộ phương tiện',
    ],
  },
  tinTuc: {
    bannerTitle: 'Tin tức & Sự kiện',
    bannerSubtitle: 'Cập nhật hoạt động mới nhất của HTX Tân Phú',
    bannerImage: '',
    categories: ['Tất cả', 'Thành tích', 'Sự kiện', 'Hoạt động', 'Đầu tư', 'Công nghệ'],
    listTitle: 'TẤT CẢ TIN TỨC',
  },
  tuyenDung: {
    bannerTitle: 'Tuyển dụng',
    bannerSubtitle: 'Cùng HTX Tân Phú - Xây dựng sự nghiệp bền vững',
    bannerImage: '',
    benefits: [
      {
        title: 'Thu nhập cạnh tranh',
        description: 'Lương, thưởng và đãi ngộ hấp dẫn theo năng lực.',
        iconKey: 'briefcase',
      },
      {
        title: 'Cơ hội thăng tiến',
        description: 'Lộ trình phát triển nghề nghiệp rõ ràng.',
        iconKey: 'trending-up',
      },
      {
        title: 'Phúc lợi đầy đủ',
        description: 'BHXH, BHYT, BHTN và các chế độ theo quy định.',
        iconKey: 'shield',
      },
      {
        title: 'Đào tạo chuyên sâu',
        description: 'Được đào tạo bài bản tại chỗ để nâng cao chuyên môn.',
        iconKey: 'graduation-cap',
      },
    ],
    sectionTitle: 'VỊ TRÍ ĐANG TUYỂN',
    sectionSubtitle: 'Các vị trí đang chờ ứng viên tài năng',
    filters: [
      'Tất cả',
      'Tân Phú APG',
      'Vận tải',
      'Cẩu lắp đặt',
      'Khách sạn Phương Anh',
      'Nhà hàng & Sự kiện',
      'Kinh doanh Thép',
    ],
    ctaTitle: 'Không thấy vị trí phù hợp?',
    ctaDescription: 'Gửi CV của bạn cho chúng tôi - chúng tôi luôn tìm kiếm nhân tài xuất sắc.',
    ctaEmail: 'tuyendung@htxtanphu.com',
    ctaButtonLabel: 'Gửi CV ứng tuyển tự do',
  },
  lienHe: {
    bannerTitle: 'Liên hệ với chúng tôi',
    bannerSubtitle: 'Luôn sẵn sàng hỗ trợ bạn mọi lúc',
    bannerImage: '',
    consultationTitle: 'GỬI YÊU CẦU TƯ VẤN',
    consultationSubtitle: 'Điền thông tin và chúng tôi sẽ phản hồi trong 24 giờ làm việc',
    quickHotlineLabel: COMPANY_INFO.hotline,
    quickEmailLabel: COMPANY_INFO.email,
    zaloUrl: COMPANY_INFO.zalo,
    facebookUrl: COMPANY_INFO.facebook,
    headquartersTitle: 'Trụ sở chính',
    headquartersAddress: 'Tổ 13, Phường Cam Giá, TP. Thái Nguyên',
    headquartersPhone: COMPANY_INFO.hotline,
    headquartersEmail: COMPANY_INFO.email,
    headquartersHours: 'Thứ 2 - Thứ 7: 7:30 - 17:30',
    branches: [
      {
        name: 'Trụ sở chính - Thái Nguyên',
        address: 'Tổ 13, Phường Cam Giá, TP. Thái Nguyên',
        phone: COMPANY_INFO.hotline,
        hours: 'Thứ 2 - Thứ 7: 7:30 - 17:30',
        main: true,
        mapEmbed:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.2826804744565!2d105.83754107462296!3d21.593031980293644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135197196d76a2b%3A0xbe4f58c5e0f7b22c!2sCam%20Gi%C3%A1%2C%20Th%C3%A0nh%20ph%E1%BB%91%20Th%C3%A1i%20Nguy%C3%AAn%2C%20Th%C3%A1i%20Nguy%C3%AAn!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn',
      },
      {
        name: 'Chi nhánh Hà Nội',
        address: 'Sóc Sơn, Hà Nội',
        phone: COMPANY_INFO.hotline,
        hours: 'Thứ 2 - Thứ 7: 8:00 - 17:00',
      },
      {
        name: 'Chi nhánh Vĩnh Phúc',
        address: 'Phúc Yên, Vĩnh Phúc',
        phone: COMPANY_INFO.hotline,
        hours: 'Thứ 2 - Thứ 7: 8:00 - 17:00',
      },
      {
        name: 'Chi nhánh Hòa Bình',
        address: 'Hòa Bình',
        phone: COMPANY_INFO.hotline,
        hours: 'Thứ 2 - Thứ 7: 8:00 - 17:00',
      },
    ],
    specialContacts: [
      {
        title: 'Đặt phòng Phương Anh',
        phone: '0839.881.881',
        subtitle: '345 Thống Nhất, Tích Lương, Thái Nguyên',
      },
      {
        title: 'Wonderland Nha Trang',
        phone: '0258.3551.999',
        subtitle: 'Lô 10-11 Phạm Văn Đồng, Nha Trang',
      },
    ],
    mapTitle: 'VỊ TRÍ TRÊN BẢN ĐỒ',
    mapSubtitle: 'Trụ sở chính tại TP. Thái Nguyên',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.2826804744565!2d105.83754107462296!3d21.593031980293644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135197196d76a2b%3A0xbe4f58c5e0f7b22c!2sCam%20Gi%C3%A1%2C%20Th%C3%A0nh%20ph%E1%BB%91%20Th%C3%A1i%20Nguy%C3%AAn%2C%20Th%C3%A1i%20Nguy%C3%AAn!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn',
  },
}

function cloneDefaultContent(): PageEditorContent {
  return JSON.parse(JSON.stringify(DEFAULT_PAGE_EDITOR_CONTENT))
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepMerge<T>(base: T, overrides: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return (overrides as T) ?? base
  }

  const result: Record<string, unknown> = { ...base }

  for (const [key, value] of Object.entries(overrides)) {
    const currentValue = result[key]
    if (Array.isArray(value)) {
      result[key] = value
      continue
    }

    if (isPlainObject(currentValue) && isPlainObject(value)) {
      result[key] = deepMerge(currentValue, value)
      continue
    }

    result[key] = value
  }

  return result as T
}

export async function getPageEditorContent(): Promise<PageEditorContent> {
  const supabase = createServerSupabase()

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', PAGE_EDITOR_CONTENT_KEY)
      .maybeSingle()

    if (error || !data?.value) {
      throw new Error('fallback')
    }

    return deepMerge(cloneDefaultContent(), data.value)
  } catch {
    return cloneDefaultContent()
  }
}
