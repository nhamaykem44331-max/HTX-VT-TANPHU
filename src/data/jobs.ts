import type { Job } from "@/lib/types";

export const jobs: Job[] = [
  {
    id: "1",
    title: "Nhân viên Kinh doanh Vé máy bay",
    department: "Tân Phú APG",
    location: "Thái Nguyên",
    type: "full-time",
    deadline: "2026-02-28",
    fieldId: "ve-may-bay",
    description:
      "Tìm kiếm, tư vấn và chốt đơn vé máy bay cho khách hàng cá nhân và doanh nghiệp. Hỗ trợ khách hàng về thủ tục, hành lý và các dịch vụ liên quan.",
    requirements: [
      "Tốt nghiệp THPT trở lên",
      "Giao tiếp tốt, nhanh nhẹn",
      "Kỹ năng sử dụng máy tính văn phòng",
      "Ưu tiên có kinh nghiệm ngành du lịch, hàng không",
    ],
    benefits: [
      "Lương cơ bản 7–12 triệu + hoa hồng không giới hạn",
      "Được đào tạo GDS Amadeus chuyên nghiệp",
      "BHXH, BHYT đầy đủ",
      "Môi trường năng động, thân thiện",
    ],
  },
  {
    id: "2",
    title: "Tài xế xe tải hạng nặng",
    department: "Vận tải",
    location: "Thái Nguyên",
    type: "full-time",
    deadline: "2026-03-15",
    fieldId: "van-tai",
    description:
      "Lái xe tải các loại từ 5 đến 40 tấn, vận chuyển hàng hóa nội địa theo tuyến. Đảm bảo an toàn hàng hóa và tuân thủ quy định pháp luật giao thông.",
    requirements: [
      "Bằng lái xe hạng C, D hoặc E còn hiệu lực",
      "Kinh nghiệm lái xe tải từ 2 năm trở lên",
      "Sức khỏe tốt, không có tiền sử vi phạm nghiêm trọng",
      "Trung thực, chịu khó, có trách nhiệm",
    ],
    benefits: [
      "Lương 12–20 triệu + phụ cấp tuyến",
      "Phụ cấp xa nhà, ăn uống",
      "BHXH, BHYT, BHTN đầy đủ",
      "Được hỗ trợ nơi ở tại kho bãi",
    ],
  },
  {
    id: "3",
    title: "Kỹ thuật viên Cẩu",
    department: "Cẩu lắp đặt",
    location: "Thái Nguyên",
    type: "full-time",
    deadline: "2026-02-15",
    fieldId: "cau-lap-dat",
    description:
      "Vận hành cần cẩu các tải trọng từ 20 đến 330 tấn. Thực hiện lắp đặt thiết bị công nghiệp theo chỉ đạo kỹ thuật. Bảo trì và kiểm tra thiết bị định kỳ.",
    requirements: [
      "Bằng chứng chỉ vận hành cẩu còn hiệu lực",
      "Kinh nghiệm vận hành cẩu ít nhất 3 năm",
      "Hiểu biết về an toàn lao động trong công tác cẩu lắp",
      "Có khả năng đọc hiểu bản vẽ kỹ thuật",
    ],
    benefits: [
      "Lương 15–25 triệu + phụ cấp công trình",
      "Trang bị bảo hộ lao động đầy đủ",
      "BHXH, BHYT, BHTN theo quy định",
      "Cơ hội đào tạo nâng cấp chứng chỉ",
    ],
  },
  {
    id: "4",
    title: "Nhân viên Lễ tân Khách sạn",
    department: "Khách sạn Phương Anh",
    location: "Thái Nguyên",
    type: "full-time",
    deadline: "2026-03-31",
    fieldId: "khach-san-phuong-anh",
    description:
      "Tiếp đón, check-in/check-out khách lưu trú. Tư vấn dịch vụ và giải đáp thắc mắc của khách. Phối hợp với các bộ phận để đảm bảo trải nghiệm khách hàng tốt nhất.",
    requirements: [
      "Tốt nghiệp cao đẳng/đại học chuyên ngành khách sạn du lịch",
      "Ngoại hình dễ nhìn, giao tiếp tốt",
      "Tiếng Anh giao tiếp cơ bản",
      "Có kinh nghiệm làm lễ tân khách sạn là lợi thế",
    ],
    benefits: [
      "Lương 7–10 triệu + tip",
      "Đồng phục, bữa ăn ca miễn phí",
      "BHXH, BHYT đầy đủ",
      "Cơ hội thăng tiến lên giám sát, trưởng ca",
    ],
  },
  {
    id: "5",
    title: "Đầu bếp nhà hàng",
    department: "Nhà hàng & Sự kiện",
    location: "Thái Nguyên",
    type: "full-time",
    deadline: "2026-03-15",
    fieldId: "nha-hang-su-kien",
    description:
      "Chế biến các món ăn Á, Âu theo thực đơn nhà hàng và tiệc sự kiện. Đảm bảo chất lượng, an toàn vệ sinh thực phẩm và sáng tạo menu mới theo mùa.",
    requirements: [
      "Có chứng chỉ nấu ăn hoặc kinh nghiệm thực tế",
      "Tối thiểu 3 năm kinh nghiệm tại nhà hàng, khách sạn",
      "Kỹ năng chế biến ẩm thực Việt và một số món Á Âu",
      "Sáng tạo, có kiến thức về an toàn thực phẩm",
    ],
    benefits: [
      "Lương 10–18 triệu tùy năng lực",
      "Bữa ăn ca, đồng phục bếp miễn phí",
      "Môi trường chuyên nghiệp, bếp hiện đại",
      "Bonus sự kiện theo doanh thu",
    ],
  },
  {
    id: "6",
    title: "Nhân viên Kinh doanh Thép",
    department: "Kinh doanh Thép",
    location: "Thái Nguyên / Hà Nội",
    type: "full-time",
    deadline: "2026-04-01",
    fieldId: "kinh-doanh-thep",
    description:
      "Phát triển khách hàng mới và chăm sóc khách hàng cũ trong lĩnh vực kinh doanh thép xây dựng. Lập báo giá, theo dõi đơn hàng và phối hợp giao hàng.",
    requirements: [
      "Tốt nghiệp đại học chuyên ngành kinh tế, xây dựng hoặc liên quan",
      "Có mạng lưới quan hệ trong ngành xây dựng là lợi thế",
      "Kỹ năng đàm phán, thuyết trình tốt",
      "Sẵn sàng đi công tác tỉnh thành",
    ],
    benefits: [
      "Lương cơ bản 8–15 triệu + hoa hồng cao",
      "Chi phí đi lại, công tác phí",
      "BHXH đầy đủ, thưởng doanh số cuối năm",
      "Xe máy hỗ trợ đi lại nội địa",
    ],
  },
];

export const getJobsByField = (fieldId: string) =>
  jobs.filter((j) => j.fieldId === fieldId);

export const getAllJobs = () => jobs;
