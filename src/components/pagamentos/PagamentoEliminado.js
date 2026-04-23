// src/components/pagamentos/PagamentoEliminado.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import dayjs from "dayjs";
import { CreditCard } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* 🔹 HEADER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-slate-200/50 shadow-2xl mb-12">
          <div className="flex flex-col gap-2">

            <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Pagamentos Eliminados
            </h1>

            <p className="text-slate-600 font-semibold">
              Histórico de pagamentos removidos do sistema
            </p>

          </div>
        </div>

        {/* 🔹 TABELA */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 shadow-2xl">

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="py-4 px-3 font-bold text-slate-600">ID</th>
                  <th className="py-4 px-3 font-bold text-slate-600">Valor</th>
                  <th className="py-4 px-3 font-bold text-slate-600">Descrição</th>
                  <th className="py-4 px-3 font-bold text-slate-600">Utilizador</th>
                  <th className="py-4 px-3 font-bold text-slate-600">Fração</th>
                  <th className="py-4 px-3 font-bold text-slate-600">Data</th>
                  <th className="py-4 px-3 font-bold text-slate-600">Vencimento</th>
                </tr>
              </thead>

              <tbody>
                {pagamentos.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-none hover:bg-slate-50/60 transition-all"
                  >
                    <td className="py-4 px-3 font-semibold text-slate-800">
                      #{p.id}
                    </td>

                    <td className="py-4 px-3 font-bold text-emerald-600">
                      {formatarValor(p.valor)}
                    </td>

                    <td className="py-4 px-3 text-slate-700">
                      {p.descricao || "-"}
                    </td>

                    <td className="py-4 px-3 text-slate-700">
                      {p.user?.nome || "-"}
                    </td>

                    <td className="py-4 px-3 text-slate-700">
                      {p.fracao?.numero || "-"}
                    </td>

                    <td className="py-4 px-3 text-slate-600">
                      {p.data ? dayjs(p.data).format("DD/MM/YYYY") : "-"}
                    </td>

                    <td className="py-4 px-3 text-slate-600">
                      {p.vencimento
                        ? dayjs(p.vencimento).format("DD/MM/YYYY")
                        : "-"}
                    </td>
                  </tr>
                ))}

                {pagamentos.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-10 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-500">
                        <CreditCard className="w-10 h-10 opacity-40" />
                        <p className="font-semibold">
                          Nenhum pagamento eliminado encontrado
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PagamentoEliminado;
