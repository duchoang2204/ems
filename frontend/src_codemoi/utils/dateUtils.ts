// Các hàm tiện ích xử lý ngày tháng

/**
 * Định dạng đối tượng Date thành chuỗi 'YYYYMMDD'.
 * @param date Đối tượng Date cần định dạng.
 * @returns Chuỗi có định dạng 'YYYYMMDD' hoặc chuỗi rỗng nếu đầu vào không hợp lệ.
 */
export const formatDateToYyyymmdd = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Chuyển đổi từ string format YYYYMMDD sang DD/MM/YYYY để hiển thị
 * @param dateStr string format YYYYMMDD từ API
 * @returns string format DD/MM/YYYY
 */
export const formatYyyymmddToDdMmYyyy = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 8) return '';
    
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${day}/${month}/${year}`;
};

/**
 * Parse string YYYYMMDD thành Date object
 * @param dateStr string format YYYYMMDD
 * @returns Date object hoặc null nếu invalid
 */
export const parseYyyymmddToDate = (dateStr: string): Date | null => {
    if (!dateStr || dateStr.length !== 8) return null;
    
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-based
    const day = parseInt(dateStr.substring(6, 8));
    
    const date = new Date(year, month, day);
    return date;
};

/**
 * Chuyển đổi chuỗi ngày có định dạng 'DD/MM/YYYY' thành đối tượng Date.
 * @param dateString Chuỗi ngày cần chuyển đổi.
 * @returns Đối tượng Date hoặc null nếu chuỗi không hợp lệ.
 */
export const parseDdMmYyyy = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return null;
  }
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Tháng trong JS là từ 0-11
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }
  
  const date = new Date(year, month, day);
  // Kiểm tra xem ngày có hợp lệ không (ví dụ: không phải ngày 32/13/2023)
  if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
    return date;
  }
  
  return null;
};
