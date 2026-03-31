//src/components/proprietarios/ProprietarioList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import ProprietarioForm from "./ProprietarioForm";
import {
  FileText, FileSpreadsheet, FileDown, Printer, Search, Plus,
  User, Mail, Phone, Hash
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProprietarioList = () => {
  const [proprietarios, setProprietarios] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/proprietarios");
      setProprietarios(res.data);
    } catch (err) {
      setError("Não foi possível carregar os proprietários");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProprietarios = proprietarios.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  // EXPORT CSV
  const exportCSV = () => {
    const header = ["ID", "Nome", "Email", "Telefone", "NIF"];
    const rows = filteredProprietarios.map((p) => [
      p.id,
      p.nome,
      p.email || "-",
      p.telefone || "-",
      p.nif || "-",
    ]);

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "proprietarios.csv";
    link.click();
  };

  // EXPORT EXCEL
  const exportExcel = () => {
    const data = filteredProprietarios.map((p) => ({
      ID: p.id,
      Nome: p.nome,
      Email: p.email || "-",
      Telefone: p.telefone || "-",
      NIF: p.nif || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Proprietários");
    XLSX.writeFile(wb, "proprietarios.xlsx");
  };

  // EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Proprietários", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["ID", "Nome", "Email", "Telefone", "NIF"]],
      body: filteredProprietarios.map((p) => [
        p.id,
        p.nome,
        p.email || "-",
        p.telefone || "-",
        p.nif || "-",
      ]),
    });

    doc.save("proprietarios.pdf");
  };

  // PRINT
  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;

    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Relatório de Proprietários</title>
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
              Proprietários
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filteredProprietarios.length} de {proprietarios.length} proprietários
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            
            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/50 border rounded-2xl focus:ring-4 focus:ring-blue-200 outline-none"
              />
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" /> Novo Proprietário
            </button>
          </div>
        </div>
      </div>

      {/* FORM */}
{showForm && (
  <ProprietarioForm
    onSuccess={() => {
      setShowForm(false);
      fetchData();
    }}
  />
)}
      {/* LISTA */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          
          {filteredProprietarios.map((p) => (
            <div
              key={p.id}
              className="group bg-white/80 backdrop-blur-xl hover:bg-white/95 rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-slate-200/40 hover:border-blue-200/60 hover:-translate-y-3 transition-all duration-500 flex flex-col"
            >

              <div className="flex justify-between mb-6">
                <User className="w-8 h-8 text-blue-600" />
                <span className="text-xs bg-blue-100 px-3 py-1 rounded-full">
                  ID #{p.id}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {p.nome}
              </h3>

              <div className="space-y-3 text-sm flex-1">
                <p><strong>Email:</strong> {p.email || "-"}</p>
                <p><strong>Telefone:</strong> {p.telefone || "-"}</p>
                <p><strong>NIF:</strong> {p.nif || "-"}</p>
              </div>

            </div>
          ))}

          {filteredProprietarios.length === 0 && (
            <div className="col-span-full text-center p-10 text-gray-400">
              Nenhum proprietário encontrado
            </div>
          )}
        </div>
      )}

      {/* EXPORTS */}
      {filteredProprietarios.length > 0 && !showForm && (
        <div id="printArea" className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-xl">
          <div className="flex flex-wrap gap-3 justify-center">

            <button onClick={exportCSV} className="px-6 py-3 bg-blue-600 text-white rounded-2xl">
              CSV
            </button>

            <button onClick={exportExcel} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl">
              Excel
            </button>

            <button onClick={exportPDF} className="px-6 py-3 bg-red-600 text-white rounded-2xl">
              PDF
            </button>

            <button onClick={handlePrint} className="px-6 py-3 bg-slate-600 text-white rounded-2xl">
              Imprimir
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProprietarioList;
