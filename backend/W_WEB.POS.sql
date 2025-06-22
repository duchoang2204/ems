-- Gói Package W_WEB (phần cho POS)

-- Khai báo trong Package Spec (W_WEB)
PROCEDURE VALIDATE_POS (
  P_POS_CODE      IN  VARCHAR2,
  P_IS_VALID      OUT NUMBER,
  P_FALLBACK_NAME OUT VARCHAR2
);

-- Triển khai trong Package Body (W_WEB)
PROCEDURE VALIDATE_POS (
  P_POS_CODE      IN  VARCHAR2,
  P_IS_VALID      OUT NUMBER,
  P_FALLBACK_NAME OUT VARCHAR2
) AS
  v_pos_code_num NUMBER;
  v_count NUMBER := 0;
BEGIN
  -- Mặc định là không hợp lệ
  P_IS_VALID := 0;
  P_FALLBACK_NAME := NULL;
  
  -- Chuyển mã sang số để so sánh
  BEGIN
    v_pos_code_num := TO_NUMBER(P_POS_CODE);
  EXCEPTION
    WHEN OTHERS THEN
      v_pos_code_num := 0; -- Nếu không phải số, coi như không thuộc khoảng nào
  END;

  -- Logic kiểm tra bưu cục đóng đi
  IF v_pos_code_num >= 160000 THEN -- Liên tỉnh
    SELECT COUNT(*), MAX(TEN_MABC)
    INTO v_count, P_FALLBACK_NAME
    FROM mabc 
    WHERE MABC = P_POS_CODE AND (loai = 0 OR sudung = 1);
  ELSIF v_pos_code_num >= 100000 AND v_pos_code_num < 160000 THEN -- Nội tỉnh
    SELECT COUNT(*), MAX(TEN_TINH)
    INTO v_count, P_FALLBACK_NAME
    FROM ntinh
    WHERE MA_TINH = P_POS_CODE AND (loai = 0 OR sudung = 1);
  END IF;

  -- Nếu tìm thấy là bưu cục đóng đi hợp lệ
  IF v_count > 0 THEN
    P_IS_VALID := 1;
    RETURN; -- Thoát ngay vì đã hợp lệ
  END IF;
  
  -- Nếu không, kiểm tra có phải bưu cục đóng đến không
  SELECT COUNT(*), MAX(TENBC)
  INTO v_count, P_FALLBACK_NAME
  FROM mabc_den
  WHERE MABC = P_POS_CODE;
  
  IF v_count > 0 THEN
    P_IS_VALID := 1;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    P_IS_VALID := 0;
    P_FALLBACK_NAME := NULL;
    -- Có thể ghi log lỗi ở đây nếu cần
END VALIDATE_POS; 