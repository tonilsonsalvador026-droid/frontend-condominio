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

      {/* Área direita (Topbar + Conteúdo) */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Conteúdo */}
        <main className="pt-16 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;



