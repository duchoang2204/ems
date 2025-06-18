CREATE OR REPLACE PROCEDURE W_SP_AUTH_CHANGE_PASSWORD (
    p_g_mabc IN NUMBER,
    p_manv IN NUMBER,
    p_old_password IN VARCHAR2,
    p_new_password IN VARCHAR2,
    p_error OUT VARCHAR2
) AS
    v_count NUMBER;
BEGIN
    -- Kiểm tra g_mabc hợp lệ
    IF p_g_mabc NOT IN (100916, 101000) THEN
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    -- Kiểm tra mật khẩu cũ
    SELECT COUNT(*) INTO v_count 
    FROM nvien 
    WHERE manv = p_manv 
    AND mkhau = p_old_password;

    IF v_count = 0 THEN
        p_error := 'INVALID_OLD_PASSWORD';
        RETURN;
    END IF;

    -- Cập nhật mật khẩu mới
    UPDATE nvien 
    SET mkhau = p_new_password
    WHERE manv = p_manv;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 