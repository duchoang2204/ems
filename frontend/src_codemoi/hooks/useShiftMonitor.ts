
import { useEffect } from "react";
import { checkCurrentShift } from "../api/shiftApi";
import { useAuth } from "../context/AuthContext";

const useShiftMonitor = (intervalMs = 5 * 60 * 1000) => {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkShift = async () => {
      try {
        const res = await checkCurrentShift(user.mabc);
        if (!res.data.ok) {
          alert("Ca làm việc đã hết hoặc chưa thiết lập. Bạn sẽ bị đăng xuất.");
          logout();
        } else {
          const now = new Date();
          const currentDate = Number(now.toISOString().slice(0, 10).replace(/-/g, ""));
          const currentTime = now.getHours() * 100 + now.getMinutes();
          const shift = res.data.shift;
          const isNearEnd =
            (shift.gioBatDau < shift.gioKetThuc &&
              currentTime >= shift.gioKetThuc - 10) || // 10 phút cuối
            (shift.gioBatDau > shift.gioKetThuc &&
              (currentTime >= shift.gioKetThuc - 10 || currentTime < shift.gioKetThuc));

          if (isNearEnd) {
            console.warn("Sắp hết ca, thao tác cuối cùng sẽ bị logout sau đó.");
            alert("Bạn đang ở cuối ca. Hoàn tất thao tác hiện tại, hệ thống sẽ tự đăng xuất.");
          }
        }
      } catch (err) {
        console.error("Lỗi kiểm tra ca định kỳ", err);
      }
    };

    const timer = setInterval(checkShift, intervalMs);
    checkShift();

    return () => clearInterval(timer);
  }, [user, logout, intervalMs]);
};

export default useShiftMonitor;
