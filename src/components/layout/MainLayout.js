// src/components/layout/MainLayout.js
import React from "react";
import Sidebar from "../ui/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col md:ml-64 p-4 md:p-6 overflow-y-auto transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
