// src/components/inquilinos/InquilinoList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import InquilinoForm from "./InquilinoForm";
import {
  FileText, FileSpreadsheet, FileDown, Printer, Search, Plus,
  User, Mail, Phone, Home
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InquilinoList = () => {
  const [inquilinos, setInquilinos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/inquilinos");
      setInquilinos(res.data);
    } catch {
      setError("Não foi possível carregar os inquilinos");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = inquilinos.filter((i) =>
    i.nome.toLowerCase().includes(search.toLowerCase()) ||
    (i.fracao?.numero || "").toString().toLowerCase().includes(search.toLowerCase())
  );

  // ✅ EXPORT CSV
  const exportCSV = () => {
    const header = ["ID","Nome","Email","Telefone","Fração","Edifício"];
    const rows = filtered.map((i) => [
      i.id,
      i.nome,
      i.email || "-",
      i.telefone || "-",
      i.fracao?.numero || "-",
      i.fracao?.edificio?.nome || "-",
    ]);

    const csv = [header, ...rows].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inquilinos.csv";
    link.click();
  };

  // ✅ EXPORT EXCEL
  const exportExcel = () => {
    const data = filtered.map((i) => ({
      ID: i.id,
      Nome: i.nome,
      Email: i.email || "-",
      Telefone: i.telefone || "-",
      Fração: i.fracao?.numero || "-",
      Edifício: i.fracao?.edificio?.nome || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inquilinos");
    XLSX.writeFile(wb, "inquilinos.xlsx");
  };

  // ✅ EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Inquilinos", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["ID","Nome","Email","Telefone","Fração","Edifício"]],
      body: filtered.map((i) => [
        i.id,
        i.nome,
        i.email || "-",
        i.telefone || "-",
        i.fracao?.numero || "-",
        i.fracao?.edificio?.nome || "-",
      ]),
    });

    doc.save("inquilinos.pdf");
  };

  // ✅ PRINT
  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;

    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Inquilinos</title>
          <style>
            table { width:100%; border-collapse:collapse; font-size:14px; }
            th, td { border:1px solid #ccc; padding:8px; }
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
              Inquilinos
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filtered.length} de {inquilinos.length} inquilinos
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
              <Plus className="w-5 h-5 mr-2" /> Novo Inquilino
            </button>

          </div>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <InquilinoForm
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}

      {/* LISTA */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filtered.map((i) => (
            <div
              key={i.id}
              className="group bg-white/80 rounded-3xl p-6 shadow-xl hover:-translate-y-2 transition-all flex flex-col"
            >
              <div className="flex justify-between mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                  #{i.id}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3">{i.nome}</h3>

              <div className="text-sm space-y-2 flex-1">
                <p><strong>Email:</strong> {i.email || "-"}</p>
                <p><strong>Telefone:</strong> {i.telefone || "-"}</p>
              </div>

              {i.fracao && (
                <div className="mt-3 text-sm">
                  <p><strong>Fração:</strong> {i.fracao.numero}</p>
                  <p className="text-gray-500">{i.fracao.edificio?.nome || "-"}</p>
                </div>
              )}
            </div>
          ))}

        </div>
      )}

      {/* EXPORTS */}
      {filtered.length > 0 && !showForm && (
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

export default InquilinoList;
