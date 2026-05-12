import React from "react";
import { Trash2, Pencil } from "lucide-react";
const ServicoExtraTable = ({
  servicos,
  onDelete,
  onEdit,
}) => {

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200/50 shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">
            Lista de Serviços
          </h2>

          <p className="text-slate-500 mt-1">
            {servicos.length} serviços encontrados
          </p>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">

          <thead>
            <tr className="border-b border-slate-200 text-slate-600">

              <th className="text-left py-4 px-3 font-bold">
                Nome
              </th>

              <th className="text-left py-4 px-3 font-bold">
                Valor
              </th>

              <th className="text-left py-4 px-3 font-bold">
                Descrição
              </th>

              <th className="text-center py-4 px-3 font-bold">
                Ações
              </th>

            </tr>
          </thead>

          <tbody>

            {servicos.length > 0 ? (
              servicos.map((srv) => (
                <tr
                  key={srv.id}
                  className="border-b border-slate-100 hover:bg-slate-50/70 transition"
                >

                  <td className="py-4 px-3 font-semibold text-slate-700">
                    {srv.nome}
                  </td>

                  <td className="py-4 px-3 text-emerald-600 font-bold">
                    {Number(srv.valor || 0).toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "AOA",
                    })}
                  </td>

                  <td className="py-4 px-3 text-slate-600">
                    {srv.descricao || "—"}
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex justify-center gap-3">

                      {/* EDITAR */}
                      <button
                        onClick={() => onEdit(srv)}
                        className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-700 transition"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => onDelete(srv.id)}
                        className="p-3 rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-slate-400 font-medium"
                >
                  Nenhum serviço encontrado.
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
};

export default ServicoExtraTable;
