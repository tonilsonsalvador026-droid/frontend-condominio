// src/components/condominios/CondominioList.js
import React, { useEffect, useState } from "react";
import api from "../../api";
import CondominioForm from "./CondominioForm";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Search,
  Building2,
  MapPin,
  Calendar,
  Plus
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CondominioList = () => {
  const [condominios, setCondominios] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/condominios");
      setCondominios(res.data);
    } catch (err) {
      console.error("Erro ao carregar condomínios:", err);
      setError("Não foi possível carregar os condomínios");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCondominios = condominios.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.localizacao.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- EXPORTS ----------------

  const exportCSV = () => {
    const header = ["ID", "Nome", "Localização", "Data Criação"];
    const rows = filteredCondominios.map((c) => [
      c.id,
      c.nome,
      c.localizacao,
      new Date(c.criadoEm).toLocaleDateString("pt-PT"),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "condominios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const data = filteredCondominios.map((c) => ({
      ID: c.id,
      Nome: c.nome,
      Localização: c.localizacao,
      "Data Criação": new Date(c.criadoEm).toLocaleDateString("pt-PT"),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Condomínios");
    XLSX.writeFile(wb, "condominios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Condomínios", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Nome", "Localização", "Data Criação"]],
      body: filteredCondominios.map((c) => [
        c.id,
        c.nome,
        c.localizacao,
        new Date(c.criadoEm).toLocaleDateString("pt-PT"),
      ]),
    });
    doc.save("condominios.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`<html><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-8 w-full">

      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Condomínios
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filteredCondominios.length} de {condominios.length} encontrados
            </p>
          </div>

          {/* SEARCH + BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">

            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou localização..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 shadow-lg"
              />
            </div>

            {/* + NOVO CONDOMÍNIO */}
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Novo Condomínio
            </button>

          </div>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <CondominioForm
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      )}

      {/* CARDS */}
      {!showForm && (
        <div id="printArea" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredCondominios.length > 0 ? (
            filteredCondominios.map((c) => (
              <div
                key={c.id}
                className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/40 hover:border-blue-200/60 hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Building2 className="text-blue-600" />
                  </div>

                  <span className="text-xs text-slate-500 font-mono">
                    #{c.id}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {c.nome}
                </h3>

                <p className="text-slate-600 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {c.localizacao}
                </p>

                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(c.criadoEm).toLocaleDateString("pt-PT")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 col-span-full">
              Nenhum condomínio encontrado.
            </p>
          )}
        </div>
      )}

      {/* EXPORTS */}
      {filteredCondominios.length > 0 && !showForm && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border shadow-xl">
          <div className="flex flex-wrap gap-3 justify-center">

            <button onClick={exportCSV} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 transition">
              <FileText size={16} /> CSV
            </button>

            <button onClick={exportExcel} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 transition">
              <FileSpreadsheet size={16} /> Excel
            </button>

            <button onClick={exportPDF} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 transition">
              <FileDown size={16} /> PDF
            </button>

            <button onClick={handlePrint} className="px-6 py-3 bg-slate-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:-translate-y-1 transition">
              <Printer size={16} /> Imprimir
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default CondominioList;
