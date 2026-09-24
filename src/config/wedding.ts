// Nguồn duy nhất cho nội dung thiệp (architecture.md). Giá trị mock gắn chú thích MOCK để grep.
export interface Person {
  name: string
}

export interface WeddingConfig {
  groom: Person
  bride: Person
}

export const WEDDING: WeddingConfig = {
  groom: { name: 'Quang Linh' },
  bride: { name: 'Thanh Trúc' },
}
