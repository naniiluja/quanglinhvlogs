// Nguồn duy nhất cho nội dung thiệp (architecture.md). Giá trị mock gắn chú thích MOCK để grep.
// Giờ luôn viết dạng ISO có +07:00 (Việt Nam không có giờ mùa hè).
// Thông tin hai họ, ngày giờ, địa chỉ lấy từ bản in thiệp giấy chủ dự án gửi ngày 2026-11-23.

// Bên mời: khách nhà trai dự lễ thành hôn 12/12, khách nhà gái dự lễ vu quy 11/12.
export type Side = 'groom' | 'bride'

export interface Person {
  name: string
  fullName: string
  role: string
  photo: { src: string; width: number; height: number }
  bio: string
}

export interface SideInfo {
  side: Side
  hostLabel: string
  father: string
  mother: string
  // Địa chỉ sau sáp nhập hành chính và địa chỉ cũ trong ngoặc, đúng như thiệp in.
  address: string
  oldAddress: string
  childLabel: string
  ceremony: { title: string; startsAt: string; lunarNote: string }
  party: { title: string; startsAt: string }
  venue: {
    name: string
    fullAddress: string
    fullOldAddress: string
    // Truy vấn Google Maps (tên nơi, hoặc tọa độ "vĩ độ,kinh độ" khi có ghim chính xác).
    // Google chưa biết số nhà ở đây, còn "Thôn 2/Thôn 4" trùng với nơi khác nên bị trỏ nhầm (2026-11-23).
    mapsQuery: string
  }
}

export interface Photo {
  src: string
  // Bản nhỏ cho tường ảnh (điện thoại không phải tải 30 ảnh lớn); không có thì dùng src.
  thumb?: string
  width: number
  height: number
  alt: string
}

// Ảnh cưới đã nén: bản lớn cạnh dài 1000px (xem phóng to), bản nhỏ cạnh dài 420px (tường ảnh).
function weddingPhoto(id: string, shape: 'portrait' | 'landscape', alt: string): Photo {
  const [width, height] = shape === 'portrait' ? [665, 1000] : [1000, 665]
  return {
    src: `/images/gallery/full/${id}.jpg`,
    thumb: `/images/gallery/thumb/${id}.jpg`,
    width,
    height,
    alt,
  }
}

export interface GiftAccount {
  label: string
  bankBin: string
  bankName: string
  accountNumber: string
  accountName: string
}

export interface WeddingConfig {
  groom: Person
  bride: Person
  sides: Record<Side, SideInfo>
  invitationLines: string[]
  // Mặt sau tấm bưu thiếp trên bìa (lật ảnh bìa để xem): lời tâm sự của hai người.
  coverNote: { title: string; body: string }
  // Các đêm khách đăng ký lưu trú chọn được (DB chỉ nhận ngày trong tháng 12/2026).
  lodgingNights: { date: string; label: string }[]
  gallery: Photo[]
  // Chủ dự án chốt 2026-09-24: hộp mừng cưới chỉ một mã QR.
  giftAccount: GiftAccount
  music: { src: string }
}

