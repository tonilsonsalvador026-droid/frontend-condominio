// src/components/edificios/EdificioDetalhes.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import {
  ArrowLeft,
  Edit3,
  Users,
  Building,
  Clock,
  Mail,
  AlertCircle,
  Home,
  Layers,
  Calendar,
  CreditCard,
} from "lucide-react";
import dayjs from "dayjs";
import { formatCurrency } from "../../utils/formatCurrency"; // ✅ adicionado

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
    pagamentos: [],
    servicos: [],
    eventos: [],
  });

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
        setErro(
          err.response.data?.error ||
            `Erro ${err.response.status}: Não foi possível carregar o edifício.`
        );
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
      // Simulação — substituir por rotas reais no futuro:
      const [pagamentos, servicos, eventos] = await Promise.all([
        api.get(`/proprietarios/${proprietarioId}/pagamentos`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get(`/proprietarios/${proprietarioId}/servicos-agendados`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get(`/proprietarios/${proprietarioId}/eventos`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setDetalhesProprietario({
        pagamentos: pagamentos.data || [],
        servicos: servicos.data || [],
        eventos: eventos.data || [],
      });
    } catch (err) {
      console.error("Erro ao carregar histórico do proprietário:", err);
      setDetalhesProprietario({
        pagamentos: [],
        servicos: [],
        eventos: [],
      });
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

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando detalhes do edifício...
      </div>
    );

  if (erro)
    return (
      <div className="p-8 flex flex-col items-center text-red-600">
        <AlertCircle size={40} className="mb-3" />
        <p>{erro}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Voltar
        </button>
      </div>
    );

  if (!edificio)
    return (
      <div className="p-8 text-center text-red-500">
        Edifício não encontrado.
      </div>
    );

  const moradores =
    edificio.fracoes?.flatMap((f) => [
      ...(f.proprietario ? [f.proprietario] : []),
      ...(f.inquilino ? [f.inquilino] : []),
    ]) || [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Edifício: <span className="text-blue-600">{edificio.nome}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            {edificio.condominio?.nome || "Sem condomínio"}
          </span>
          <button
            onClick={() => navigate(`/edificios/editar/${edificio.id}`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Edit3 size={18} /> Editar
          </button>
        </div>
      </div>

      {/* Corpo dividido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna esquerda */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Informações do Edifício
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <strong>Nome:</strong> {edificio.nome || "—"}
            </p>
            <p>
              <strong>Endereço:</strong> {edificio.endereco || "—"}
            </p>
            <p>
              <strong>Número de andares:</strong>{" "}
              {edificio.numeroAndares ?? "—"}
            </p>
            <p>
              <strong>Número de apartamentos:</strong>{" "}
              {edificio.numeroApartamentos ?? "—"}
            </p>
            <p>
              <strong>Condomínio:</strong> {edificio.condominio?.nome || "—"}
            </p>
            <p>
              <strong>Total de moradores:</strong> {moradores.length}
            </p>
          </div>
        </div>

        {/* Coluna direita - Abas */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow overflow-hidden">
          <div className="border-b flex">
            {[
              { id: "geral", icon: <Building size={16} />, label: "Geral" },
              { id: "moradores", icon: <Users size={16} />, label: "Frações e Moradores" },
              { id: "historico", icon: <Clock size={16} />, label: "Histórico" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setProprietarioSelecionado(null);
                }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo das abas */}
          <div className="p-6">
            {/* Aba Geral */}
            {activeTab === "geral" && (
              <div className="space-y-6">
                <p className="text-gray-600">
                  O edifício <strong>{edificio.nome}</strong> possui{" "}
                  <strong>{edificio.numeroAndares ?? "—"}</strong> andares e{" "}
                  <strong>{edificio.numeroApartamentos ?? "—"}</strong>{" "}
                  apartamentos, com um total de{" "}
                  <strong>{moradores.length}</strong> moradores registados entre
                  proprietários e inquilinos.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                    <Home className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Apartamentos</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {edificio.numeroApartamentos ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                    <Layers className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Andares</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {edificio.numeroAndares ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                    <Users className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Moradores</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {moradores.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

 {/* --- FRAÇÕES E MORADORES (melhorado) --- */}
            {activeTab === "moradores" && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Frações e Moradores
                </h3>

                {edificio.fracoes?.length > 0 ? (
                  <div className="space-y-4">
                    {edificio.fracoes.map((f) => (
                      <div
                        key={f.id}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="space-y-1 text-gray-700 text-sm leading-relaxed">
                          <p>
                            <strong className="text-gray-600"> Andar :</strong>{" "}
                            {f.andar ?? "—"}
                          </p>
                          <p>
                            <strong className="text-gray-600">
                               Apartamento :
                            </strong>{" "}
                            {f.numero ?? "—"}
                          </p>
                          <p>
                            <strong className="text-gray-600">
                               Proprietário :
                            </strong>{" "}
                            {f.proprietario?.nome ?? "—"}
                          </p>
                          <p>
                            <strong className="text-gray-600">
                               Inquilino :
                            </strong>{" "}
                            {f.inquilino?.nome ?? "—"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 border rounded-lg p-6 bg-gray-50">
                    Nenhuma fração registada.
                  </div>
                )}
              </div>
            )}

          {/* Aba Histórico */}
{activeTab === "historico" && (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Histórico de Proprietários
    </h3>

    {moradores.length > 0 ? (
      <div className="space-y-3">
        {moradores.map((p) => {
          // Filtrar pagamentos deste edifício que pertençam ao proprietário atual
          const pagamentosProprietario = historicoPagamentos.filter(
            (pg) =>
              pg.fracao?.proprietarioId === p.id ||
              pg.proprietarioId === p.id
          );

          // Filtrar serviços e eventos conforme o que já tens carregado
          const servicos = detalhesProprietario?.servicos || [];
          const eventos = detalhesProprietario?.eventos || [];

          return (
            <div
              key={p.id}
              onDoubleClick={() => handleDoubleClick(p)}
              className={`cursor-pointer border rounded-lg p-3 ${
                proprietarioSelecionado?.id === p.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center text-sm text-gray-700">
                <p>
                  <strong>{p.nome}</strong>
                </p>
                <span className="text-xs text-gray-500">
                  {p.email || "sem email"}
                </span>
              </div>

              {/* Quando o proprietário for selecionado */}
              {proprietarioSelecionado?.id === p.id && (
                <div className="mt-3 border-t pt-3 space-y-3 text-sm text-gray-700">
                  {/* Pagamentos */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-blue-600">
                      <CreditCard size={14} /> Pagamentos
                    </h4>

                    {pagamentosProprietario.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {pagamentosProprietario.map((pg) => (
                          <li key={pg.id}>
                            {dayjs(pg.dataFormatada || pg.data).format(
                              "DD/MM/YYYY"
                            )}{" "}
                            —{" "}
                            <strong>
                              {formatCurrency(pg.valor || 0)}
                            </strong>{" "}
                            ({pg.estado || "—"})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-xs ml-4">
                        Nenhum pagamento registado.
                      </p>
                    )}
                  </div>

                  {/* Serviços */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-blue-600">
                      <Calendar size={14} /> Serviços agendados
                    </h4>
                    {servicos.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {servicos.map((s) => (
                          <li key={s.id}>{s.nome}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-xs ml-4">
                        Nenhum serviço agendado.
                      </p>
                    )}
                  </div>

                  {/* Eventos */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-blue-600">
                      <Clock size={14} /> Eventos do condomínio
                    </h4>
                    {eventos.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {eventos.map((e) => (
                          <li key={e.id}>{e.nome}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-xs ml-4">
                        Nenhum evento registado.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center text-gray-500 border rounded-lg p-6 bg-gray-50">
        Nenhum proprietário registado neste edifício.
      </div>
    )}
  </div>
)}
          </div>
        </div>
      </div>

      {/* Botão inferior */}
      {moradores.length > 0 && (
        <div className="flex justify-end mt-8">
          <button
            onClick={() => navigate(`/mensagens/enviar?edificioId=${edificio.id}`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow"
          >
            <Mail size={18} /> Enviar mensagem a todos
          </button>
        </div>
      )}
    </div>
  );
};

export default EdificioDetalhes;