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
    // Aguarda pequeno delay para garantir que o localStorage está disponível
    setTimeout(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ Nenhum token encontrado — redirecionando para login.");
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
      } catch (err) {
        console.warn("Token inválido ou não é JWT — usando dados padrão.");
        setUser({ name: "Admin" });
      } finally {
        setLoading(false);
      }
    }, 100); // pequeno atraso (100ms) resolve timing issues
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

  if (loading) return null;
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handlePerfil = () => {
    navigate("/perfil");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixo */}
      <header className="w-full bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50">
        <h1 className="text-xl font-bold">Painel Principal</h1>

        <div className="relative" ref={menuRef}>
          {/* Nome + seta */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 font-medium hover:bg-indigo-600 px-3 py-2 rounded-lg transition"
          >
            <span>{user.name || "Admin"}</span>
            <ChevronDown size={18} />
          </button>

          {/* Menu suspenso */}
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
      <main className="flex-1 p-6 mt-20 bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo ao sistema!</h2>
          <p className="text-gray-700">
            Aqui será desenvolvido o conteúdo e funcionalidades do sistema de
            gestão. 🚀
          </p>
        </div>
      </main>
    </div>
  );
}