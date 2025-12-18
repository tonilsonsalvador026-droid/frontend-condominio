// src/components/layout/MainLayout.js
import React from "react";
import Sidebar from "../ui/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="ml-56 sm:ml-60 lg:ml-64 w-full p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
};


export default MainLayout;
