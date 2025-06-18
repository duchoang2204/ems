CREATE OR REPLACE PROCEDURE W_SP_AUTH_RESET_PASSWORD (
    p_g_mabc IN NUMBER,
    p_admin_manv IN NUMBER,
    p_target_manv IN NUMBER,
    p_new_password IN VARCHAR2,
    p_error OUT VARCHAR2
) AS
    v_admin_quyen VARCHAR2(10);
BEGIN
    -- Kiểm tra g_mabc hợp lệ
    IF p_g_mabc NOT IN (100916, 101000) THEN
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    -- Kiểm tra quyền admin
    SELECT quyen INTO v_admin_quyen
    FROM nvien
    WHERE manv = p_admin_manv;

    IF v_admin_quyen != 'ADMIN' THEN
        p_error := 'UNAUTHORIZED';
        RETURN;
    END IF;

    -- Kiểm tra user cần reset tồn tại
    IF NOT EXISTS (SELECT 1 FROM nvien WHERE manv = p_target_manv) THEN
        p_error := 'USER_NOT_FOUND';
        RETURN;
    END IF;

    -- Reset mật khẩu
    UPDATE nvien 
    SET mkhau = p_new_password
    WHERE manv = p_target_manv;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 