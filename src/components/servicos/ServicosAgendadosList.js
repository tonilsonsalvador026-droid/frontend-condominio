// src/components/servicos/ServicosAgendadosList.js

import React from "react";
import {
  Trash2,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  CalendarDays,
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ServicosAgendadosList = ({ agendamentos, onDelete }) => {

  const data = agendamentos || [];

  // ---------------- EXPORT CSV ----------------
  const exportCSV = () => {

    const headers = ["Serviço", "Data", "Observações"];

    const rows = data.map((a) =>
      [
        a.servico?.nome || "-",
        new Date(a.data).toLocaleDateString("pt-PT"),
        a.observacoes || "-"
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "servicos_agendados.csv";
    a.click();
  };

  // ---------------- EXPORT EXCEL ----------------
  const exportExcel = () => {

    const ws = XLSX.utils.json_to_sheet(
      data.map((a) => ({
        Serviço: a.servico?.nome || "-",
        Data: new Date(a.data).toLocaleDateString("pt-PT"),
        Observações: a.observacoes || "-"
      }))
    );

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Serviços Agendados");

    XLSX.writeFile(wb, "servicos_agendados.xlsx");
  };

  // ---------------- EXPORT PDF ----------------
  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text("Lista de Serviços Agendados", 14, 15);

    autoTable(doc, {
      startY: 25,

      head: [["Serviço", "Data", "Observações"]],

      body: data.map((a) => [
        a.servico?.nome || "-",
        new Date(a.data).toLocaleDateString("pt-PT"),
        a.observacoes || "-"
      ]),
    });

    doc.save("servicos_agendados.pdf");
  };

  // ---------------- PRINT ----------------
  const handlePrint = () => {

    const content = document.getElementById(
      "printAreaServicosAgendados"
    ).innerHTML;

    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
      <html>
        <head>
          <title>Serviços Agendados</title>
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

      {/* TABLE PREMIUM */}
      <div
        id="printAreaServicosAgendados"
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border shadow-xl overflow-x-auto"
      >

        <table className="w-full text-sm md:text-base">

          <thead className="bg-slate-100 text-slate-700">
            <tr>

              <th className="p-4 text-left">
                Serviço
              </th>

              <th className="p-4 text-left">
                Data
              </th>

              <th className="p-4 text-left">
                Observações
              </th>

              <th className="p-4 text-center">
                Ações
              </th>

            </tr>
          </thead>

          <tbody>

            {data.length > 0 ? (
              data.map((ag) => (

                <tr
                  key={ag.id}
                  className="border-t hover:bg-slate-50 transition-all duration-300"
                >

                  {/* SERVIÇO */}
                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">

                        <CalendarDays
                          size={18}
                          className="text-blue-700"
                        />

                      </div>

                      <div>

                        <p className="font-semibold text-slate-800">
                          {ag.servico?.nome || "-"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* DATA */}
                  <td className="p-4 font-medium text-slate-700">
                    {new Date(ag.data).toLocaleDateString("pt-PT")}
                  </td>

                  {/* OBSERVAÇÕES */}
                  <td className="p-4 text-slate-600">
                    {ag.observacoes || "-"}
                  </td>

                  {/* AÇÕES */}
                  <td className="p-4">

                    <div className="flex justify-center">

                      <button
                        onClick={() => onDelete?.(ag.id)}
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
                  className="text-center p-10 text-slate-400"
                >
                  Nenhum agendamento encontrado.
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* EXPORTS PREMIUM */}
      {data.length > 0 && (

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border shadow-xl">

          <div className="flex flex-wrap gap-3 justify-center">

            {/* CSV */}
            <button
              onClick={exportCSV}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
            >
              <FileText size={16} />
              CSV
            </button>

            {/* EXCEL */}
            <button
              onClick={exportExcel}
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>

            {/* PDF */}
            <button
              onClick={exportPDF}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
            >
              <FileDown size={16} />
              PDF
            </button>

            {/* PRINT */}
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-slate-700 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
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

export default ServicosAgendadosList;
