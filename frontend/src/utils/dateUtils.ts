// Các hàm tiện ích xử lý ngày tháng

/**
 * Chuyển đổi từ Date object sang string format YYYYMMDD
 * @param date Date object từ DatePicker
 * @returns string format YYYYMMDD hoặc undefined nếu date là null
 */
export const formatDateToYyyymmdd = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
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
