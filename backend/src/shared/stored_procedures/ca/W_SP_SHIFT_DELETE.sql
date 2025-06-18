CREATE OR REPLACE PROCEDURE W_SP_SHIFT_DELETE (
    p_g_mabc IN NUMBER,
    p_id_ca IN NUMBER,
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

        DELETE FROM ca_todong WHERE id_ca = p_id_ca;
    ELSIF p_g_mabc = 101000 THEN
        SELECT COUNT(*) INTO v_count FROM ca_tomo WHERE id_ca = p_id_ca;
        IF v_count = 0 THEN
            p_error := 'SHIFT_NOT_FOUND';
            RETURN;
        END IF;

        DELETE FROM ca_tomo WHERE id_ca = p_id_ca;
    ELSE
        p_error := 'INVALID_G_MABC';
        RETURN;
    END IF;

    p_error := NULL;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'SYSTEM_ERROR';
END; 