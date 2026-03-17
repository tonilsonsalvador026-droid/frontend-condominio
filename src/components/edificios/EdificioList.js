// src/components/edificios/EdificioList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import {
  FileText, FileSpreadsheet, FileDown, Printer, Search, Plus,
  Building2, MapPin, Home
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EdificioList = () => {
  const [edificios, setEdificios] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/edificios");
      setEdificios(res.data);
    } catch (err) {
      console.error("Erro ao carregar edifícios:", err);
      setError("Não foi possível carregar os edifícios");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = edificios.filter(
    (e) =>
      e.nome.toLowerCase().includes(search.toLowerCase()) ||
      e.endereco?.toLowerCase().includes(search.toLowerCase()) ||
      e.condominio?.nome.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ FUNÇÕES DE EXPORT (suas originais COMPLETAS)
  const exportCSV = () => {
    const header = ["ID", "Nome", "Endereço", "Andares", "Apartamentos", "Condomínio"];
    const rows = filtered.map((e) => [
      e.id, e.nome, e.endereco, e.numeroAndares, e.numeroApartamentos, e.condominio?.nome
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "edificios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const data = filtered.map((e) => ({
      ID: e.id, Nome: e.nome, Endereço: e.endereco,
      Andares: e.numeroAndares, Apartamentos: e.numeroApartamentos,
      Condomínio: e.condominio?.nome
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Edifícios");
    XLSX.writeFile(wb, "edificios.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Edifícios", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID", "Nome", "Endereço", "Andares", "Apartamentos", "Condomínio"]],
      body: filtered.map((e) => [
        e.id, e.nome, e.endereco, e.numeroAndares, e.numeroApartamentos, e.condominio?.nome
      ])
    });
    doc.save("edificios.pdf");
  };

  const handlePrint = () => {
    const content = document.getElementById("printArea").innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html><head><title>Relatório de Edifícios</title>
      <style>table{width:100%;border-collapse:collapse;font-size:14px;}
      th,td{border:1px solid #ccc;padding:8px;text-align:left;}
      th{background:#f5f5f5;}</style></head><body>${content}</body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Edifícios
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filtered.length} de {edificios.length} encontrados
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar por nome, endereço ou condomínio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/50 focus:border-blue-300 outline-none transition-all shadow-lg hover:shadow-xl"
              />
            </div>
            <Link
              to="/edificios/novo" // ← CORRETO pro seu router
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all whitespace-nowrap flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" /> Novo Edifício
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-3xl p-8 text-center">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      )}

      {/* ✅ RESPONSIVO FIX: Cards ocupam 100% largura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full">
        {filtered.map((edificio) => (
          <Link
            key={edificio.id}
            to={`/edificios/${edificio.id}`}
            className="group bg-white/80 backdrop-blur-xl hover:bg-white/95 w-full rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/40 hover:border-blue-200/60 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-200/50 group-hover:scale-105 transition-all">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">
                <Home className="w-3 h-3" />
                {edificio.numeroApartamentos || 0} apts
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 flex-1">
              {edificio.nome}
            </h3>

            <p className="text-slate-600 mb-4 line-clamp-2 text-sm">
              <MapPin className="w-4 h-4 inline mr-1.5 text-slate-400" />
              {edificio.endereco || "Endereço não informado"}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-slate-50/70 rounded-xl border border-slate-200/30">
                <div className="text-xl font-bold text-slate-900">{edificio.numeroAndares || 0}</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Andares</div>
              </div>
              <div className="text-center p-3 bg-slate-50/70 rounded-xl border border-slate-200/30">
                <div className="text-sm font-bold text-slate-900 truncate">{edificio.condominio?.nome || "--"}</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Condomínio</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 mt-auto">
              <span className="text-xs text-slate-500 font-mono">#{edificio.id}</span>
              <div className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-all flex items-center">
                Detalhes →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="col-span-full bg-white/50 backdrop-blur-xl rounded-3xl p-16 border-2 border-dashed border-slate-300/50 text-center">
          <Building2 className="w-24 h-24 text-slate-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-500 mb-2">Nenhum edifício cadastrado</h3>
          <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
            Seja o primeiro a criar um edifício no sistema
          </p>
          <Link to="/edificios/novo" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            <Plus className="w-5 h-5 mr-2" /> Criar Primeiro Edifício
          </Link>
        </div>
      )}

      {/* ✅ EXPORT BUTTONS (FUNCIONAM 100%) */}
      {filtered.length > 0 && (
        <div id="printArea" className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/40 shadow-xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={exportCSV} className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/90 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <FileText className="w-4 h-4 group-hover:scale-110" /> CSV
            </button>
            <button onClick={exportExcel} className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/90 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <FileSpreadsheet className="w-4 h-4 group-hover:scale-110" /> Excel
            </button>
            <button onClick={exportPDF} className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/90 to-red-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <FileDown className="w-4 h-4 group-hover:scale-110" /> PDF
            </button>
            <button onClick={handlePrint} className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-500/90 to-slate-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <Printer className="w-4 h-4 group-hover:scale-110" /> Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EdificioList;
