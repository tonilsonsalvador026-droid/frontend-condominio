import React, { useState } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import Sidebar from '../ui/Sidebar';

const MainLayout = ({ children }) => {
  const [sidebarAberto, setSidebarAberto] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-50/90 via-blue-50/50 to-indigo-50/30 min-h-screen w-screen">
      {/* Header Fixo Topo */}
      <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setSidebarAberto(true)}
              className="p-3 rounded-xl text-slate-700 hover:bg-slate-100 hover:shadow-md transition-all md:hidden"
            >
              <FaBars className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center space-x-6 ml-auto">
              <div className="relative p-3 hover:bg-slate-100 rounded-2xl group cursor-pointer transition-all">
                <FaBell className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                <span className="absolute -top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white">3</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg ring-2 ring-slate-200 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer flex items-center justify-center">
                <span className="font-semibold text-white text-sm">TS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar aberto={sidebarAberto} setAberto={setSidebarAberto} />
        <main className="flex-1 min-h-[calc(100vh-80px)] md:ml-72 p-8 lg:p-12 bg-slate-50/50 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
