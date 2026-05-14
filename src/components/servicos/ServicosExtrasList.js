import React from "react";
import { Trash2, Edit, FileText } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const ServicosExtrasList = ({ servicos, onDelete, onEdit }) => {
  return (
    <div className="w-full">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200/30">
          <FileText className="w-6 h-6 text-slate-700" />
          <h2 className="text-2xl font-black text-slate-800">
            Lista de Serviços Extras
          </h2>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left border-b border-slate-200/50">
                <th className="py-4 px-3 text-slate-600 font-bold">Nome</th>
                <th className="py-4 px-3 text-slate-600 font-bold">Valor</th>
                <th className="py-4 px-3 text-slate-600 font-bold">Descrição</th>
                <th className="py-4 px-3 text-slate-600 font-bold text-right">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {servicos?.map((srv) => (
                <tr
                  key={srv.id}
                  className="border-b border-slate-100 hover:bg-white/40 transition"
                >
                  <td className="py-4 px-3 font-semibold text-slate-800">
                    {srv.nome}
                  </td>

                  <td className="py-4 px-3 text-slate-700 font-medium">
                    {formatCurrency(Number(srv.valor || 0)).replace("Kz", "").trim()} Kz
                  </td>

                  <td className="py-4 px-3 text-slate-600">
                    {srv.descricao || "—"}
                  </td>

                  <td className="py-4 px-3 text-right">
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => onEdit?.(srv)}
                        className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition"
                      >
                        <Edit size={18} className="text-blue-700" />
                      </button>

                      <button
                        onClick={() => onDelete?.(srv.id)}
                        className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} className="text-red-700" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {(!servicos || servicos.length === 0) && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-slate-500"
                  >
                    Nenhum serviço extra registado.
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

export default ServicosExtrasList;
