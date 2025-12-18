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
  const [aberto, setAberto] = useState(false);
  const [permissoes, setPermissoes] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("role");
      const storedPerms = localStorage.getItem("permissoes");

      if (storedRole) setRole(storedRole);
      if (storedPerms) {
        setPermissoes(JSON.parse(storedPerms));
      }
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    }
  }, []);

  const temPermissao = (modulo) => {
    if (role && role.toLowerCase() === "admin") return true;
    if (!Array.isArray(permissoes) || permissoes.length === 0) return false;

    return permissoes.some(
      (p) =>
        p.modulo?.toLowerCase() === modulo.toLowerCase() &&
        (p.visualizar === true || p.visualizar === "true")
    );
  };

  return (
    <>
      {/* BOTÃO MENU (mobile + desktop) */}
      <button
        onClick={() => setAberto(!aberto)}
        className="
          fixed top-4 left-4 z-50
          p-3 rounded-lg
          bg-gray-900 text-white
          shadow-lg
          hover:bg-gray-800
          lg:hidden
        "
      >
        {aberto ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* OVERLAY (mobile) */}
      {aberto && (
        <div
          onClick={() => setAberto(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen
          w-64
          bg-gray-900 text-white
          transform transition-transform duration-300
          ${aberto ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          lg:static
          lg:z-auto
        `}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4B5563 transparent",
        }}
      >
        <style>{`
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-thumb {
            background-color: #4B5563;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background-color: #6B7280;
          }
          ::-webkit-scrollbar-track { background: transparent; }
        `}</style>

        {/* HEADER */}
        <div className="p-5 text-lg font-bold border-b border-gray-800">
          Gestão Condominial
        </div>

        {/* MENU */}
        <nav className="mt-4 flex flex-col text-sm">
          {temPermissao("dashboard") && (
            <Link to="/dashboard" className="menu-item">
              <FaHome /> Dashboard
            </Link>
          )}

          {temPermissao("users") && (
            <Link to="/users" className="menu-item">
              <FaUserShield /> Utilizadores
            </Link>
          )}

          {temPermissao("condominios") && (
            <Link to="/condominios" className="menu-item">
              <FaBuilding /> Condomínios
            </Link>
          )}

          {temPermissao("edificios") && (
            <Link to="/edificios" className="menu-item">
              <FaBuilding /> Edifícios
            </Link>
          )}

          {temPermissao("fracoes") && (
            <Link to="/fracoes" className="menu-item">
              <FaKey /> Frações
            </Link>
          )}

          {temPermissao("proprietarios") && (
            <Link to="/proprietarios" className="menu-item">
              <FaUsers /> Proprietários
            </Link>
          )}

          {temPermissao("inquilinos") && (
            <Link to="/inquilinos" className="menu-item">
              <FaUsers /> Inquilinos
            </Link>
          )}

          {temPermissao("pagamentos") && (
            <Link to="/pagamentos" className="menu-item">
              <FaFileInvoiceDollar /> Pagamentos
            </Link>
          )}

          {temPermissao("recibos") && (
            <Link to="/recibos" className="menu-item">
              <FaReceipt /> Recibos
            </Link>
          )}

          {temPermissao("conta-corrente") && (
            <Link to="/conta-corrente" className="menu-item">
              <FaWallet /> Conta Corrente
            </Link>
          )}

          {temPermissao("servicos-extras") && (
            <Link to="/servicos-extras" className="menu-item">
              <FaTools /> Serviços Extras
            </Link>
          )}

          {temPermissao("servicos-agendados") && (
            <Link to="/servicos-agendados" className="menu-item">
              <FaClipboardList /> Serviços Agendados
            </Link>
          )}

          {temPermissao("eventos") && (
            <Link to="/eventos" className="menu-item">
              <FaCalendarAlt /> Eventos
            </Link>
          )}

          {temPermissao("gestao-acessos") && (
            <>
              <div className="mt-6 px-6 text-gray-400 uppercase text-xs">
                Gestão de Acessos
              </div>

              <Link to="/roles" className="menu-item">
                <FaLock /> Funções / Roles
              </Link>
              <Link to="/permissoes" className="menu-item">
                <FaUnlockAlt /> Permissões
              </Link>
              <Link to="/atribuir-role" className="menu-item">
                <FaUserShield /> Atribuir Papéis
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* ESTILO DOS ITENS */}
      <style>{`
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
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
