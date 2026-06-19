import React from "react";
import {
  Trash2,
  Edit,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  ShieldCheck,
} from "lucide-react";

import { format } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { temPermissao} from "../permissoes";

const RoleList = ({ roles, onDelete, onEdit }) => {
  
const podeEditar = temPermissao("editar_roles");
const podeEliminar = temPermissao("eliminar_roles");
  
  const data = roles || [];

  // FORMATAR DATA
  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return format(new Date(date), "dd/MM/yyyy HH:mm");
    } catch {
      return "—";
    }
  };

  // EXPORT CSV
  const exportCSV = () => {

    const headers = ["Nome", "Descrição", "Criado Em"];

    const rows = data.map((role) =>
      [
        role.nome,
        role.descricao || "-",
        formatDate(role.createdAt),
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "roles.csv";

    a.click();
  };

  // EXPORT EXCEL
  const exportExcel = () => {

    const ws = XLSX.utils.json_to_sheet(
      data.map((role) => ({
        Nome: role.nome,
        Descrição: role.descricao || "-",
        "Criado Em": formatDate(role.createdAt),
      }))
    );

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Roles");
    XLSX.writeFile(wb, "roles.xlsx");
  };

  // EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Lista de Funções", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Nome", "Descrição", "Criado Em"]],
      body: data.map((role) => [
        role.nome,
        role.descricao || "-",
        formatDate(role.createdAt),
      ]),
    });
    doc.save("roles.pdf");
  };

  // IMPRIMIR
  const handlePrint = () => {

    const content =
      document.getElementById("printAreaRoles").innerHTML;

    const win = window.open("", "", "width=1000,height=700");

    win.document.write(`
      <html>
        <head>
          <title>Imprimir Roles</title>
        </head>

        <body>
          ${content}
        </body>
      </html>
    `);

    win.document.close();

    win.print();
  };

  return (
    <div className="space-y-8 w-full">

      {/* TABELA */}
      <div
        id="printAreaRoles"
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl overflow-x-auto"
      >

        <table className="w-full text-sm md:text-base">

          <thead className="bg-slate-100 text-slate-700">
            <tr>

              <th className="p-4 text-left">
                Função
              </th>

              <th className="p-4 text-left">
                Descrição
              </th>

              <th className="p-4 text-left">
                Criado Em
              </th>

              <th className="p-4 text-center">
                Ações
              </th>

            </tr>
          </thead>

          <tbody>

            {data.length > 0 ? (
              data.map((role) => (

                <tr
                  key={role.id}
                  className="border-t hover:bg-slate-50 transition-all duration-300"
                >

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="p-2 rounded-xl bg-blue-100">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                      </div>

                      <span className="font-bold text-slate-800">
                        {role.nome}
                      </span>

                    </div>

                  </td>

                  <td className="p-4 text-slate-600">
                    {role.descricao || "-"}
                  </td>

                  <td className="p-4 text-slate-500">
                    {formatDate(role.createdAt)}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-4">

                      
                  {podeEditar && (
                            <button 
                        onClick={() => onEdit?.(role)}
                        className="text-blue-600 hover:scale-110 transition-all duration-300"
                      >
                        <Edit size={19} />
                      </button>
                         )} 

                  {podeEliminar && (
                      <button
                        onClick={() => onDelete?.(role.id)}
                        className="text-red-600 hover:scale-110 transition-all duration-300"
                      >
                        <Trash2 size={19} />
                      </button>
                         )}

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-10 text-slate-400 font-medium"
                >
                  Nenhuma função encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* EXPORTAÇÕES PREMIUM */}
      {data.length > 0 && (

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl">

          <div className="flex flex-wrap justify-center gap-4">

            <button
              onClick={exportCSV}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"
            >
              <FileText size={17} />
              CSV
            </button>

            <button
              onClick={exportExcel}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"
            >
              <FileSpreadsheet size={17} />
              Excel
            </button>

            <button
              onClick={exportPDF}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"
            >
              <FileDown size={17} />
              PDF
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"
            >
              <Printer size={17} />
              Imprimir
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default RoleList;
