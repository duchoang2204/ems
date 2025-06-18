CREATE OR REPLACE PROCEDURE W_SP_SHIFT_FIND_ACTIVE (
    p_g_mabc IN NUMBER,
    p_shifts OUT SYS_REFCURSOR,
    p_error OUT VARCHAR2
) AS
    v_current_date DATE := TRUNC(SYSDATE);
BEGIN
    IF p_g_mabc = 100916 THEN
        OPEN p_shifts FOR
            SELECT id_ca, ngay, ca, tenca, ngaybatdau, giobatdau, 
                   ngayketthuc, gioketthuc, active, nvxacnhan_ca, mabc_kt, auto_xnd
            FROM ca_todong
            WHERE ngay = v_current_date
            AND active = 1
            ORDER BY giobatdau;
    ELSIF p_g_mabc = 101000 THEN
        OPEN p_shifts FOR
            SELECT id_ca, ngay, ca, tenca, ngaybatdau, giobatdau, 
                   ngayketthuc, gioketthuc, active, nvxacnhan_ca, mabc_kt, auto_xnd
            FROM ca_tomo
            WHERE ngay = v_current_date
            AND active = 1
            ORDER BY giobatdau;
    ELSE
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    -- Nếu không tìm thấy ca nào
    IF SQL%NOTFOUND THEN
        p_error := 'NO_ACTIVE_SHIFTS';
        RETURN;
    END IF;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 