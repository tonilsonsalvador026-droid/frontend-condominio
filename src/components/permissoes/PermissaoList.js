import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PermissoesList = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("Erro ao carregar roles:", err);
      setError("Não foi possível carregar as funções e permissões");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRoles = roles.filter((r) =>
    r.nome.toLowerCase().includes(search.toLowerCase())
  );

  // CSV
  const exportCSV = () => {
    const header = ["ID", "Função", "Permissões"];
    const rows = filteredRoles.map((r) => [
      r.id,
      r.nome,
      r.permissoes?.map((p) => p.permissao.nome).join(", ") || "",
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "permissoes.csv";
    a.click();
  };

  // Excel
  const exportExcel = () => {
    const data = filteredRoles.map((r) => ({
      ID: r.id,
      Função: r.nome,
      Permissões:
        r.permissoes?.map((p) => p.permissao.nome).join(", ") || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Permissões");
    XLSX.writeFile(wb, "permissoes.xlsx");
  };

  // PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Relatório de Permissões por Função", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["ID", "Função", "Permissões"]],
      body: filteredRoles.map((r) => [
        r.id,
        r.nome,
        r.permissoes?.map((p) => p.permissao.nome).join(", ") || "",
      ]),
    });

    doc.save("permissoes.pdf");
  };

  // PRINT
  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;

    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Permissões</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
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

      {/* HEADER PREMIUM */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
            Permissões por Função
          </h1>

          <p className="text-slate-600 mt-2">
            Consulta e exportação de permissões do sistema.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-6 relative w-full md:w-80">
          <input
            type="text"
            placeholder="Pesquisar função..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-white/70 border border-slate-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* TABLE CARD */}
      <div
        id="printArea"
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-2xl overflow-x-auto"
      >

        {error && (
          <div className="text-red-500 mb-4 font-medium">
            {error}
          </div>
        )}

        <table className="w-full text-sm md:text-base">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Função</th>
              <th className="p-4 text-left">Permissões</th>
            </tr>
          </thead>

          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((r) => (
                <tr
                  key={r.id}
                  className="border-t hover:bg-slate-50 transition-all duration-300"
                >
                  <td className="p-4 text-slate-700">{r.id}</td>

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
                <td
                  colSpan="3"
                  className="text-center p-10 text-slate-400 font-medium"
                >
                  Nenhuma função encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EXPORT BUTTONS PREMIUM */}
      {filteredRoles.length > 0 && (
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
