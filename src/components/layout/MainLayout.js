// src/components/layout/MainLayout.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-50/90 via-blue-50/50 to-indigo-50/30 min-h-screen w-screen flex overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar aberto={sidebarOpen} setAberto={setSidebarOpen} />

      {/* Área direita */}
      <div className="flex flex-col flex-1">
        
        {/* Topbar (Header) */}
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-80px)] md:ml-72 p-8 lg:p-12 bg-gradient-to-br from-slate-50/80 via-blue-50/30 to-indigo-50/20 backdrop-blur-sm">
          <div className="w-full space-y-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
