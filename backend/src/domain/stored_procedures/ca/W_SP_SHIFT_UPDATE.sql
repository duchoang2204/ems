CREATE OR REPLACE PROCEDURE W_SP_SHIFT_UPDATE (
    p_g_mabc IN NUMBER,
    p_id_ca IN NUMBER,
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
    p_error OUT VARCHAR2
) AS
    v_count NUMBER;
BEGIN
    IF p_g_mabc = 100916 THEN
        SELECT COUNT(*) INTO v_count FROM ca_todong WHERE id_ca = p_id_ca;
        IF v_count = 0 THEN
            p_error := 'SHIFT_NOT_FOUND';
            RETURN;
        END IF;

        UPDATE ca_todong SET
            ngay = p_ngay,
            ca = p_ca,
            tenca = p_tenca,
            ngaybatdau = p_ngaybatdau,
            giobatdau = p_giobatdau,
            ngayketthuc = p_ngayketthuc,
            gioketthuc = p_gioketthuc,
            active = p_active,
            nvxacnhan_ca = p_nvxacnhan_ca,
            mabc_kt = p_mabc_kt,
            auto_xnd = p_auto_xnd
        WHERE id_ca = p_id_ca;
    ELSIF p_g_mabc = 101000 THEN
        SELECT COUNT(*) INTO v_count FROM ca_tomo WHERE id_ca = p_id_ca;
        IF v_count = 0 THEN
            p_error := 'SHIFT_NOT_FOUND';
            RETURN;
        END IF;

        UPDATE ca_tomo SET
            ngay = p_ngay,
            ca = p_ca,
            tenca = p_tenca,
            ngaybatdau = p_ngaybatdau,
            giobatdau = p_giobatdau,
            ngayketthuc = p_ngayketthuc,
            gioketthuc = p_gioketthuc,
            active = p_active,
            nvxacnhan_ca = p_nvxacnhan_ca,
            mabc_kt = p_mabc_kt,
            auto_xnd = p_auto_xnd
        WHERE id_ca = p_id_ca;
    ELSE
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 