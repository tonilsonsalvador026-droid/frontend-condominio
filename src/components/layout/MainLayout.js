import React, { useState } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import Sidebar from '../ui/Sidebar'; // Ajuste o caminho se necessário

const MainLayout = ({ children }) => {
  const [sidebarAberto, setSidebarAberto] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Moderno */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarAberto(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:shadow-md transition-all md:hidden"
            >
              <FaBars className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative p-2 hover:bg-slate-100 rounded-xl group transition-all">
                <FaBell className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                <span className="absolute -top-1 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white">3</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg ring-2 ring-slate-200 hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center">
                <span className="font-semibold text-white text-sm">TS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Layout Principal */}
      <div className="flex">
        <Sidebar aberto={sidebarAberto} setAberto={setSidebarAberto} />
        <main className="flex-1 min-h-screen md:ml-72 p-6 lg:p-10 transition-all duration-300">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