export const WEDDING: WeddingConfig = {
  groom: {
    name: 'Quang Linh',
    fullName: 'Vũ Quang Linh',
    role: 'Chú rể',
    photo: { src: '/images/groom.jpg', width: 300, height: 300 },
    bio: 'Người hay cười, thích những chuyến đi xa và luôn để dành phần ngon nhất cho người mình thương.', // MOCK
  },
  bride: {
    name: 'Thanh Trúc',
    fullName: 'Đào Thanh Trúc',
    role: 'Cô dâu',
    photo: { src: '/images/bride.jpg', width: 300, height: 300 },
    bio: 'Dịu dàng, yêu hoa và những buổi chiều yên bình, tin rằng hạnh phúc nằm trong những điều giản dị.', // MOCK
  },
  sides: {
    groom: {
      side: 'groom',
      hostLabel: 'Nhà trai',
      father: 'Ông Vũ Quang Minh',
      mother: 'Bà Trần Thị Thúy Nga',
      address: '158 Buôn Cư D’Luê, X. Hòa Phú',
      oldAddress: 'Thôn 4, X. Hòa Xuân cũ',
      childLabel: 'Quý nam',
      ceremony: {
        title: 'Lễ thành hôn',
        startsAt: '2026-12-12T09:00:00+07:00',
        lunarNote: 'Nhằm ngày 04 tháng 11 năm Bính Ngọ',
      },
      party: { title: 'Tiệc rượu chung vui', startsAt: '2026-12-12T11:00:00+07:00' },
      venue: {
        name: 'Tư gia nhà trai',
        fullAddress: '158 Buôn Cư D’Luê, Xã Hòa Phú, Tỉnh Đắk Lắk',
        fullOldAddress: '158 Thôn 4, X. Hòa Xuân, TP. Buôn Ma Thuột, T. Đắk Lắk cũ',
        mapsQuery: 'Buôn Cư D’Luê, Hòa Xuân, Hòa Phú, Đắk Lắk', // MOCK: đúng khu buôn, chờ ghim nhà
      },
    },
    bride: {
      side: 'bride',
      hostLabel: 'Nhà gái',
      father: 'Ông Đào Xuân Định',
      mother: 'Bà Lê Thị Vân',
      address: '131 Thôn Hòa Xuân, X. Hòa Phú',
      oldAddress: 'Thôn 2, X. Hòa Xuân cũ',
      childLabel: 'Trưởng nữ',
      ceremony: {
        title: 'Lễ vu quy',
        startsAt: '2026-12-11T09:00:00+07:00',
        lunarNote: 'Nhằm ngày 03 tháng 11 năm Bính Ngọ',
      },
      party: { title: 'Tiệc rượu chung vui', startsAt: '2026-12-11T11:00:00+07:00' },
      venue: {
        name: 'Tư gia nhà gái',
        fullAddress: '131 Thôn Hòa Xuân, Xã Hòa Phú, Tỉnh Đắk Lắk',
        fullOldAddress: '131 Thôn 2, X. Hòa Xuân, TP. Buôn Ma Thuột, T. Đắk Lắk cũ',
        mapsQuery: 'UBND xã Hòa Xuân, Buôn Ma Thuột, Đắk Lắk', // MOCK: chỉ đúng xã, chờ ghim nhà
      },
    },
  },
  // 14 năm là thông tin thật từ chủ dự án (2026-09-24); câu chữ là bản nháp, chờ chủ dự án duyệt.
  coverNote: {
    title: '14 năm thương nhau',
    body: 'Mười bốn năm nắm tay nhau đi qua bao mùa hoa nở rồi tàn. Giờ tụi mình viết tiếp chương đẹp nhất, và mong có bạn ở đó.',
  },
  invitationLines: [
    'Từ một cơ duyên nhỏ, hai đứa mình đã tìm thấy nhau.',
    'Và giờ đây, tụi mình muốn nắm tay nhau đi tiếp chặng đường dài phía trước.',
    'Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi.',
  ],
  lodgingNights: [
    { date: '2026-12-10', label: 'Đêm 10/12' },
    { date: '2026-12-11', label: 'Đêm 11/12' },
    { date: '2026-12-12', label: 'Đêm 12/12' },
  ],
  // 30 ảnh hoàn chỉnh (thư mục "hinh xong" trên Drive, chủ dự án gửi 2026-11-23), xếp xen kẽ sáu bộ
  // ảnh để tường ảnh không liền một màu; ba ảnh dạm ngõ ở cuối.
  gallery: [
    weddingPhoto(
      '4438',
      'portrait',
      'Quang Linh vest đen khoác tay Thanh Trúc giữa vòm hoa trắng và đèn chùm',
    ),
    weddingPhoto(
      '4705',
      'portrait',
      'Quang Linh và Thanh Trúc mỉm cười trên nền xám, cô dâu cầm bó hoa loa kèn',
    ),
    weddingPhoto('4890', 'portrait', 'Cô dâu chú rể áo cưới đỏ truyền thống bên chữ song hỷ'),
    weddingPhoto(
      '5063',
      'portrait',
      'Quang Linh vest trắng nắm tay Thanh Trúc đang giơ cao bó hoa giữa phòng hoa trắng',
    ),
    weddingPhoto('5211', 'portrait', 'Cô dâu ôm cổ chú rể từ phía sau, ngoài trời bên xe cổ'),
    weddingPhoto('5319', 'portrait', 'Chú rể bế cô dâu phía sau thảm hoa khô màu cam'),
    weddingPhoto('4460', 'portrait', 'Chú rể nhìn cô dâu cười, cô dâu cầm bó hoa loa kèn'),
    weddingPhoto('4695', 'portrait', 'Chú rể ôm cô dâu từ phía sau trên nền xám'),
    weddingPhoto('4957', 'portrait', 'Chú rể và cô dâu áo đỏ đeo kính râm ngồi tạo dáng vui nhộn'),
    weddingPhoto('5096', 'portrait', 'Chú rể vest trắng nắm tay cô dâu bước đi'),
    weddingPhoto('5135', 'portrait', 'Hai người giữa vườn cây xanh bên chiếc xe cổ'),
    weddingPhoto('5302', 'portrait', 'Chú rể và cô dâu đứng sau thảm hoa khô màu cam'),
    weddingPhoto('4392', 'portrait', 'Chú rể và cô dâu nắm tay dưới đèn chùm, nền rèm kem'),
    weddingPhoto('4674', 'portrait', 'Cô dâu cầm bó hoa, khăn voan dài buông xuống'),
    weddingPhoto('4806', 'landscape', 'Hai người trong áo cưới đỏ thêu rồng phượng'),
    weddingPhoto('5111', 'portrait', 'Chú rể vest trắng và cô dâu cười bên khung cửa sổ đầy hoa'),
    weddingPhoto('5201', 'portrait', 'Chú rể ngồi, cô dâu ôm bó hoa bên xe cổ'),
    weddingPhoto('5344', 'portrait', 'Chú rể vest trắng nắm tay cô dâu bên hoa khô'),
    weddingPhoto('4498', 'landscape', 'Cận cảnh bó hoa loa kèn trong tay cô dâu bên chú rể'),
    weddingPhoto('4721', 'portrait', 'Hai người cười tươi, cô dâu ôm bó hoa trước ngực'),
    weddingPhoto('4988', 'portrait', 'Chú rể và cô dâu áo đỏ đeo kính râm cười đùa'),
    weddingPhoto('5233', 'portrait', 'Hai người đứng giữa hàng cây tùng và hoa'),
    weddingPhoto('5323', 'landscape', 'Hai người nắm tay giữa thảm hoa khô'),
    weddingPhoto('4492', 'portrait', 'Hai người đứng giữa vòm hoa trắng, nền rèm kem'),
    weddingPhoto('4648', 'portrait', 'Cô dâu trong váy cưới xòe trên nền xám'),
    weddingPhoto('4981', 'portrait', 'Hai người áo đỏ đeo kính râm nghiêng đầu vào nhau'),
    weddingPhoto('5154', 'portrait', 'Cô dâu ngồi trên cỏ, chú rể đứng cạnh xe cổ'),
    weddingPhoto('4633', 'portrait', 'Chân dung chú rể vest đen cầm bó hoa'),
    weddingPhoto('4739', 'portrait', 'Chú rể cầm hoa, cô dâu tựa vai chú rể'),
    weddingPhoto('4588', 'portrait', 'Chú rể và cô dâu tạo dáng bên vòm hoa trắng'),
    {
      src: '/images/gallery/couple.jpg',
      width: 580,
      height: 604,
      alt: 'Quang Linh và Thanh Trúc cười bên nhau cùng bó hoa hồng',
    },
    {
      src: '/images/gallery/bouquet.jpg',
      width: 410,
      height: 480,
      alt: 'Hai bàn tay cùng giữ bó hoa hồng phấn',
    },
    {
      src: '/images/gallery/flowers.jpg',
      width: 450,
      height: 600,
      alt: 'Bàn hoa lễ với hoa hồng, đồng tiền và chữ song hỷ',
    },
  ],
  // Số tài khoản giả, KHÔNG phải tài khoản thật (repo công khai, product.md).
  giftAccount: {
    label: 'Mừng cưới cô dâu chú rể',
    bankBin: '970436', // MOCK
    bankName: 'Vietcombank', // MOCK
    accountNumber: '0123456789', // MOCK
    accountName: 'PHAM QUANG LINH', // MOCK
  },
  // Chủ dự án chọn 2026-09-24 và tự cung cấp file; bài có bản quyền nên file bị .gitignore, chỉ có trong
  // bản deploy từ máy chủ dự án. Máy thiếu file thì đổi lại '/audio/canon-in-d.m4a' (public domain).
  music: { src: '/audio/noi-nay-co-anh.m4a' },
}
