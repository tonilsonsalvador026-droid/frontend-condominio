// src/components/servicos/ServicosExtrasList.js

import React, { useState } from "react";
import {
  Trash2,
  Edit,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Search
} from "lucide-react";

import { formatCurrency } from "../../utils/formatCurrency";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ServicosExtrasList = ({ servicos, onDelete, onEdit }) => {

  const data = servicos || [];

  // ---------------- PESQUISA ----------------
  const [search, setSearch] = useState("");

  const filtered = data.filter((srv) =>
    srv.nome?.toLowerCase().includes(search.toLowerCase()) ||
    srv.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- EXPORT CSV ----------------
  const exportCSV = () => {
    const headers = ["Nome", "Valor", "Descrição"];

    const rows = filtered.map((s) =>
      [
        s.nome,
        formatCurrency(Number(s.valor || 0)).replace("Kz", "").trim() + " Kz",
        s.descricao || "-"
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "servicos_extras.csv";
    a.click();
  };

  // ---------------- EXPORT EXCEL ----------------
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((s) => ({
        Nome: s.nome,
        Valor: formatCurrency(Number(s.valor || 0)),
        Descrição: s.descricao || "-"
      }))
    );

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Serviços Extras");

    XLSX.writeFile(wb, "servicos_extras.xlsx");
  };

  // ---------------- EXPORT PDF ----------------
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Lista de Serviços Extras", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Nome", "Valor", "Descrição"]],
      body: filtered.map((s) => [
        s.nome,
        formatCurrency(Number(s.valor || 0)),
        s.descricao || "-"
      ]),
    });

    doc.save("servicos_extras.pdf");
  };

  // ---------------- PRINT ----------------
  const handlePrint = () => {
    const content = document.getElementById("printAreaServicosExtras").innerHTML;

    const win = window.open("", "", "width=900,height=650");

    win.document.write(`<html><body>${content}</body></html>`);

    win.document.close();

    win.print();
  };

  return (
    <div className="space-y-8 w-full">

      {/* TABLE */}
      <div
        id="printAreaServicosExtras"
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border shadow-xl overflow-x-auto"
      >
        <table className="w-full text-sm md:text-base">

          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Valor</th>
              <th className="p-3 text-left">Descrição</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((srv) => (
                <tr
                  key={srv.id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="p-3 font-semibold">
                    {srv.nome}
                  </td>

                  <td className="p-3 font-medium text-emerald-600">
                    {formatCurrency(Number(srv.valor || 0))}
                  </td>

                  <td className="p-3 text-slate-600">
                    {srv.descricao || "-"}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-4">

                      <button
                        onClick={() => onEdit?.(srv)}
                        className="text-blue-600 hover:scale-110 transition"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => onDelete?.(srv.id)}
                        className="text-red-600 hover:scale-110 transition"
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
                  className="text-center p-6 text-slate-400"
                >
                  Nenhum serviço encontrado.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* EXPORTS PREMIUM */}
      {filtered.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border shadow-xl">

          <div className="flex flex-wrap gap-3 justify-center">

            <button
              onClick={exportCSV}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center gap-2"
            >
              <FileText size={16} />
              CSV
            </button>

            <button
              onClick={exportExcel}
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>

            <button
              onClick={exportPDF}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center gap-2"
            >
              <FileDown size={16} />
              PDF
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-slate-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition flex items-center gap-2"
            >
              <Printer size={16} />
              Imprimir
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default ServicosExtrasList;
