import React, { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { PageTitleProvider } from "./context/PageTitleContext";

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const App = () => {
  const element = useRoutes(routes);
  return (
    <PageTitleProvider>
      <Suspense fallback={<div>Đang tải trang...</div>}>
        {element}
      </Suspense>
    </PageTitleProvider>
  );
};

export default App;
