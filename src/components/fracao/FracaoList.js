// src/components/fracoes/FracaoList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import {
  FileText, FileSpreadsheet, FileDown, Printer, Search, Plus,
  Home, Building2, User, MapPin
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const FracaoList = () => {
  const [fracoes, setFracoes] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // TUA LÓGICA 100% IGUAL
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

  // TUS EXPORT 100% IGUAIS
  const exportCSV = () => { /* teu código igual */ };
  const exportExcel = () => { /* teu código igual */ };
  const exportPDF = () => { /* teu código igual */ };
  const handlePrint = () => { /* teu código igual */ };

  return (
    <div className="space-y-8">
      {/* Header Glass (padrão Edifícios) */}
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
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar por número, tipo, proprietário ou inquilino..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/50 focus:border-blue-300 outline-none transition-all shadow-lg hover:shadow-xl"
              />
            </div>
            <Link
              to="/fracoes/nova"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all whitespace-nowrap flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" /> Nova Fração
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-3xl p-8 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      )}

      {/* Cards Glass Frações */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredFracoes.map((fracao) => (
          <Link
            key={fracao.id}
            to={`/fracoes/${fracao.id}`}
            className="group bg-white/80 backdrop-blur-xl hover:bg-white/95 rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-slate-200/40 hover:border-blue-200/60 hover:-translate-y-3 transition-all duration-500 overflow-hidden h-full flex flex-col"
          >
            {/* Header Card */}
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-200/50 group-hover:scale-110 transition-all">
                <Home className="w-7 h-7 text-emerald-600" />
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-emerald-100 text-blue-700 text-xs font-bold rounded-full">
                {fracao.estado || "Ativo"}
              </span>
            </div>

            {/* Número Principal */}
            <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-900 transition-colors">
              Fr. {fracao.numero}
            </h3>

            {/* Tipo */}
            <div className="mb-6 p-3 bg-slate-50/50 rounded-2xl">
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                {fracao.tipo || "—"}
              </p>
            </div>

            {/* Moradores */}
            <div className="space-y-3 mb-8 flex-1">
              <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl">
                <User className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Proprietário</p>
                  <p className="font-semibold text-slate-800">{fracao.proprietario?.nome || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500 font-medium">Inquilino</p>
                  <p className="font-semibold text-slate-800">{fracao.inquilino?.nome || "—"}</p>
                </div>
              </div>
            </div>

            {/* Edifício */}
            <div className="p-4 bg-gradient-to-r from-slate-50/70 to-blue-50/70 rounded-2xl mb-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-slate-600" />
                <p className="font-bold text-slate-800 text-lg truncate">
                  {fracao.edificio?.nome || "—"}
                </p>
              </div>
            </div>

            {/* Footer com ID + seta */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 mt-auto">
              <span className="text-sm text-slate-500 font-mono">ID: #{fracao.id}</span>
              <div className="flex items-center text-blue-600 font-bold text-lg group-hover:translate-x-2 transition-all">
                Ver detalhes →
              </div>
            </div>
          </Link>
        ))}

        {/* Empty State */}
        {filteredFracoes.length === 0 && (
          <div className="col-span-full bg-white/50 backdrop-blur-xl rounded-3xl p-20 border-2 border-dashed border-slate-300/50 text-center group hover:-translate-y-2 transition-all">
            <Home className="w-28 h-28 text-slate-300 mx-auto mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-4xl font-black text-slate-600 mb-4">Nenhuma fração encontrada</h3>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
              Cadastre a primeira fração ou ajuste os filtros de pesquisa acima
            </p>
            <Link
              to="/fracoes/nova"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg"
            >
              <Plus className="w-6 h-6 mr-3" /> Criar Primeira Fração
            </Link>
          </div>
        )}
      </div>

      {/* Export Buttons (padrão Edifícios) */}
      {filteredFracoes.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={exportCSV} className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/90 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <FileText className="w-5 h-5 group-hover:scale-110" /> CSV
            </button>
            <button onClick={exportExcel} className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/90 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <FileSpreadsheet className="w-5 h-5 group-hover:scale-110" /> Excel
            </button>
            <button onClick={exportPDF} className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500/90 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <FileDown className="w-5 h-5 group-hover:scale-110" /> PDF
            </button>
            <button onClick={handlePrint} className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-500/90 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <Printer className="w-5 h-5 group-hover:scale-110" /> Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FracaoList;
