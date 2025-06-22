import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

interface PageTitleContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  resetPageTitle: () => void;
}

export const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export const PageTitleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("");

  const resetPageTitle = () => {
    setPageTitle("");
  };

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle, resetPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}; 