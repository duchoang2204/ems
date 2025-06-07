import React from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { PageTitleProvider } from "./context/PageTitleContext";

const App = () => {
  const element = useRoutes(routes);
  return (
    <PageTitleProvider>
      {element}
    </PageTitleProvider>
  );
};

export default App;
