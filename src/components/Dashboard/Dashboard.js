// src/components/Dashboard.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Power, User } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    // Pequeno delay para garantir localStorage
    setTimeout(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setUser({
            id: payload.id || null,
            role: payload.role || "admin",
            name: payload.nome || "Admin",
          });
        } else {
          setUser({ name: "Admin" });
        }
      } catch {
        setUser({ name: "Admin" });
      } finally {
        setLoading(false);
      }
    }, 100);
  }, [navigate]);

  // Fechar menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading || !user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handlePerfil = () => {
    navigate("/perfil");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header fixo */}
      <header className="w-full bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50">
        <h1 className="text-xl font-bold">Painel Principal</h1>

        {/* Menu de usuário */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 font-medium hover:bg-indigo-600 px-3 py-2 rounded-lg transition"
          >
            <span>{user.name}</span>
            <ChevronDown size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg py-2 z-50">
              <button
                onClick={handlePerfil}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
              >
                <User size={18} /> Perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-red-600"
              >
                <Power size={18} /> Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 md:ml-0 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-4">Bem-vindo, {user.name}!</h2>
            <p className="text-gray-700">
              Aqui será desenvolvido o conteúdo e funcionalidades do sistema de gestão. 🚀
            </p>
          </div>
          {/* Adicione outros cards do dashboard aqui */}
        </div>
      </main>
    </div>
  );
}
