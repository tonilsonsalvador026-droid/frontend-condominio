// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBuilding, FaKey, FaFileInvoiceDollar, FaUsers, FaChartLine,
  FaPlus, FaCalendarCheck, FaDollarSign, FaExclamationTriangle
} from "react-icons/fa";
import { motion } from "framer-motion"; // npm install framer-motion (opcional)

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    condominios: 3,
    edificios: 12,
    fracoes: 45,
    pagamentosPendentes: 8,
    pagamentosMes: 32000,
    servicosAgendados: 5
  });
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: payload.nome || "Admin",
          role: payload.role || "admin",
        });
      } catch {
        setUser({ name: "Admin" });
      } finally {
        setLoading(false);
      }
    }, 100);
  }, [navigate]);

  if (loading || !user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const StatsCard = ({ icon, title, value, color, href, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`
        bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl 
        border border-slate-200/50 transition-all duration-300 group
        ${color === 'red' ? 'hover:border-red-200/50' : 
          color === 'green' ? 'hover:border-emerald-200/50' : 
          color === 'blue' ? 'hover:border-blue-200/50' : 'hover:border-purple-200/50'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${color === 'red' ? 'from-red-500/10 to-red-600/10' :
          color === 'green' ? 'from-emerald-500/10 to-emerald-600/10' :
          color === 'blue' ? 'from-blue-500/10 to-blue-600/10' : 'from-purple-500/10 to-purple-600/10'} 
          border backdrop-blur-sm group-hover:scale-110 transition-all`}>
          <icon className={`w-6 h-6 ${color === 'red' ? 'text-red-500' :
            color === 'green' ? 'text-emerald-500' :
            color === 'blue' ? 'text-blue-500' : 'text-purple-500'}`} />
        </div>
        {trend && (
          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            +12%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors">{value}</h3>
      <p className="text-sm text-slate-600 font-medium">{title}</p>
      {href && (
        <Link to={href} className="mt-4 inline-flex items-center text-sm font-semibold text-slate-700 hover:text-blue-600 group-hover:translate-x-1 transition-all">
          Ver detalhes <FaChevronRight className="w-4 h-4 ml-1" />
        </Link>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header Dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Bem-vindo de volta, <span className="font-bold text-slate-900">{user.name}</span> 👋
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <FaPlus className="w-4 h-4 mr-2 inline" /> Nova Fração
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <FaDollarSign className="w-4 h-4 mr-2 inline" /> Emitir Boleto
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          icon={FaBuilding}
          title="Condomínios"
          value={stats.condominios}
          color="blue"
          href="/condominios"
        />
        <StatsCard
          icon={FaBuilding}
          title="Edifícios"
          value={stats.edificios}
          color="purple"
          href="/edificios"
        />
        <StatsCard
          icon={FaKey}
          title="Frações"
          value={stats.fracoes}
          color="emerald"
          href="/fracoes"
        />
        <StatsCard
          icon={FaFileInvoiceDollar}
          title="Pagamentos Pendentes"
          value={stats.pagamentosPendentes}
          color="red"
        />
        <StatsCard
          icon={FaDollarSign}
          title="Faturamento Mês"
          value={`R$ ${stats.pagamentosMes.toLocaleString()}`}
          color="green"
          trend
        />
        <StatsCard
          icon={FaCalendarCheck}
          title="Serviços Agendados"
          value={stats.servicosAgendados}
          color="blue"
          href="/servicos-agendados"
        />
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <FaChartLine className="w-7 h-7 text-blue-600" /> Visão Geral
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <span className="text-lg font-semibold">Total Recebido</span>
              <span className="text-2xl font-bold text-emerald-600">R$ 89.450</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl">
              <span className="text-lg font-semibold">Inadimplência</span>
              <span className="text-2xl font-bold text-red-600">3,2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Atividade Recente</h3>
          <div className="space-y-3">
            {[
              { user: "João Silva", action: "Pagamento recebido", fracao: "A101", time: "2min" },
              { user: "Maria Santos", action: "Fração reservada", fracao: "B205", time: "15min" },
              { user: "Pedro Costa", action: "Serviço agendado", fracao: "C302", time: "1h" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaUsers className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.user}</p>
                  <p className="text-sm text-slate-600">{item.action} - {item.fracao}</p>
                </div>
                <span className="text-xs text-slate-500">{item.time} atrás</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

