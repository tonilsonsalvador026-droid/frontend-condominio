// src/components/pagamentos/PagamentoDetalhe.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";

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

  if (loading) return <p className="text-gray-500">Carregando detalhe...</p>;
  if (!pagamento) return <p className="text-red-500">Pagamento não encontrado.</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Detalhe do Pagamento #{pagamento.id}
      </h2>

      {/* Dados principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Valor</p>
          <p className="font-medium">{formatCurrency(pagamento.valor)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Estado</p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              pagamento.estado === "PAGO"
                ? "bg-green-100 text-green-700"
                : pagamento.estado === "PENDENTE"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {pagamento.estado}
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-500">Descrição</p>
          <p className="font-medium">{pagamento.descricao || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Data</p>
          <p className="font-medium">
            {pagamento.data ? dayjs(pagamento.data).format("DD/MM/YYYY") : "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Vencimento</p>
          <p className="font-medium">
            {pagamento.vencimento ? dayjs(pagamento.vencimento).format("DD/MM/YYYY") : "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Utilizador</p>
          <p className="font-medium">{pagamento.user?.nome || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Fração</p>
          <p className="font-medium">{pagamento.fracao?.numero || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Proprietário</p>
          <p className="font-medium">{pagamento.proprietario?.nome || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Inquilino</p>
          <p className="font-medium">{pagamento.inquilino?.nome || "-"}</p>
        </div>
      </div>

      {/* Histórico de alterações */}
      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Histórico de alterações</h3>
        {pagamento.historico && pagamento.historico.length > 0 ? (
          <ul className="space-y-2">
            {pagamento.historico.map((h) => (
              <li
                key={h.id}
                className="border p-3 rounded-lg flex flex-col gap-1 bg-gray-50"
              >
                <p className="text-sm text-gray-600">
                  <strong>{h.user?.nome || "Usuário desconhecido"}</strong> realizou <strong>{h.acao}</strong>
                </p>
                <p className="text-sm text-gray-700">{h.detalhe}</p>
                <p className="text-xs text-gray-400">
                  {dayjs(h.data).format("DD/MM/YYYY HH:mm")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhuma alteração registrada.</p>
        )}
      </div>

      {/* Botão voltar */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/pagamentos")}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Voltar à lista
        </button>
      </div>
    </div>
  );
};

export default PagamentoDetalhe;