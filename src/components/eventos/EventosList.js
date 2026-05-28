import React from "react";

import {
  Trash2,
  Pencil,
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  CalendarDays,
} from "lucide-react";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

const EventosList = ({
  eventos,
  onDelete,
  onEdit,
}) => {

  const data = eventos || [];

  // ---------------- CSV ----------------
  const exportCSV = () => {

    const headers = [
      "Título",
      "Data",
      "Descrição",
    ];

    const rows = data.map((ev) =>
      [
        ev.titulo || "-",

        new Date(ev.data)
          .toLocaleDateString("pt-PT"),

        ev.descricao || "-",
      ].join(",")
    );

    const csv = [
      headers.join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = "eventos.csv";

    a.click();
  };

  // ---------------- EXCEL ----------------
  const exportExcel = () => {

    const ws =
      XLSX.utils.json_to_sheet(

        data.map((ev) => ({
          Título:
            ev.titulo || "-",

          Data:
            new Date(ev.data)
              .toLocaleDateString("pt-PT"),

          Descrição:
            ev.descricao || "-",
        }))
      );

    const wb =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Eventos"
    );

    XLSX.writeFile(
      wb,
      "eventos.xlsx"
    );
  };

  // ---------------- PDF ----------------
  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "Lista de Eventos",
      14,
      15
    );

    autoTable(doc, {
      startY: 25,

      head: [[
        "Título",
        "Data",
        "Descrição",
      ]],

      body: data.map((ev) => [
        ev.titulo || "-",

        new Date(ev.data)
          .toLocaleDateString("pt-PT"),

        ev.descricao || "-",
      ]),
    });

    doc.save("eventos.pdf");
  };

  // ---------------- PRINT ----------------
  const handlePrint = () => {

    const content =
      document.getElementById(
        "printAreaEventos"
      ).innerHTML;

    const win = window.open(
      "",
      "",
      "width=900,height=650"
    );

    win.document.write(`
      <html>
        <head>
          <title>Eventos</title>
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

      {/* TABLE */}
      <div
        id="printAreaEventos"
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border shadow-xl overflow-x-auto"
      >

        <table className="w-full text-sm md:text-base">

          <thead className="bg-slate-100 text-slate-700">

            <tr>

              <th className="p-4 text-left">
                Evento
              </th>

              <th className="p-4 text-left">
                Data
              </th>

              <th className="p-4 text-left">
                Descrição
              </th>

              <th className="p-4 text-center">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {data.length > 0 ? (

              data.map((ev) => (

                <tr
                  key={ev.id}
                  className="border-t hover:bg-slate-50 transition-all duration-300"
                >

                  {/* EVENTO */}
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
                          {ev.titulo}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* DATA */}
                  <td className="p-4 font-medium text-slate-700">

                    {new Date(ev.data)
                      .toLocaleDateString("pt-PT")}

                  </td>

                  {/* DESCRIÇÃO */}
                  <td className="p-4 text-slate-600">

                    {ev.descricao || "-"}

                  </td>

                  {/* AÇÕES */}
                  <td className="p-4">

                    <div className="flex items-center justify-center gap-4">

                      {/* EDITAR */}
                      <button
                        onClick={() =>
                          onEdit?.(ev)
                        }
                        className="text-blue-600 hover:scale-110 transition"
                      >

                        <Pencil size={18} />

                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          onDelete?.(ev.id)
                        }
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

                  Nenhum evento encontrado.

                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* EXPORTAÇÕES */}
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

export default EventosList;
