// src/components/layout/MainLayout.js
import React from "react";
import Sidebar from "../ui/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div
        className="
          flex-1
          ml-56 sm:ml-60 lg:ml-64
          p-4 sm:p-6
          overflow-y-auto
        "
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
