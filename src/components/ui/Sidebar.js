// src/components/ui/Sidebar.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome, FaUsers, FaFileInvoiceDollar, FaBuilding, FaKey, 
  FaReceipt, FaCalendarAlt, FaTools, FaClipboardList, FaUserShield, 
  FaWallet, FaLock, FaUnlockAlt
} from "react-icons/fa";

const Sidebar = ({ aberto, setAberto }) => {
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

  const fecharNoMobile = () => {
    if (window.innerWidth < 768) setAberto(false);
  };

  const menuItems = [
    { name: "Dashboard", icon: FaHome, path: "/dashboard", key: "dashboard" },
    { name: "Utilizadores", icon: FaUserShield, path: "/users", key: "users" },
    { name: "Condomínios", icon: FaBuilding, path: "/condominios", key: "condominios" },
    { name: "Edifícios", icon: FaBuilding, path: "/edificios", key: "edificios" },
    { name: "Frações", icon: FaKey, path: "/fracoes", key: "fracoes" },
    { name: "Proprietários", icon: FaUsers, path: "/proprietarios", key: "proprietarios" },
    { name: "Inquilinos", icon: FaUsers, path: "/inquilinos", key: "inquilinos" },
    { name: "Pagamentos", icon: FaFileInvoiceDollar, path: "/pagamentos", key: "pagamentos" },
    { name: "Recibos", icon: FaReceipt, path: "/recibos", key: "recibos" },
    { name: "Conta Corrente", icon: FaWallet, path: "/conta-corrente", key: "conta-corrente" },
    { name: "Serviços Extras", icon: FaTools, path: "/servicos-extras", key: "servicos-extras" },
    { name: "Serviços Agendados", icon: FaClipboardList, path: "/servicos-agendados", key: "servicos-agendados" },
    { name: "Eventos", icon: FaCalendarAlt, path: "/eventos", key: "eventos" },
  ];

  const acessoItems = [
    { name: "Funções / Roles", icon: FaLock, path: "/roles", key: "roles" },
    { name: "Permissões", icon: FaUnlockAlt, path: "/permissoes", key: "permissoes" },
    { name: "Atribuir Papéis", icon: FaUserShield, path: "/atribuir-role", key: "atribuir-role" },
  ];

  return (
    <>
      <aside className={`
        fixed md:static top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-900/95 to-slate-900/80
        backdrop-blur-xl border-r border-slate-800/50 text-white z-50 shadow-2xl
        transform -translate-x-full md:translate-x-0 transition-all duration-300 ease-in-out
        ${aberto ? 'translate-x-0' : ''} overflow-y-auto
      `}>
        {/* Logo/Header */}
        <div className="p-8 pb-4 border-b border-slate-800/50 sticky top-0 bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center">
              <FaBuilding className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                CondoPro
              </h1>
              <p className="text-xs text-slate-400 font-medium">Gestão Premium</p>
            </div>
          </div>
        </div>

        {/* Menu Principal */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            if (!temPermissao(item.key)) return null;
            const ativo = location.pathname === item.path;
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={fecharNoMobile}
                className={`
                  flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group relative
                  ${ativo 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:shadow-lg hover:shadow-slate-500/10 border border-transparent'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${ativo ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'}`} />
                <span className="font-medium text-sm">{item.name}</span>
                {ativo && (
                  <div className="absolute right-4 w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full shadow-lg" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Gestão de Acessos */}
        {temPermissao("gestao-acessos") && (
          <>
            <div className="px-6 py-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            </div>
            <div className="px-4 pb-6 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                🔐 Gestão de Acessos
              </div>
              {acessoItems.map((item) => {
                const ativo = location.pathname === item.path;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={fecharNoMobile}
                    className={`
                      flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 group
                      ${ativo 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border border-emerald-500/30 shadow-lg' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:shadow-md'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </aside>

      {/* Overlay Mobile */}
      {aberto && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setAberto(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
