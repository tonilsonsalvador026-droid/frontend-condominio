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
  FaBars,
  FaTimes,
  FaWallet,
  FaLock,
  FaUnlockAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [aberto, setAberto] = useState(true);
  const [permissoes, setPermissoes] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedPerms = localStorage.getItem("permissoes");
    if (storedRole) setRole(storedRole);
    if (storedPerms) setPermissoes(JSON.parse(storedPerms));
  }, []);

  const temPermissao = (modulo) => {
    if (role?.toLowerCase() === "admin") return true;
    if (!Array.isArray(permissoes)) return false;
    return permissoes.some(
      (p) =>
        p.modulo?.toLowerCase() === modulo.toLowerCase() &&
        (p.visualizar === true || p.visualizar === "true")
    );
  };

  return (
    <div
      className="
        fixed top-0 left-0 h-screen
        bg-gray-900 text-white
        w-56 sm:w-60 lg:w-64
        overflow-y-auto
        z-40
      "
    >
      <div className="p-4 text-base sm:text-lg font-bold border-b border-gray-800">
        Gestão Condominial
      </div>

      <nav className="mt-3 flex flex-col text-sm sm:text-base">
        {temPermissao("dashboard") && (
          <Link to="/dashboard" className="menu-item">
            <FaHome className="text-sm" /> Dashboard
          </Link>
        )}

        {temPermissao("users") && (
          <Link to="/users" className="menu-item">
            <FaUserShield className="text-sm" /> Utilizadores
          </Link>
        )}

        {temPermissao("condominios") && (
          <Link to="/condominios" className="menu-item">
            <FaBuilding className="text-sm" /> Condomínios
          </Link>
        )}

        {temPermissao("edificios") && (
          <Link to="/edificios" className="menu-item">
            <FaBuilding className="text-sm" /> Edifícios
          </Link>
        )}

        {temPermissao("fracoes") && (
          <Link to="/fracoes" className="menu-item">
            <FaKey className="text-sm" /> Frações
          </Link>
        )}

        {temPermissao("proprietarios") && (
          <Link to="/proprietarios" className="menu-item">
            <FaUsers className="text-sm" /> Proprietários
          </Link>
        )}

        {temPermissao("inquilinos") && (
          <Link to="/inquilinos" className="menu-item">
            <FaUsers className="text-sm" /> Inquilinos
          </Link>
        )}

        {temPermissao("pagamentos") && (
          <Link to="/pagamentos" className="menu-item">
            <FaFileInvoiceDollar className="text-sm" /> Pagamentos
          </Link>
        )}

        {temPermissao("recibos") && (
          <Link to="/recibos" className="menu-item">
            <FaReceipt className="text-sm" /> Recibos
          </Link>
        )}

        {temPermissao("conta-corrente") && (
          <Link to="/conta-corrente" className="menu-item">
            <FaWallet className="text-sm" /> Conta Corrente
          </Link>
        )}

        {temPermissao("servicos-extras") && (
          <Link to="/servicos-extras" className="menu-item">
            <FaTools className="text-sm" /> Serviços Extras
          </Link>
        )}

        {temPermissao("servicos-agendados") && (
          <Link to="/servicos-agendados" className="menu-item">
            <FaClipboardList className="text-sm" /> Serviços Agendados
          </Link>
        )}

        {temPermissao("eventos") && (
          <Link to="/eventos" className="menu-item">
            <FaCalendarAlt className="text-sm" /> Eventos
          </Link>
        )}
      </nav>

      <style>{`
        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          white-space: nowrap;
        }
        .menu-item:hover {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
