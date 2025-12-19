// src/components/layout/MainLayout.js
import React from "react";
import Sidebar from "../ui/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col transition-all duration-300 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;


