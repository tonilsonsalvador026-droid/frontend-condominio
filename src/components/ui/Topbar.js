import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Power, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onToggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Admin";

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handlePerfil = () => {
    navigate("/perfil");
  };

  return (
    <header
  className="
    fixed top-0 left-0 md:left-64 right-0
    h-16 bg-indigo-700 text-white
    flex items-center justify-between
    px-4 md:px-6
    shadow-md z-40
  "
>
      {/* Lado esquerdo */}
      <div className="flex items-center gap-3">
        {/* Botão menu (mobile e desktop) */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-indigo-600 transition"
        >
          <Menu size={22} />
        </button>

        <span className="font-semibold text-lg hidden sm:block">
          Painel Principal
        </span>
      </div>

      {/* Lado direito */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 hover:bg-indigo-600 px-3 py-2 rounded-md transition"
        >
          <span className="hidden sm:block">{userName}</span>
          <ChevronDown size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg py-2">
            <button
              onClick={handlePerfil}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <User size={16} /> Perfil
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <Power size={16} /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
