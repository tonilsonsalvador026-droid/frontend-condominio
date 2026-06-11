import React, { useEffect, useState } from "react";
import api from "../../api";

import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  ShieldCheck,
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { format } from "date-fns";

const PermissoesList = () => {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD ROLES
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("Erro ao carregar permissões:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filtered = roles.filter((r) =>
    r.nome?.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // EXPORT CSV
  // =========================
  const exportCSV = () => {
    const header = ["Função", "Permissões"];

    const rows = filtered.map((r) => [
      r.nome,
      r.permissoes?.map((p) => p.permissao.nome).join(", ") || "-",
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "permissoes.csv";
    a.click();
  };

  // =========================
  // EXPORT EXCEL
  // =========================
  const exportExcel = () => {
    const data = filtered.map((r) => ({
      Função: r.nome,
      Permissões:
        r.permissoes?.map((p) => p.permissao.nome).join(", ") || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Permissões");

    XLSX.writeFile(wb, "permissoes.xlsx");
  };

  // =========================
  // EXPORT PDF
  // =========================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Relatório de Permissões", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Função", "Permissões"]],
      body: filtered.map((r) => [
        r.nome,
        r.permissoes?.map((p) => p.permissao.nome).join(", ") || "-",
      ]),
    });

    doc.save("permissoes.pdf");
  };

  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {
    const content = document.getElementById("printPermissoes").innerHTML;

    const win = window.open("", "", "width=1000,height=700");

    win.document.write(`
      <html>
        <head>
          <title>Permissões</title>
          <style>
            body { font-family: Arial; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background: #f3f4f6; }
          </style>
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

      {/* =========================
          HEADER PREMIUM
      ========================= */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Permissões por Função
            </h1>

            <p className="text-slate-600 mt-2">
              Consulta e gestão de permissões do sistema.
            </p>

            {!loading && (
              <p className="text-sm text-slate-500 mt-3 font-medium">
                {filtered.length} registos encontrados
              </p>
            )}
          </div>

          {/* SEARCH */}
          <div className="relative w-full xl:w-80">
            <input
              type="text"
              placeholder="Pesquisar função..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-4 bg-white/70 border border-slate-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-200"
            />
          </div>

        </div>
      </div>

      {/* =========================
          TABLE PREMIUM
      ========================= */}
      <div
        id="printPermissoes"
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl overflow-x-auto"
      >

        <table className="w-full text-sm md:text-base">

          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4 text-left">Função</th>
              <th className="p-4 text-left">Permissões</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-t hover:bg-slate-50 transition-all duration-300"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <div className="p-2 bg-blue-100 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                      </div>

                      <span className="font-bold text-slate-800">
                        {r.nome}
                      </span>

                    </div>
                  </td>

                  <td className="p-4 text-slate-600">
                    {r.permissoes?.map((p) => p.permissao.nome).join(", ") || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center p-10 text-slate-400 font-medium">
                  Nenhuma função encontrada.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* =========================
          EXPORT BUTTONS PREMIUM
      ========================= */}
      {filtered.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl">

          <div className="flex flex-wrap justify-center gap-4">

            <button
              onClick={exportCSV}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2 transition"
            >
              <FileText size={17} />
              CSV
            </button>

            <button
              onClick={exportExcel}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2 transition"
            >
              <FileSpreadsheet size={17} />
              Excel
            </button>

            <button
              onClick={exportPDF}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2 transition"
            >
              <FileDown size={17} />
              PDF
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl flex items-center gap-2 transition"
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

export default PermissoesList;
