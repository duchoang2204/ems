export interface AuthContextType {
    token: string | null;
    userInfo: {
        username: string;
        role: number;
        mabc: string;
    } | null;
    shiftInfo: {
        ca: number;
        ngaykt: string;
        db: string;
    } | null;
    isAuthenticated: boolean;
    login: (data: {
        username: string;
        role: number;
        token: string;
        ca: number;
        ngaykt: string;
        db: string;
        mabc: string;
    }) => void;
    logout: () => void;
} 