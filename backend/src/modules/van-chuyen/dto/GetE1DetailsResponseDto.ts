export interface E1DetailInfo {
  stt: number;          // STT
  eventTimestamp: Date;  // Ngày CT (đã định dạng DD/MM/YYYY)
  loai: string;         // Loại: 'Đến', 'XNĐ', 'Đi'
  buuCucDong: string;   // Bưu cục đóng
  buuCucNhan: string;   // Bưu cục nhận
  thongTinCT: string;   // Thông tin CT
}

export interface E1BD10Info {
  stt: number;
  // ... existing code ...
}

export interface GetE1DetailsResponseDto {
  e1Details: E1DetailInfo[];
  bd10Details: E1BD10Info[];
} 