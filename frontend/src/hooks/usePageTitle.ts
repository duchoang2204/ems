import { useContext } from "react";
import { PageTitleContext } from "../context/PageTitleContext";

export const usePageTitle = () => {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error("usePageTitle must be used within a PageTitleProvider");
  }
  return context;
}; 