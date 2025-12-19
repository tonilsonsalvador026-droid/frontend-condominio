// src/components/ui/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaFileInvoiceDollar,
  FaBuilding,
  FaKey,
  FaReceipt,
  FaCalendarAlt,
  FaTools,
  FaClipboardList,
  FaUserShield,
  FaBars,
  FaTimes,
  FaWallet,
  FaLock,
  FaUnlockAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [aberto, setAberto] = useState(false); // Mobile: fechado por padrão
  const [permissoes, setPermissoes] = useState([]);
  const [role, setRole] = useState("");
  const location = useLocation();

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("role");
      const storedPerms = localStorage.getItem("permissoes");

      if (storedRole) setRole(storedRole);
      if (storedPerms) setPermissoes(JSON.parse(storedPerms) || []);
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    }
  }, []);

  const temPermissao = (modulo) => {
    if (role?.toLowerCase() === "admin") return true;
    if (!Array.isArray(permissoes) || permissoes.length === 0) return false;

    return permissoes.some(
      (p) =>
        p.modulo?.toLowerCase() === modulo.toLowerCase() &&
        (p.visualizar === true || p.visualizar === "true")
    );
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard", key: "dashboard" },
    { name: "Utilizadores", icon: <FaUserShield />, path: "/users", key: "users" },
    { name: "Condomínios", icon: <FaBuilding />, path: "/condominios", key: "condominios" },
    { name: "Edifícios", icon: <FaBuilding />, path: "/edificios", key: "edificios" },
    { name: "Fraçãoes", icon: <FaKey />, path: "/fracoes", key: "fracoes" },
    { name: "Proprietários", icon: <FaUsers />, path: "/proprietarios", key: "proprietarios" },
    { name: "Inquilinos", icon: <FaUsers />, path: "/inquilinos", key: "inquilinos" },
    { name: "Pagamentos", icon: <FaFileInvoiceDollar />, path: "/pagamentos", key: "pagamentos" },
    { name: "Recibos", icon: <FaReceipt />, path: "/recibos", key: "recibos" },
    { name: "Conta Corrente", icon: <FaWallet />, path: "/conta-corrente", key: "conta-corrente" },
    { name: "Serviços Extras", icon: <FaTools />, path: "/servicos-extras", key: "servicos-extras" },
    { name: "Serviços Agendados", icon: <FaClipboardList />, path: "/servicos-agendados", key: "servicos-agendados" },
    { name: "Eventos", icon: <FaCalendarAlt />, path: "/eventos", key: "eventos" },
  ];

  const acessoItems = [
    { name: "Funções / Roles", icon: <FaLock />, path: "/roles", key: "roles" },
    { name: "Permissões", icon: <FaUnlockAlt />, path: "/permissoes", key: "permissoes" },
    { name: "Atribuir Papéis", icon: <FaUserShield />, path: "/atribuir-role", key: "atribuir-role" },
  ];

  return (
    <>
      {/* Botão Hamburger para Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setAberto(!aberto)}
          className="p-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition"
        >
          {aberto ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white z-40 transform transition-transform duration-300
          ${aberto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64 overflow-y-auto`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4B5563 transparent",
        }}
      >
        <style>{`
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-thumb { background-color: #4B5563; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background-color: #6B7280; }
          ::-webkit-scrollbar-track { background: transparent; }
        `}</style>

        {/* Cabeçalho */}
        <div className="p-6 text-lg font-bold border-b border-gray-800">
          Gestão Condominial
        </div>

        {/* Menu principal */}
        <nav className="mt-6 flex flex-col gap-2">
          {menuItems.map((item) => {
            if (!temPermissao(item.key)) return null;
            const ativo = location.pathname === item.path;
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition rounded-r-lg ${
                  ativo ? "bg-gray-700 font-semibold" : ""
                }`}
                onClick={() => setAberto(false)} // fecha sidebar no mobile ao clicar
              >
                {item.icon} {item.name}
              </Link>
            );
          })}

          {/* Separador: Gestão de acessos */}
          {temPermissao("gestao-acessos") && (
            <>
              <div className="mt-6 px-6 text-gray-400 uppercase text-xs tracking-wider">
                Gestão de Acessos
              </div>
              {acessoItems.map((item) => {
                const ativo = location.pathname === item.path;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition rounded-r-lg ${
                      ativo ? "bg-gray-700 font-semibold" : ""
                    }`}
                    onClick={() => setAberto(false)}
                  >
                    {item.icon} {item.name}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>

      {/* Overlay para mobile */}
      {aberto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setAberto(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
