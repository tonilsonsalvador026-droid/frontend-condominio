// src/components/layout/MainLayout.js
import React from "react";
import Sidebar from "../ui/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;