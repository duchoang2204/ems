CREATE OR REPLACE PROCEDURE W_SP_SHIFT_CHECK_CURRENT (
    p_g_mabc IN NUMBER,
    p_shift OUT SYS_REFCURSOR,
    p_error OUT VARCHAR2
) AS
    v_ngay NUMBER;
    v_gio NUMBER;
    v_count NUMBER;
BEGIN
    SELECT 
        TO_NUMBER(TO_CHAR(SYSDATE, 'YYYYMMDD')),
        TO_NUMBER(TO_CHAR(SYSDATE, 'HH24MI'))
    INTO v_ngay, v_gio
    FROM DUAL;

    IF p_g_mabc = 100916 THEN
        SELECT COUNT(*) INTO v_count FROM ca_todong
        WHERE active = 1 
        AND v_ngay BETWEEN ngaybatdau AND ngayketthuc
        AND (
            (v_ngay = ngaybatdau AND v_gio >= giobatdau) OR
            (v_ngay = ngayketthuc AND v_gio < gioketthuc) OR
            (v_ngay > ngaybatdau AND v_ngay < ngayketthuc)
        );

        IF v_count = 0 THEN
            p_error := 'NO_ACTIVE_SHIFT';
            RETURN;
        END IF;

        OPEN p_shift FOR
            SELECT ngay, ca, tenca, ngaybatdau, giobatdau, 
                   ngayketthuc, gioketthuc, active, nvxacnhan_ca, mabc_kt, auto_xnd
            FROM ca_todong
            WHERE active = 1 
            AND v_ngay BETWEEN ngaybatdau AND ngayketthuc
            AND (
                (v_ngay = ngaybatdau AND v_gio >= giobatdau) OR
                (v_ngay = ngayketthuc AND v_gio < gioketthuc) OR
                (v_ngay > ngaybatdau AND v_ngay < ngayketthuc)
            );
    ELSIF p_g_mabc = 101000 THEN
        SELECT COUNT(*) INTO v_count FROM ca_tomo
        WHERE active = 1 
        AND v_ngay BETWEEN ngaybatdau AND ngayketthuc
        AND (
            (v_ngay = ngaybatdau AND v_gio >= giobatdau) OR
            (v_ngay = ngayketthuc AND v_gio < gioketthuc) OR
            (v_ngay > ngaybatdau AND v_ngay < ngayketthuc)
        );

        IF v_count = 0 THEN
            p_error := 'NO_ACTIVE_SHIFT';
            RETURN;
        END IF;

        OPEN p_shift FOR
            SELECT ngay, ca, tenca, ngaybatdau, giobatdau, 
                   ngayketthuc, gioketthuc, active, nvxacnhan_ca, mabc_kt, auto_xnd
            FROM ca_tomo
            WHERE active = 1 
            AND v_ngay BETWEEN ngaybatdau AND ngayketthuc
            AND (
                (v_ngay = ngaybatdau AND v_gio >= giobatdau) OR
                (v_ngay = ngayketthuc AND v_gio < gioketthuc) OR
                (v_ngay > ngaybatdau AND v_ngay < ngayketthuc)
            );
    ELSE
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 