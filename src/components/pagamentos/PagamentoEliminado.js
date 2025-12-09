// src/components/pagamentos/PagamentoEliminado.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import dayjs from "dayjs";

const PagamentoEliminado = () => {
  const [pagamentos, setPagamentos] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get("/pagamentos/eliminados");
      setPagamentos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar pagamentos eliminados:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatarValor = (valor) => {
    if (valor == null) return "-";
    return valor.toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Pagamentos Eliminados
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Utilizador</th>
              <th className="p-2">Fração</th>
              <th className="p-2">Data</th>
              <th className="p-2">Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 border-b last:border-none"
              >
                <td className="p-2">{p.id}</td>
                <td className="p-2">{formatarValor(p.valor)}</td>
                <td className="p-2">{p.descricao || "-"}</td>
                <td className="p-2">{p.user?.nome || "-"}</td>
                <td className="p-2">{p.fracao?.numero || "-"}</td>
                <td className="p-2">
                  {p.data ? dayjs(p.data).format("DD/MM/YYYY") : "-"}
                </td>
                <td className="p-2">
                  {p.vencimento ? dayjs(p.vencimento).format("DD/MM/YYYY") : "-"}
                </td>
              </tr>
            ))}
            {pagamentos.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Nenhum pagamento eliminado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PagamentoEliminado;