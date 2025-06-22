import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthContextType } from '../types/auth';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

// ⚠️ Giữ nguyên API login(data) theo V0 — login() có navigate('/dashboard') bên trong.

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const [token, setToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any | null>(null);
    const [shiftInfo, setShiftInfo] = useState<any | null>(null);
    const [showIdleModal, setShowIdleModal] = useState(false);
    const [countdown, setCountdown] = useState<number>(60); // countdown giây

    const logout = useCallback(() => {
        setToken(null);
        setUserInfo(null);
        setShiftInfo(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('shiftInfo');
        sessionStorage.removeItem('lastActionTime');
        navigate('/login');
    }, [navigate]);

    // ⚠️ Giữ nguyên API login(data) như V0 + có navigate('/dashboard')
    const login = (data: {
        username: string;
        role: number;
        token: string;
        ca: number;
        ngaykt: string;
        db: string;
        mabc: string;
    }) => {
        console.log('AuthContext.login được gọi với token:', data.token);
        setToken(data.token);
        setUserInfo({
            username: data.username,
            role: data.role,
            mabc: data.mabc
        });
        setShiftInfo({
            ca: data.ca,
            ngaykt: data.ngaykt,
            db: data.db
        });
    
        // Lưu token vào sessionStorage để axios interceptor tự động lấy
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userInfo', JSON.stringify({
            username: data.username,
            role: data.role,
            mabc: data.mabc
        }));
        sessionStorage.setItem('shiftInfo', JSON.stringify({
            ca: data.ca,
            ngaykt: data.ngaykt,
            db: data.db
        }));
        sessionStorage.setItem('lastActionTime', Date.now().toString());
    
        // Thêm log kiểm tra
        console.log('Đã lưu token vào sessionStorage:', sessionStorage.getItem('token'));
    
        // navigate vào Dashboard ngay sau login
        setTimeout(() => {
          navigate('/');
        }, 2000); // Đảm bảo lưu xong mới chuyển trang
    };

    // 👉 Restore sessionStorage khi khởi động app
    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const storedUserInfo = sessionStorage.getItem('userInfo');
        const storedShiftInfo = sessionStorage.getItem('shiftInfo');

        if (storedToken && storedUserInfo && storedShiftInfo) {
            setToken(storedToken);
            setUserInfo(JSON.parse(storedUserInfo));
            setShiftInfo(JSON.parse(storedShiftInfo));
        }
    }, []);

    // 👉 Hook inactivity 10 phút + Modal cảnh báo sau 9 phút
    useEffect(() => {
        const updateLastAction = () => {
            sessionStorage.setItem('lastActionTime', Date.now().toString());
            if (showIdleModal) {
                setShowIdleModal(false); // Nếu đang hiện modal, user thao tác thì ẩn modal
            }
        };

        const checkIdle = () => {
            const lastActionTime = parseInt(sessionStorage.getItem('lastActionTime') || '0', 10);
            const currentTime = Date.now();
            const idleLimit = 10 * 60 * 1000; // 10 phút
            const warningLimit = 9 * 60 * 1000; // 9 phút

            if (token) {
                const idleTime = currentTime - lastActionTime;

                if (idleTime > idleLimit) {
                    console.log('Auto logout vì không thao tác trong 10 phút');
                    logout();
                } else if (idleTime > warningLimit && !showIdleModal) {
                    console.log('Hiện modal cảnh báo auto logout');
                    setShowIdleModal(true);
                    setCountdown(60); // reset countdown khi hiện modal
                }
            }
        };

        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach((event) => window.addEventListener(event, updateLastAction));

        const interval = setInterval(checkIdle, 30 * 1000); // kiểm tra mỗi 30 giây

        return () => {
            events.forEach((event) => window.removeEventListener(event, updateLastAction));
            clearInterval(interval);
        };
    }, [token, logout, showIdleModal]);

    // 👉 Countdown timer trong Modal
    useEffect(() => {
        let countdownTimer: number;

        if (showIdleModal) {
            countdownTimer = window.setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        logout(); // auto logout khi countdown = 0
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000); // mỗi giây
        }

        return () => {
            clearInterval(countdownTimer);
        };
    }, [showIdleModal, logout]);

    // 👉 Hàm xử lý khi bấm "Tiếp tục làm việc"
    const handleContinueWorking = () => {
        sessionStorage.setItem('lastActionTime', Date.now().toString());
        setShowIdleModal(false);
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            userInfo, 
            shiftInfo, 
            login, 
            logout,
            isAuthenticated: !!token 
        }}>
            {children}

            {/* Modal cảnh báo */}
            <Dialog
                open={showIdleModal}
                onClose={() => setShowIdleModal(false)}
            >
                <DialogTitle>Cảnh báo</DialogTitle>
                <DialogContent>
                    Bạn sẽ tự động đăng xuất sau <b>{countdown}</b> giây nếu không thao tác.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleContinueWorking} color="primary" variant="contained">
                        Tiếp tục làm việc
                    </Button>
                    <Button onClick={logout} color="secondary" variant="outlined">
                        Đăng xuất ngay
                    </Button>
                </DialogActions>
            </Dialog>
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
