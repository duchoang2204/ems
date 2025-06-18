CREATE OR REPLACE PROCEDURE W_SP_SHIFT_FIND_BY_ID (
    p_g_mabc IN NUMBER,
    p_id_ca IN NUMBER,
    p_shift OUT SYS_REFCURSOR,
    p_error OUT VARCHAR2
) AS
BEGIN
    IF p_g_mabc = 100916 THEN
        OPEN p_shift FOR
            SELECT ngay, ca, tenca, ngaybatdau, giobatdau, 
                   ngayketthuc, gioketthuc, active, nvxacnhan_ca, mabc_kt, auto_xnd
            FROM ca_todong
            WHERE id_ca = p_id_ca;
    ELSIF p_g_mabc = 101000 THEN
        OPEN p_shift FOR
            SELECT ngay, ca, tenca, ngaybatdau, giobatdau, 
                   ngayketthuc, gioketthuc, active, nvxacnhan_ca, mabc_kt, auto_xnd
            FROM ca_tomo
            WHERE id_ca = p_id_ca;
    ELSE
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    -- Nếu không tìm thấy ca nào
    IF SQL%NOTFOUND THEN
        p_error := 'SHIFT_NOT_FOUND';
        RETURN;
    END IF;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 