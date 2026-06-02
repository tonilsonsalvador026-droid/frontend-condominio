import React from "react";
import {
  Edit3,
  Trash2,
  FileText,
  FileSpreadsheet,
  Download,
  Printer,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

export default function RoleList({ roles, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return "—";
    try {
      return format(new Date(date), "dd/MM/yyyy HH:mm");
    } catch {
      return "—";
    }
  };

  const exportCSV = () => {
    const csv = [
      ["Nome", "Descrição", "Criado"],
      ...roles.map((r) => [
        r.nome,
        r.descricao,
        formatDate(r.createdAt),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roles.csv";
    a.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      roles.map((r) => ({
        Nome: r.nome,
        Descrição: r.descricao,
        Criado: formatDate(r.createdAt),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Roles");
    XLSX.writeFile(wb, "roles.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Funções", 14, 10);

    doc.autoTable({
      head: [["Nome", "Descrição", "Criado"]],
      body: roles.map((r) => [
        r.nome,
        r.descricao,
        formatDate(r.createdAt),
      ]),
    });

    doc.save("roles.pdf");
  };

  const printTable = () => {
    const content = document.getElementById("roles-table").outerHTML;
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head><title>Roles</title></head>
        <body>
          <h2>Lista de Funções</h2>
          ${content}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      {/* EXPORTS */}
      <div className="flex flex-wrap gap-3">
        <button onClick={exportCSV} className="btn">CSV</button>
        <button onClick={exportExcel} className="btn">Excel</button>
        <button onClick={exportPDF} className="btn">PDF</button>
        <button onClick={printTable} className="btn">Imprimir</button>
      </div>

      {/* TABLE */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-x-auto">
        <table id="roles-table" className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-left">Criado</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-semibold">{role.nome}</td>
                  <td className="p-4">{role.descricao}</td>
                  <td className="p-4">{formatDate(role.createdAt)}</td>

                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => onEdit(role)}>
                      <Edit3 className="text-blue-600" />
                    </button>

                    <button onClick={() => onDelete(role.id)}>
                      <Trash2 className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-400">
                  Nenhuma função encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
🔥 O PRÓXIMO
