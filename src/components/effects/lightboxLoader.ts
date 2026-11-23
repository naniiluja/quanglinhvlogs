// Lightbox tải riêng, không nằm trong bundle chính. Gọi preloadLightbox khi album sắp hiện để lần
// bấm đầu mở ngay, không bắt khách chờ tải trên mạng chậm (tưởng bấm chưa ăn rồi bấm lại).
export const loadLightbox = () => import('yet-another-react-lightbox')

export function preloadLightbox(): void {
  void loadLightbox()
}
