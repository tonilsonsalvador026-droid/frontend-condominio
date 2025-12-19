// src/components/ui/Sidebar.js
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
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const [permissoes, setPermissoes] = useState([]);
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false); // mobile toggle

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

  const fecharMobile = () => setOpen(false);

  return (
    <>
      {/* Botão ☰ Mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow"
      >
        <FaBars />
      </button>

      {/* Overlay Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={fecharMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4B5563 transparent",
        }}
      >
        {/* Scrollbar */}
        <style>{`
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-thumb {
            background-color: #4B5563;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background-color: #6B7280;
          }
        `}</style>

        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <span className="text-lg font-bold">Gestão Condominial</span>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={fecharMobile}
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 flex flex-col gap-1">
          {temPermissao("dashboard") && (
            <Link to="/dashboard" onClick={fecharMobile} className="menu-item">
              <FaHome /> Dashboard
            </Link>
          )}

          {temPermissao("users") && (
            <Link to="/users" onClick={fecharMobile} className="menu-item">
              <FaUserShield /> Utilizadores
            </Link>
          )}

          {temPermissao("condominios") && (
            <Link to="/condominios" onClick={fecharMobile} className="menu-item">
              <FaBuilding /> Condomínios
            </Link>
          )}

          {temPermissao("edificios") && (
            <Link to="/edificios" onClick={fecharMobile} className="menu-item">
              <FaBuilding /> Edifícios
            </Link>
          )}

          {temPermissao("fracoes") && (
            <Link to="/fracoes" onClick={fecharMobile} className="menu-item">
              <FaKey /> Frações
            </Link>
          )}

          {temPermissao("proprietarios") && (
            <Link to="/proprietarios" onClick={fecharMobile} className="menu-item">
              <FaUsers /> Proprietários
            </Link>
          )}

          {temPermissao("inquilinos") && (
            <Link to="/inquilinos" onClick={fecharMobile} className="menu-item">
              <FaUsers /> Inquilinos
            </Link>
          )}

          {temPermissao("pagamentos") && (
            <Link to="/pagamentos" onClick={fecharMobile} className="menu-item">
              <FaFileInvoiceDollar /> Pagamentos
            </Link>
          )}

          {temPermissao("recibos") && (
            <Link to="/recibos" onClick={fecharMobile} className="menu-item">
              <FaReceipt /> Recibos
            </Link>
          )}

          {temPermissao("conta-corrente") && (
            <Link
              to="/conta-corrente"
              onClick={fecharMobile}
              className="menu-item"
            >
              <FaWallet /> Conta Corrente
            </Link>
          )}

          {temPermissao("servicos-extras") && (
            <Link
              to="/servicos-extras"
              onClick={fecharMobile}
              className="menu-item"
            >
              <FaTools /> Serviços Extras
            </Link>
          )}

          {temPermissao("servicos-agendados") && (
            <Link
              to="/servicos-agendados"
              onClick={fecharMobile}
              className="menu-item"
            >
              <FaClipboardList /> Serviços Agendados
            </Link>
          )}

          {temPermissao("eventos") && (
            <Link to="/eventos" onClick={fecharMobile} className="menu-item">
              <FaCalendarAlt /> Eventos
            </Link>
          )}

          {temPermissao("gestao-acessos") && (
            <>
              <div className="mt-6 px-6 text-xs uppercase tracking-wider text-gray-400">
                Gestão de Acessos
              </div>

              <Link to="/roles" onClick={fecharMobile} className="menu-item">
                <FaLock /> Funções / Roles
              </Link>

              <Link
                to="/permissoes"
                onClick={fecharMobile}
                className="menu-item"
              >
                <FaUnlockAlt /> Permissões
              </Link>

              <Link
                to="/atribuir-role"
                onClick={fecharMobile}
                className="menu-item"
              >
                <FaUserShield /> Atribuir Papéis
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Classe reutilizável */}
      <style>{`
        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          transition: background 0.2s;
        }
        .menu-item:hover {
          background-color: #374151;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
