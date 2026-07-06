// src/components/layout/MainLayout.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
   <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50/90 via-blue-50/50 to-indigo-50/30">

    <Sidebar
        aberto={sidebarOpen}
        setAberto={setSidebarOpen}
    />

    <div className="flex flex-col flex-1 overflow-hidden">

        <Topbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main
            className="
                flex-1
                overflow-y-auto
                md:ml-72
                p-8
                lg:p-12
                bg-gradient-to-br
                from-slate-50/80
                via-blue-50/30
                to-indigo-50/20
            "
        >
            <Outlet />
        </main>

    </div>

</div>
  );
};

export default MainLayout;
