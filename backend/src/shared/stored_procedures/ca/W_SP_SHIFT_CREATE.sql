CREATE OR REPLACE PROCEDURE W_SP_SHIFT_CREATE (
    p_g_mabc IN NUMBER,
    p_ngay IN NUMBER,
    p_ca IN NUMBER,
    p_tenca IN VARCHAR2,
    p_ngaybatdau IN NUMBER,
    p_giobatdau IN NUMBER,
    p_ngayketthuc IN NUMBER,
    p_gioketthuc IN NUMBER,
    p_active IN NUMBER,
    p_nvxacnhan_ca IN NUMBER,
    p_mabc_kt IN NUMBER,
    p_auto_xnd IN NUMBER,
    p_id_ca OUT NUMBER,
    p_error OUT VARCHAR2
) AS
BEGIN
    IF p_g_mabc = 100916 THEN
        INSERT INTO ca_todong (
            ngay, ca, tenca, ngaybatdau, giobatdau,
            ngayketthuc, gioketthuc, active, nvxacnhan_ca, mabc_kt, auto_xnd
        ) VALUES (
            p_ngay, p_ca, p_tenca, p_ngaybatdau, p_giobatdau,
            p_ngayketthuc, p_gioketthuc, p_active, p_nvxacnhan_ca, p_mabc_kt, p_auto_xnd
        ) RETURNING id_ca INTO p_id_ca;
    ELSIF p_g_mabc = 101000 THEN
        INSERT INTO ca_tomo (
            ngay, ca, tenca, ngaybatdau, giobatdau,
            ngayketthuc, gioketthuc, active, nvxacnhan_ca, mabc_kt, auto_xnd
        ) VALUES (
            p_ngay, p_ca, p_tenca, p_ngaybatdau, p_giobatdau,
            p_ngayketthuc, p_gioketthuc, p_active, p_nvxacnhan_ca, p_mabc_kt, p_auto_xnd
        ) RETURNING id_ca INTO p_id_ca;
    ELSE
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 