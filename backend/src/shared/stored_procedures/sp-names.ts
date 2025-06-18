// Mapping tên các Stored Procedure (SP) dùng trong toàn hệ thống
// Sử dụng import { SP_NAMES } from 'src/shared/stored_procedures/sp-names';

export const SP_NAMES = {
  // Auth
  LOGIN: 'W_SP_AUTH_LOGIN',
  // Shift
  CHECK_CURRENT_SHIFT: 'W_SP_SHIFT_CHECK_CURRENT',
  FIND_SHIFT_BY_ID: 'W_SP_SHIFT_FIND_BY_ID',
  FIND_ACTIVE_SHIFT: 'W_SP_SHIFT_FIND_ACTIVE',
  // Van chuyen
  SEARCH_E1: 'W_SP_VANCHUYEN_SEARCH_E1',
  // Thêm các SP khác tại đây...
}; 