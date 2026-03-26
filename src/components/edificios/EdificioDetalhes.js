// src/components/edificios/EdificioDetalhes.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import {
  ArrowLeft, Edit3, Users, Building, Clock, Mail, AlertCircle,
  Home, Layers, Calendar, CreditCard, ChevronLeft
} from "lucide-react";
import dayjs from "dayjs";
import { formatCurrency } from "../../utils/formatCurrency";

const EdificioDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edificio, setEdificio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [activeTab, setActiveTab] = useState("geral");
  const [historicoPagamentos, setHistoricoPagamentos] = useState([]);
  const [proprietarioSelecionado, setProprietarioSelecionado] = useState(null);
  const [detalhesProprietario, setDetalhesProprietario] = useState({
    pagamentos: [], servicos: [], eventos: []
  });

  // TUA LÓGICA 100% IGUAL (fetch, doubleclick, etc)
  useEffect(() => {
    const fetchEdificio = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get(`/edificios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEdificio(res.data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do edifício:", err);
        if (err.response) {
          setErro(err.response.data?.error || `Erro ${err.response.status}`);
        } else {
          setErro("Erro de conexão com o servidor.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEdificio();
  }, [id]);

  const carregarHistoricoProprietario = async (proprietarioId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [pagamentos, servicos, eventos] = await Promise.all([
        api.get(`/proprietarios/${proprietarioId}/pagamentos`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/proprietarios/${proprietarioId}/servicos-agendados`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/proprietarios/${proprietarioId}/eventos`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setDetalhesProprietario({
        pagamentos: pagamentos.data || [],
        servicos: servicos.data || [],
        eventos: eventos.data || [],
      });
    } catch (err) {
      console.error("Erro ao carregar histórico do proprietário:", err);
      setDetalhesProprietario({ pagamentos: [], servicos: [], eventos: [] });
    }
  };

  const handleDoubleClick = (proprietario) => {
    if (proprietarioSelecionado?.id === proprietario.id) {
      setProprietarioSelecionado(null);
    } else {
      setProprietarioSelecionado(proprietario);
      carregarHistoricoProprietario(proprietario.id);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-200/40 shadow-2xl text-center">
        <div className="w-12 h-12 border-2 border-blue-200/50 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl text-slate-600 font-semibold">Carregando detalhes...</p>
      </div>
    </div>
  );

  if (erro) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-red-200/50 shadow-2xl max-w-md mx-auto text-center">
        <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <p className="text-xl font-semibold text-slate-800 mb-4">{erro}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          Voltar
        </button>
      </div>
    </div>
  );

  if (!edificio) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-200/40 shadow-2xl text-center">
        <Building className="w-20 h-20 text-slate-400 mx-auto mb-6" />
        <p className="text-2xl font-bold text-slate-600">Edifício não encontrado</p>
      </div>
    </div>
  );

  const moradores = edificio.fracoes?.flatMap((f) => [
    ...(f.proprietario ? [f.proprietario] : []),
    ...(f.inquilino ? [f.inquilino] : []),
  ]) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 md:px-8">
      {/* Header Glass */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/50 shadow-2xl mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group p-3 bg-slate-100/70 hover:bg-slate-200/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 text-slate-700 font-bold"
              >
                <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Voltar
              </button>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent">
                  {edificio.nome}
                </h1>
                <p className="text-xl text-slate-600 font-semibold mt-1">
                  {edificio.endereco || "Endereço não informado"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 rounded-2xl backdrop-blur-sm text-blue-700 font-bold">
                {edificio.condominio?.nome || "Sem condomínio"}
              </div>
              <button
                onClick={() => navigate(`/edificios/editar/${edificio.id}`)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3"
              >
                <Edit3 className="w-5 h-5" />
                Editar Edifício
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-200/50">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600 font-semibold text-lg">Apartamentos</p>
                <p className="text-3xl font-black text-slate-900">{edificio.numeroApartamentos ?? "—"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-200/50">
                <Layers className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-600 font-semibold text-lg">Andares</p>
                <p className="text-3xl font-black text-slate-900">{edificio.numeroAndares ?? "—"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-200/50">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-600 font-semibold text-lg">Moradores</p>
                <p className="text-3xl font-black text-slate-900">{moradores.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + Conteúdo */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Tabs Glass */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-1 border border-slate-200/50 shadow-2xl">
            <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              {[
                { id: "geral", icon: <Building size={18} />, label: "Geral" },
                { id: "moradores", icon: <Users size={18} />, label: "Frações & Moradores" },
                { id: "historico", icon: <Clock size={18} />, label: "Histórico" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setProprietarioSelecionado(null);
                  }}
                  className={`flex items-center gap-3 px-8 py-4 font-bold transition-all flex-1 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo Tabs */}
          <div className="lg:col-span-3">
            {activeTab === "geral" && (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 lg:p-12 border border-slate-200/50 shadow-2xl">
                <div className="text-center lg:text-left space-y-6">
                  <p className="text-xl lg:text-2xl text-slate-700 font-semibold leading-relaxed max-w-3xl mx-auto lg:mx-0">
                    O edifício <span className="font-black text-blue-600 text-2xl lg:text-3xl">{edificio.nome}</span> possui{" "}
                    <span className="font-black text-emerald-600 text-2xl lg:text-3xl">{edificio.numeroAndares ?? "—"}</span> andares e{" "}
                    <span className="font-black text-purple-600 text-2xl lg:text-3xl">{edificio.numeroApartamentos ?? "—"}</span> apartamentos,
                    com um total de <span className="font-black text-slate-900 text-2xl lg:text-3xl">{moradores.length}</span> moradores.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "moradores" && (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 lg:p-12 border border-slate-200/50 shadow-2xl space-y-8">
                <h3 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-8">
                  Frações e Moradores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {edificio.fracoes?.length > 0 ? (
                    edificio.fracoes.map((f) => (
                      <div key={f.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group">
                        <div className="space-y-4 text-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-200/50 flex items-center justify-center">
                              <Home className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xl text-slate-900">Fr. {f.numero} / Andar {f.andar}</h4>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                            <div>
                              <p className="text-sm text-slate-500 font-medium">Proprietário</p>
                              <p className="font-semibold">{f.proprietario?.nome ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 font-medium">Inquilino</p>
                              <p className="font-semibold">{f.inquilino?.nome ?? "—"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-slate-50/80 backdrop-blur-sm rounded-3xl p-16 border-2 border-dashed border-slate-300/50 text-center">
                      <Home className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-slate-600 mb-2">Nenhuma fração registada</h3>
                      <p className="text-lg text-slate-500">Este edifício ainda não tem frações cadastradas</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "historico" && (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 lg:p-12 border border-slate-200/50 shadow-2xl space-y-8">
                <h3 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-8">
                  Histórico de Moradores
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {moradores.length > 0 ? (
                    moradores.map((p) => {
                      const pagamentosProprietario = historicoPagamentos.filter(
                        (pg) => pg.fracao?.proprietarioId === p.id || pg.proprietarioId === p.id
                      );
                      return (
                        <div
                          key={p.id}
                          onDoubleClick={() => handleDoubleClick(p)}
                          className={`group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all ${
                            proprietarioSelecionado?.id === p.id ? "border-blue-400 bg-blue-50/80 ring-2 ring-blue-200/50" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-black text-xl text-slate-900 group-hover:text-blue-900 transition-colors">
                                {p.nome}
                              </h4>
                              <p className="text-slate-600">{p.email || "sem email"}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                              proprietarioSelecionado?.id === p.id 
                                ? "bg-blue-600 text-white" 
                                : "bg-slate-200 text-slate-700 group-hover:bg-slate-300"
                            }`}>
                              {proprietarioSelecionado?.id === p.id ? "Expandido" : "Clique 2x"}
                            </div>
                          </div>

                          {proprietarioSelecionado?.id === p.id && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200/50">
                              <div className="space-y-3">
                                <h5 className="font-bold flex items-center gap-2 text-blue-600 text-lg">
                                  <CreditCard className="w-5 h-5" /> Pagamentos
                                </h5>
                                {pagamentosProprietario.length > 0 ? (
                                  pagamentosProprietario.slice(0, 5).map((pg) => (
                                    <div key={pg.id} className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/50 text-sm">
                                      <p className="font-mono text-emerald-700">
                                        {dayjs(pg.dataFormatada || pg.data).format("DD/MM/YY")}
                                      </p>
                                      <p className="font-bold text-lg">{formatCurrency(pg.valor || 0)}</p>
                                      <p className="text-xs text-slate-500 capitalize">{pg.estado || "—"}</p>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-slate-500 italic text-sm p-4 bg-slate-50/50 rounded-xl">Nenhum pagamento</p>
                                )}
                              </div>

                              <div className="space-y-3">
                                <h5 className="font-bold flex items-center gap-2 text-emerald-600 text-lg">
                                  <Calendar className="w-5 h-5" /> Serviços
                                </h5>
                                {detalhesProprietario.servicos.length > 0 ? (
                                  detalhesProprietario.servicos.slice(0, 5).map((s) => (
                                    <div key={s.id} className="bg-blue-50/50 p-3 rounded-xl border border-blue-200/50 text-sm">
                                      {s.nome}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-slate-500 italic text-sm p-4 bg-slate-50/50 rounded-xl">Nenhum serviço</p>
                                )}
                              </div>

                              <div className="space-y-3">
                                <h5 className="font-bold flex items-center gap-2 text-purple-600 text-lg">
                                  <Clock className="w-5 h-5" /> Eventos
                                </h5>
                                {detalhesProprietario.eventos.length > 0 ? (
                                  detalhesProprietario.eventos.slice(0, 5).map((e) => (
                                    <div key={e.id} className="bg-purple-50/50 p-3 rounded-xl border border-purple-200/50 text-sm">
                                      {e.nome}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-slate-500 italic text-sm p-4 bg-slate-50/50 rounded-xl">Nenhum evento</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-16 border-2 border-dashed border-slate-300/50 text-center">
                      <Users className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-slate-600 mb-2">Sem moradores</h3>
                      <p className="text-lg text-slate-500">Este edifício não tem moradores registados</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botão Mensagem (final) */}
        {moradores.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12 text-center">
            <button
              onClick={() => navigate(`/mensagens/enviar?edificioId=${edificio.id}`)}
              className="px-12 py-6 bg-gradient-to-r from-blue-600 via-emerald-600 to-purple-600 hover:from-blue-700 hover:via-emerald-700 hover:to-purple-700 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-4 mx-auto"
            >
              <Mail className="w-7 h-7" />
              Enviar Mensagem a Todos ({moradores.length} moradores)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EdificioDetalhes;
