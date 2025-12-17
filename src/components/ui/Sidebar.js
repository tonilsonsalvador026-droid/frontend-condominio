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
  const [openMobile, setOpenMobile] = useState(false);
  const [permissoes, setPermissoes] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("role");
      const storedPerms = localStorage.getItem("permissoes");

      if (storedRole) setRole(storedRole);
      if (storedPerms) setPermissoes(JSON.parse(storedPerms));
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

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      onClick={() => setOpenMobile(false)}
      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition"
    >
      <Icon /> {label}
    </Link>
  );

  return (
    <>
      {/* BOTÃO HAMBURGER (APENAS MOBILE) */}
      <button
        onClick={() => setOpenMobile(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800 text-white rounded-lg shadow-lg"
      >
        <FaBars size={20} />
      </button>

      {/* OVERLAY MOBILE */}
      {openMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white
          transform transition-transform duration-300
          ${openMobile ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOPO */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <span className="text-lg font-bold">Gestão Condominial</span>
          <button
            onClick={() => setOpenMobile(false)}
            className="md:hidden"
          >
            <FaTimes />
          </button>
        </div>

        {/* MENU */}
        <nav className="mt-4 flex flex-col gap-1 overflow-y-auto">
          {temPermissao("dashboard") && (
            <NavLink to="/dashboard" icon={FaHome} label="Dashboard" />
          )}

          {temPermissao("users") && (
            <NavLink to="/users" icon={FaUserShield} label="Utilizadores" />
          )}

          {temPermissao("condominios") && (
            <NavLink to="/condominios" icon={FaBuilding} label="Condomínios" />
          )}

          {temPermissao("edificios") && (
            <NavLink to="/edificios" icon={FaBuilding} label="Edifícios" />
          )}

          {temPermissao("fracoes") && (
            <NavLink to="/fracoes" icon={FaKey} label="Frações" />
          )}

          {temPermissao("proprietarios") && (
            <NavLink to="/proprietarios" icon={FaUsers} label="Proprietários" />
          )}

          {temPermissao("inquilinos") && (
            <NavLink to="/inquilinos" icon={FaUsers} label="Inquilinos" />
          )}

          {temPermissao("pagamentos") && (
            <NavLink to="/pagamentos" icon={FaFileInvoiceDollar} label="Pagamentos" />
          )}

          {temPermissao("recibos") && (
            <NavLink to="/recibos" icon={FaReceipt} label="Recibos" />
          )}

          {temPermissao("conta-corrente") && (
            <NavLink to="/conta-corrente" icon={FaWallet} label="Conta Corrente" />
          )}

          {temPermissao("servicos-extras") && (
            <NavLink to="/servicos-extras" icon={FaTools} label="Serviços Extras" />
          )}

          {temPermissao("servicos-agendados") && (
            <NavLink to="/servicos-agendados" icon={FaClipboardList} label="Serviços Agendados" />
          )}

          {temPermissao("eventos") && (
            <NavLink to="/eventos" icon={FaCalendarAlt} label="Eventos" />
          )}

          {temPermissao("gestao-acessos") && (
            <>
              <div className="mt-6 px-6 text-gray-400 uppercase text-xs">
                Gestão de Acessos
              </div>

              <NavLink to="/roles" icon={FaLock} label="Funções / Roles" />
              <NavLink to="/permissoes" icon={FaUnlockAlt} label="Permissões" />
              <NavLink to="/atribuir-role" icon={FaUserShield} label="Atribuir Papéis" />
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
