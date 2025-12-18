import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const Sidebar = () => {
  const [permissoes, setPermissoes] = useState([]);
  const [role, setRole] = useState("");

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

  return (
    <div
      className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white overflow-y-auto z-40"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#4B5563 transparent",
      }}
    >
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #6B7280;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      {/* Cabeçalho */}
      <div className="p-6 text-lg font-bold border-b border-gray-800">
        Gestão Condominial
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-2">
        {temPermissao("dashboard") && (
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaHome /> Dashboard
          </Link>
        )}
        {temPermissao("users") && (
          <Link
            to="/users"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaUserShield /> Utilizadores
          </Link>
        )}
        {temPermissao("condominios") && (
          <Link
            to="/condominios"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaBuilding /> Condomínios
          </Link>
        )}
        {temPermissao("edificios") && (
          <Link
            to="/edificios"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaBuilding /> Edifícios
          </Link>
        )}
        {temPermissao("fracoes") && (
          <Link
            to="/fracoes"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaKey /> Frações
          </Link>
        )}
        {temPermissao("proprietarios") && (
          <Link
            to="/proprietarios"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaUsers /> Proprietários
          </Link>
        )}
        {temPermissao("inquilinos") && (
          <Link
            to="/inquilinos"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaUsers /> Inquilinos
          </Link>
        )}
        {temPermissao("pagamentos") && (
          <Link
            to="/pagamentos"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaFileInvoiceDollar /> Pagamentos
          </Link>
        )}
        {temPermissao("recibos") && (
          <Link
            to="/recibos"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaReceipt /> Recibos
          </Link>
        )}
        {temPermissao("conta-corrente") && (
          <Link
            to="/conta-corrente"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaWallet /> Conta Corrente
          </Link>
        )}
        {temPermissao("servicos-extras") && (
          <Link
            to="/servicos-extras"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaTools /> Serviços Extras
          </Link>
        )}
        {temPermissao("servicos-agendados") && (
          <Link
            to="/servicos-agendados"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaClipboardList /> Serviços Agendados
          </Link>
        )}
        {temPermissao("eventos") && (
          <Link
            to="/eventos"
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
          >
            <FaCalendarAlt /> Eventos
          </Link>
        )}

        {/* Gestão de Acessos */}
        {temPermissao("gestao-acessos") && (
          <>
            <div className="mt-6 px-6 text-gray-400 uppercase text-xs tracking-wider">
              Gestão de Acessos
            </div>
            <Link
              to="/roles"
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
            >
              <FaLock /> Funções / Roles
            </Link>
            <Link
              to="/permissoes"
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
            >
              <FaUnlockAlt /> Permissões
            </Link>
            <Link
              to="/atribuir-role"
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
            >
              <FaUserShield /> Atribuir Papéis
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
