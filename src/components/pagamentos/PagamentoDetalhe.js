// src/components/pagamentos/PagamentoDetalhe.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import { ArrowLeft, FileText, User } from "lucide-react";

const PagamentoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pagamento, setPagamento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPagamento = async () => {
      try {
        const res = await api.get(`/pagamentos/${id}`);
        setPagamento(res.data);
      } catch (error) {
        console.error("Erro ao carregar detalhe do pagamento:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPagamento();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Carregando detalhe...
      </div>
    );

  if (!pagamento)
    return (
      <div className="text-center py-10 text-red-500">
        Pagamento não encontrado.
      </div>
    );

  const estadoClasses =
    pagamento.estado === "PAGO"
      ? "bg-green-100 text-green-700"
      : pagamento.estado === "PENDENTE"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Pagamento #{pagamento.id}
            </h1>
            <p className="text-slate-600 font-medium">
              Detalhes completos do pagamento
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/pagamentos")}
          className="flex items-center gap-2 px-5 py-3 bg-slate-700 text-white rounded-2xl hover:scale-105 transition"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>

      {/* DADOS PRINCIPAIS */}
      <div className="bg-white rounded-3xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Valor</p>
          <p className="text-xl font-bold text-slate-800">
            {formatCurrency(pagamento.valor)}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Estado</p>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoClasses}`}>
            {pagamento.estado}
          </span>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Descrição</p>
          <p className="font-medium text-slate-800">
            {pagamento.descricao || "-"}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Data</p>
          <p className="font-medium text-slate-800">
            {pagamento.data
              ? dayjs(pagamento.data).format("DD/MM/YYYY")
              : "-"}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Vencimento</p>
          <p className="font-medium text-slate-800">
            {pagamento.vencimento
              ? dayjs(pagamento.vencimento).format("DD/MM/YYYY")
              : "-"}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Utilizador</p>
          <p className="font-medium text-slate-800">
            {pagamento.user?.nome || "-"}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Fração</p>
          <p className="font-medium text-slate-800">
            {pagamento.fracao?.numero || "-"}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Proprietário</p>
          <p className="font-medium text-slate-800">
            {pagamento.proprietario?.nome || "-"}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-sm text-slate-500">Inquilino</p>
          <p className="font-medium text-slate-800">
            {pagamento.inquilino?.nome || "-"}
          </p>
        </div>

      </div>

      {/* HISTÓRICO */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          Histórico de alterações
        </h3>

        {pagamento.historico && pagamento.historico.length > 0 ? (
          <div className="space-y-4">
            {pagamento.historico.map((h) => (
              <div
                key={h.id}
                className="p-5 rounded-2xl bg-slate-50 border flex flex-col gap-2"
              >
                <p className="text-sm text-slate-600">
                  <strong>{h.user?.nome || "Usuário desconhecido"}</strong>{" "}
                  realizou <strong>{h.acao}</strong>
                </p>

                <p className="text-sm text-slate-700">{h.detalhe}</p>

                <p className="text-xs text-slate-400">
                  {dayjs(h.data).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">
            Nenhuma alteração registrada.
          </p>
        )}
      </div>

    </div>
  );
};

export default PagamentoDetalhe;
