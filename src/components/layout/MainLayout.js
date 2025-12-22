// src/components/layout/MainLayout.js
import React, { useState } from "react";
import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        aberto={sidebarOpen}
        setAberto={setSidebarOpen}
      />

      {/* Área direita */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Topbar */}
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto pt-16 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;





