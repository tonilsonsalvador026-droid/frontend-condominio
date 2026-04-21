// src/components/pagamentos/PagamentoEliminado.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";

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
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl flex items-center gap-4">
        <div className="p-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Pagamentos Eliminados
          </h1>
          <p className="text-slate-600 font-medium">
            Lista de pagamentos removidos do sistema
          </p>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-slate-100 text-slate-700 text-left">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Valor</th>
                <th className="p-4 font-semibold">Descrição</th>
                <th className="p-4 font-semibold">Utilizador</th>
                <th className="p-4 font-semibold">Fração</th>
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold">Vencimento</th>
              </tr>
            </thead>

            <tbody>
              {pagamentos.map((p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-none hover:bg-slate-50 transition"
                >
                  <td className="p-4 font-medium text-slate-700">
                    #{p.id}
                  </td>

                  <td className="p-4 font-semibold text-slate-800">
                    {formatarValor(p.valor)}
                  </td>

                  <td className="p-4 text-slate-600">
                    {p.descricao || "-"}
                  </td>

                  <td className="p-4 text-slate-600">
                    {p.user?.nome || "-"}
                  </td>

                  <td className="p-4 text-slate-600">
                    {p.fracao?.numero || "-"}
                  </td>

                  <td className="p-4 text-slate-600">
                    {p.data
                      ? dayjs(p.data).format("DD/MM/YYYY")
                      : "-"}
                  </td>

                  <td className="p-4 text-slate-600">
                    {p.vencimento
                      ? dayjs(p.vencimento).format("DD/MM/YYYY")
                      : "-"}
                  </td>
                </tr>
              ))}

              {pagamentos.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-6 text-center text-slate-500"
                  >
                    Nenhum pagamento eliminado encontrado.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default PagamentoEliminado;
