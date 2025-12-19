// src/components/Dashboard.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Power, User, Menu } from "lucide-react";

export default function Dashboard({ onToggleSidebar }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: payload.nome || "Admin",
          role: payload.role || "admin",
        });
      } catch {
        setUser({ name: "Admin" });
      } finally {
        setLoading(false);
      }
    }, 100);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-indigo-700 text-white h-16 flex items-center justify-between px-4 md:px-6 shadow-md">
        <div className="flex items-center gap-3">
          {/* BOTÃO HAMBURGER (mobile) */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-indigo-600 transition"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-lg md:text-xl font-bold">
            Painel Principal
          </h1>
        </div>

        {/* USER MENU */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            <span className="hidden sm:block">{user.name}</span>
            <ChevronDown size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => navigate("/perfil")}
                className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
              >
                <User size={16} /> Perfil
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/", { replace: true });
                }}
                className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-red-600"
              >
                <Power size={16} /> Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="pt-20 px-4 md:px-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-2">
            Bem-vindo, {user.name} 👋
          </h2>
          <p className="text-gray-600">
            Este é o painel principal do sistema de gestão.
          </p>
        </div>
      </main>
    </div>
  );
}

