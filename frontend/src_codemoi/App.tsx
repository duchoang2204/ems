import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes } from "./routes/routes";
import { PageTitleProvider } from "./context/PageTitleContext";
import JobNotifier from "./components/JobNotifier/JobNotifier";

const App = () => {
  const element = useRoutes(routes);
  return (
    <PageTitleProvider>
      <Suspense fallback={<div>Đang tải trang...</div>}>
        {element}
      </Suspense>
      <JobNotifier />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </PageTitleProvider>
  );
};

export default App;
