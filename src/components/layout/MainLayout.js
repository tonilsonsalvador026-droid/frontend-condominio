// src/components/layout/MainLayout.js
import React from "react";
import Sidebar from "../ui/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main
        className="
          flex-1
          w-full
          p-4
          sm:p-6
          lg:ml-64
          overflow-y-auto
        "
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
