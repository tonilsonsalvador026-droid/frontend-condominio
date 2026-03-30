// src/components/fracoes/FracaoList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import FracaoForm from "./FracaoForm";
import {
  FileText, FileSpreadsheet, FileDown, Printer, Search, Plus,
  Home
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const FracaoList = () => {
  const [fracoes, setFracoes] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/fracoes");
      setFracoes(res.data);
    } catch (err) {
      setError("Não foi possível carregar as frações");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredFracoes = fracoes.filter((f) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      String(f.numero || "").toLowerCase().includes(q) ||
      String(f.tipo || "").toLowerCase().includes(q) ||
      String(f.proprietario?.nome || "").toLowerCase().includes(q) ||
      String(f.inquilino?.nome || "").toLowerCase().includes(q)
    );
  });

  // ✅ EXPORT CSV
  const exportCSV = () => {
    const header = ["ID","Número","Tipo","Estado","Edifício","Proprietário","Inquilino"];
    const rows = filteredFracoes.map((f) => [
      f.id,
      f.numero,
      f.tipo || "-",
      f.estado || "-",
      f.edificio?.nome || "-",
      f.proprietario?.nome || "-",
      f.inquilino?.nome || "-",
    ]);

    const csv = [header, ...rows].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fracoes.csv";
    link.click();
  };

  // ✅ EXPORT EXCEL
  const exportExcel = () => {
    const data = filteredFracoes.map((f) => ({
      ID: f.id,
      Número: f.numero,
      Tipo: f.tipo || "-",
      Estado: f.estado || "-",
      Edifício: f.edificio?.nome || "-",
      Proprietário: f.proprietario?.nome || "-",
      Inquilino: f.inquilino?.nome || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Frações");
    XLSX.writeFile(wb, "fracoes.xlsx");
  };

  // ✅ EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Frações", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["ID","Número","Tipo","Estado","Edifício","Proprietário","Inquilino"]],
      body: filteredFracoes.map((f) => [
        f.id,
        f.numero,
        f.tipo || "-",
        f.estado || "-",
        f.edificio?.nome || "-",
        f.proprietario?.nome || "-",
        f.inquilino?.nome || "-",
      ]),
    });

    doc.save("fracoes.pdf");
  };

  // ✅ PRINT
  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;

    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Frações</title>
          <style>
            table { width:100%; border-collapse:collapse; font-size:14px; }
            th, td { border:1px solid #ccc; padding:8px; text-align:left; }
            th { background:#f5f5f5; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Frações
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filteredFracoes.length} de {fracoes.length} frações
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/50 border rounded-2xl focus:ring-4 focus:ring-blue-200 outline-none"
              />
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" /> Nova Fração
            </button>
          </div>
        </div>
      </div>

      {/* FORM */}
{showForm && (
  <FracaoForm
    onSuccess={() => {
      setShowForm(false);
      fetchData();
    }}
  />
)}

      {/* LISTA */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFracoes.map((fracao) => (
            <div
              key={fracao.id}
              className="group bg-white/80 rounded-3xl p-6 shadow-xl hover:-translate-y-2 transition-all flex flex-col cursor-pointer"
            >
              <div className="flex justify-between mb-4">
                <Home className="w-6 h-6 text-emerald-600" />
                <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                  {fracao.estado || "Ativo"}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">
                Fr. {fracao.numero}
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                {fracao.tipo || "-"}
              </p>

              <div className="text-sm space-y-1 flex-1">
                <p><strong>Proprietário:</strong> {fracao.proprietario?.nome || "-"}</p>
                <p><strong>Inquilino:</strong> {fracao.inquilino?.nome || "-"}</p>
              </div>

              <div className="mt-3 font-semibold">
                {fracao.edificio?.nome || "-"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPORTS */}
      {filteredFracoes.length > 0 && !showForm && (
        <div id="printArea" className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={exportCSV} className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
              <FileText className="w-4 h-4" /> CSV
            </button>
            <button onClick={exportExcel} className="group flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </button>
            <button onClick={exportPDF} className="group flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
              <FileDown className="w-4 h-4" /> PDF
            </button>
            <button onClick={handlePrint} className="group flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-bold rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
              <Printer className="w-4 h-4" /> Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FracaoList;
