// Nguồn duy nhất cho nội dung thiệp (architecture.md). Giá trị mock gắn chú thích MOCK để grep.
// Giờ luôn viết dạng ISO có +07:00 (Việt Nam không có giờ mùa hè).

export interface Person {
  name: string
  role: string
  photo: { src: string; width: number; height: number }
  bio: string
}

export interface Family {
  side: string
  father: string
  mother: string
  address: string
  childLabel: string
}

export interface Ceremony {
  title: string
  startsAt: string
  lunarNote: string
}

export interface TimelineItem {
  time: string
  title: string
}

export interface Venue {
  title: string
  name: string
  address: string
  timeRange: string
  note: string
}

export interface Photo {
  src: string
  width: number
  height: number
  alt: string
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
  families: [Family, Family]
  invitationLines: string[]
  ceremonies: Ceremony[]
  countdownTarget: string
  timeline: TimelineItem[]
  venues: Venue[]
  gallery: Photo[]
  giftAccounts: GiftAccount[]
  music: { src: string }
}

export const WEDDING: WeddingConfig = {
  groom: {
    name: 'Quang Linh',
    role: 'Chú rể',
    photo: { src: '/images/groom.jpg', width: 300, height: 300 },
    bio: 'Người hay cười, thích những chuyến đi xa và luôn để dành phần ngon nhất cho người mình thương.', // MOCK
  },
  bride: {
    name: 'Thanh Trúc',
    role: 'Cô dâu',
    photo: { src: '/images/bride.jpg', width: 250, height: 250 },
    bio: 'Dịu dàng, yêu hoa và những buổi chiều yên bình, tin rằng hạnh phúc nằm trong những điều giản dị.', // MOCK
  },
  families: [
    {
      side: 'Nhà trai',
      father: 'Ông Phạm Văn An', // MOCK
      mother: 'Bà Nguyễn Thị Bình', // MOCK
      address: 'Phường 1, TP. Hồ Chí Minh', // MOCK
      childLabel: 'Trưởng nam', // MOCK
    },
    {
      side: 'Nhà gái',
      father: 'Ông Trần Văn Cường', // MOCK
      mother: 'Bà Lê Thị Dung', // MOCK
      address: 'Phường 2, TP. Hồ Chí Minh', // MOCK
      childLabel: 'Út nữ', // MOCK
    },
  ],
  invitationLines: [
    'Từ một cơ duyên nhỏ, hai đứa mình đã tìm thấy nhau.',
    'Và giờ đây, tụi mình muốn nắm tay nhau đi tiếp chặng đường dài phía trước.',
    'Sự có mặt của bạn là niềm vui lớn nhất trong ngày đặc biệt này.',
  ],
  ceremonies: [
    {
      title: 'Lễ vu quy',
      startsAt: '2026-12-20T09:00:00+07:00', // MOCK
      lunarNote: 'Nhằm ngày 11 tháng 11 năm Bính Ngọ', // MOCK
    },
    {
      title: 'Tiệc cưới',
      startsAt: '2026-12-20T11:00:00+07:00', // MOCK
      lunarNote: 'Nhằm ngày 11 tháng 11 năm Bính Ngọ', // MOCK
    },
  ],
  countdownTarget: '2026-12-20T11:00:00+07:00', // MOCK
  timeline: [
    { time: '10:30', title: 'Đón khách' }, // MOCK
    { time: '11:00', title: 'Làm lễ thành hôn' }, // MOCK
    { time: '11:30', title: 'Khai tiệc' }, // MOCK
    { time: '13:00', title: 'Chụp ảnh lưu niệm' }, // MOCK
  ],
  venues: [
    {
      title: 'Lễ vu quy',
      name: 'Tư gia nhà gái', // MOCK
      address: 'Phường 2, TP. Hồ Chí Minh', // MOCK
      timeRange: '09:00 đến 10:00', // MOCK
      note: 'Chỉ dành cho gia đình và người thân.', // MOCK
    },
    {
      title: 'Tiệc cưới',
      name: 'Nhà hàng tiệc cưới', // MOCK
      address: 'Quận 1, TP. Hồ Chí Minh', // MOCK
      timeRange: '11:00 đến 14:00', // MOCK
      note: 'Có chỗ gửi xe miễn phí.', // MOCK
    },
  ],
  gallery: [
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
  giftAccounts: [
    {
      label: 'Mừng cưới chú rể',
      bankBin: '970436', // MOCK
      bankName: 'Vietcombank', // MOCK
      accountNumber: '0123456789', // MOCK
      accountName: 'PHAM QUANG LINH', // MOCK
    },
    {
      label: 'Mừng cưới cô dâu',
      bankBin: '970407', // MOCK
      bankName: 'Techcombank', // MOCK
      accountNumber: '9876543210', // MOCK
      accountName: 'TRAN THANH TRUC', // MOCK
    },
  ],
  // Nhạc giữ chỗ public domain, nguồn và giấy phép ở public/audio/LICENSE.txt. Đổi bài: thay file này.
  music: { src: '/audio/canon-in-d.m4a' }, // MOCK
}
