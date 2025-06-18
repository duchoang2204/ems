CREATE OR REPLACE PROCEDURE W_SP_AUTH_LOGIN (
    p_g_mabc IN NUMBER,
    p_manv IN NUMBER,
    p_mkhau IN VARCHAR2,
    p_user OUT SYS_REFCURSOR,
    p_error OUT VARCHAR2
) AS
    v_count NUMBER;
BEGIN
    -- Tách riêng kiểm tra input
    IF p_g_mabc NOT IN (100916, 101000) THEN
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    -- Phân nhánh xử lý theo từng DB
    IF p_g_mabc = 100916 THEN
        -- Thao tác với bảng ở DB 100916 (nơi deploy SP này)
        SELECT COUNT(*) INTO v_count FROM nvien
        WHERE manv = p_manv AND mkhau = p_mkhau;

        IF v_count = 0 THEN
            p_error := 'INVALID_CREDENTIALS';
            RETURN;
        END IF;

        OPEN p_user FOR
            SELECT manv, tennv, mkhau, mucdo, ketoan
            FROM nvien
            WHERE manv = p_manv;

    ELSIF p_g_mabc = 101000 THEN
        -- Tương tự, SP ở DB 101000 cũng dùng bảng `nvien` trong DB này
        SELECT COUNT(*) INTO v_count FROM nvien
        WHERE manv = p_manv AND mkhau = p_mkhau;

        IF v_count = 0 THEN
            p_error := 'INVALID_CREDENTIALS';
            RETURN;
        END IF;

        OPEN p_user FOR
            SELECT manv, tennv, mkhau, mucdo, ketoan
            FROM nvien
            WHERE manv = p_manv;
    END IF;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 