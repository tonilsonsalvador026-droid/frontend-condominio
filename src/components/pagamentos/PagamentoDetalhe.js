// src/components/pagamentos/PagamentoDetalhe.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import { ChevronLeft, CreditCard, User, Calendar, AlertCircle } from "lucide-react";

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

  // 🔄 LOADING MODERNO
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-center">
          <div className="w-12 h-12 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-600">
            Carregando detalhe...
          </p>
        </div>
      </div>
    );

  // ❌ NÃO ENCONTRADO
  if (!pagamento)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700">
            Pagamento não encontrado
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* 🔹 HEADER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl flex flex-col lg:flex-row justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/pagamentos")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>

            <div>
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Pagamento #{pagamento.id}
              </h1>
              <p className="text-slate-600 font-semibold">
                Detalhes completos do pagamento
              </p>
            </div>
          </div>

          <div
            className={`px-6 py-3 rounded-2xl font-bold ${
              pagamento.estado === "PAGO"
                ? "bg-green-100 text-green-700"
                : pagamento.estado === "PENDENTE"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {pagamento.estado}
          </div>
        </div>

        {/* 🔹 DADOS PRINCIPAIS */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Informações do Pagamento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-slate-500">Valor</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(pagamento.valor)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Descrição</p>
              <p className="font-semibold text-slate-800">
                {pagamento.descricao || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Data</p>
              <p className="font-semibold">
                {pagamento.data
                  ? dayjs(pagamento.data).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Vencimento</p>
              <p className="font-semibold">
                {pagamento.vencimento
                  ? dayjs(pagamento.vencimento).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Utilizador</p>
              <p className="font-semibold">
                {pagamento.user?.nome || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Fração</p>
              <p className="font-semibold">
                {pagamento.fracao?.numero || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Proprietário</p>
              <p className="font-semibold">
                {pagamento.proprietario?.nome || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Inquilino</p>
              <p className="font-semibold">
                {pagamento.inquilino?.nome || "-"}
              </p>
            </div>

          </div>
        </div>

        {/* 🔹 HISTÓRICO */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border shadow-2xl">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Histórico de Alterações
          </h2>

          {pagamento.historico && pagamento.historico.length > 0 ? (
            <div className="space-y-4">
              {pagamento.historico.map((h) => (
                <div
                  key={h.id}
                  className="bg-slate-50 rounded-2xl p-4 border shadow-sm"
                >
                  <p className="text-sm text-slate-600">
                    <strong>{h.user?.nome || "Usuário desconhecido"}</strong>{" "}
                    realizou <strong>{h.acao}</strong>
                  </p>

                  <p className="text-slate-700 font-medium">
                    {h.detalhe}
                  </p>

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
    </div>
  );
};

export default PagamentoDetalhe;
