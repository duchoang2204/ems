import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
  children: JSX.Element;
  requiredRoles?: number[]; // nếu truyền, kiểm tra vai trò
};

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <div>Không có quyền truy cập.</div>;
  }

  // có thể thêm kiểm tra ca đang hoạt động ở đây nếu cần

  return children;
};
