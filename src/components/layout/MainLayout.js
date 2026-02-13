// src/components/layout/MainLayout.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar aberto={sidebarOpen} setAberto={setSidebarOpen} />

      {/* Área direita */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto">
  <div className="w-full max-w-screen-xl mx-auto p-4 md:p-6">
    <Outlet />
  </div>
</main>
  );
};

export default MainLayout;
