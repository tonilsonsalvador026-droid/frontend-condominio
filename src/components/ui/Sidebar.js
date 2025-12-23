// src/components/ui/Sidebar.js
import React, { useEffect, useState } from "react";
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
  FaWallet,
  FaLock,
  FaUnlockAlt,
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
    if (window.innerWidth < 768) {
      setAberto(false);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard", key: "dashboard" },
    { name: "Utilizadores", icon: <FaUserShield />, path: "/users", key: "users" },
    { name: "Condomínios", icon: <FaBuilding />, path: "/condominios", key: "condominios" },
    { name: "Edifícios", icon: <FaBuilding />, path: "/edificios", key: "edificios" },
    { name: "Frações", icon: <FaKey />, path: "/fracoes", key: "fracoes" },
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
      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-64
          bg-gray-900 text-white z-40
          transform transition-transform duration-300
          ${aberto ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          overflow-y-auto
        `}
      >
        <div className="p-6 text-lg font-bold border-b border-gray-800">
          Gestão Condominial
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {menuItems.map((item) => {
            if (!temPermissao(item.key)) return null;
            const ativo = location.pathname === item.path;

            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={fecharNoMobile}
                className={`flex items-center gap-3 px-6 py-3 transition rounded-r-lg
                  ${ativo ? "bg-gray-700 font-semibold" : "hover:bg-gray-800"}
                `}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}

          {temPermissao("gestao-acessos") && (
            <>
              <div className="mt-6 px-6 text-gray-400 uppercase text-xs">
                Gestão de Acessos
              </div>

              {acessoItems.map((item) => {
                const ativo = location.pathname === item.path;

                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={fecharNoMobile}
                    className={`flex items-center gap-3 px-6 py-3 transition rounded-r-lg
                      ${ativo ? "bg-gray-700 font-semibold" : "hover:bg-gray-800"}
                    `}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </aside>

      {/* Overlay mobile */}
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


