import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ExploitationPage from '../pages/exploitation/ExploitationPage';

// Khai thác viên pages
import KhaiThacVienPage from '../pages/exploitation/operator/KhaiThacVienPage';
import DongTuiDiPage from '../pages/exploitation/operator/DongTuiDiPage';
import CapNhatTuiDiPage from '../pages/exploitation/operator/CapNhatTuiDiPage';
import XuLyTuiKhongTraPage from '../pages/exploitation/operator/XuLyTuiKhongTraPage';

// BD10 pages
import BD10Page from '../pages/exploitation/bd10/BD10Page';
import LapBD10Page from '../pages/exploitation/bd10/LapBD10Page';
import XacNhanBD10Page from '../pages/exploitation/bd10/XacNhanBD10Page';

// Van chuyen pages
import DeliveryPage from '../features/van-chuyen/pages/DeliveryPage';

// Accountant/KSV pages
import AccountantPage from '../pages/exploitation/accountant/AccountantPage';
import ConfirmArrivalPage from '../pages/exploitation/accountant/ConfirmArrivalPage';
import CloseOutgoingPage from '../pages/exploitation/accountant/CloseOutgoingPage';
import StorePage from '../pages/exploitation/accountant/StorePage';
import BalancePage from '../pages/exploitation/accountant/BalancePage';
import EndShiftPage from '../pages/exploitation/accountant/EndShiftPage';
import CreateShiftPage from '../pages/exploitation/accountant/CreateShiftPage';
import CheckFPage from '../pages/exploitation/accountant/CheckFPage';
import LockDataPage from '../pages/exploitation/accountant/LockDataPage';

// Reports pages
import ReportsPage from '../pages/exploitation/reports/ReportsPage';
import E1WrongWeightPage from '../pages/exploitation/reports/E1WrongWeightPage';
import BagWrongWeightPage from '../pages/exploitation/reports/BagWrongWeightPage';
import BagReconciliationPage from '../pages/exploitation/reports/BagReconciliationPage';

// Other pages
import TransactionPage from '../pages/transaction/TransactionPage';
import PostmanPage from '../pages/postman/PostmanPage';
import AdminPage from '../pages/admin/AdminPage';
import SettingsPage from '../pages/settings/SettingsPage';
import ProtectedRoute from '../components/ProtectedRoute';

// Định nghĩa các route của ứng dụng
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'exploitation',
        element: <ExploitationPage />
      },
      // Khai thác viên routes
      {
        path: 'khai-thac-vien',
        element: <KhaiThacVienPage />
      },
      {
        path: 'khai-thac-vien/dong-tui-di',
        element: <DongTuiDiPage />
      },
      {
        path: 'khai-thac-vien/cap-nhat-tui-di',
        element: <CapNhatTuiDiPage />
      },
      {
        path: 'khai-thac-vien/xu-ly-tui-khong-tra',
        element: <XuLyTuiKhongTraPage />
      },
      // BD10 routes
      {
        path: 'bd10',
        element: <BD10Page />
      },
      {
        path: 'bd10/create-by-route',
        element: <LapBD10Page />
      },
      {
        path: 'bd10/confirm-by-bag',
        element: <XacNhanBD10Page />
      },
      // Van chuyen routes
      {
        path: 'van-chuyen',
        element: <DeliveryPage />
      },    
      // Accountant/KSV routes
      {
        path: 'accountant',
        element: <AccountantPage />
      },
      {
        path: 'accountant/confirm-arrival',
        element: <ConfirmArrivalPage />
      },
      {
        path: 'accountant/close-outgoing',
        element: <CloseOutgoingPage />
      },
      {
        path: 'accountant/store',
        element: <StorePage />
      },
      {
        path: 'accountant/balance',
        element: <BalancePage />
      },
      {
        path: 'accountant/end-shift',
        element: <EndShiftPage />
      },
      {
        path: 'accountant/create-shift',
        element: <CreateShiftPage />
      },
      {
        path: 'accountant/check-f',
        element: <CheckFPage />
      },
      {
        path: 'accountant/lock-data',
        element: <LockDataPage />
      },
      // Reports routes
      {
        path: 'reports',
        element: <ReportsPage />
      },
      {
        path: 'reports/e1-wrong-weight',
        element: <E1WrongWeightPage />
      },
      {
        path: 'reports/bag-wrong-weight',
        element: <BagWrongWeightPage />
      },
      {
        path: 'reports/bag-reconciliation',
        element: <BagReconciliationPage />
      },
      // Other routes
      {
        path: 'transaction',
        element: <TransactionPage />
      },
      {
        path: 'postman',
        element: <PostmanPage />
      },
      {
        path: 'admin',
        element: <AdminPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  }
];
