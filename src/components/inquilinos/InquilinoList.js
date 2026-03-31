// src/components/inquilinos/InquilinoList.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import {
  FileText, FileSpreadsheet, FileDown, Printer, Search, Plus,
  User, Mail, Phone, Hash, Home, Building2
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InquilinoList = () => {
  const navigate = useNavigate();
  const [inquilinos, setInquilinos] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // TUA LÓGICA 100% IGUAL
  const fetchData = async () => {
    try {
      const res = await api.get("/inquilinos");
      setInquilinos(res.data);
    } catch (err) {
      setError("Não foi possível carregar os inquilinos");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = inquilinos.filter(
    (i) =>
      i.nome.toLowerCase().includes(search.toLowerCase()) ||
      (i.fracao?.numero || "").toString().toLowerCase().includes(search.toLowerCase())
  );

  // TUS EXPORTS 100% IGUAIS
  const exportCSV = () => { /* teu código igual */ };
  const exportExcel = () => { /* teu código igual */ };
  const exportPDF = () => { /* teu código igual */ };
  const print = () => window.print();

  return (
    <div className="space-y-8">
      {/* Header Glass AZUL */}
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
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou fração..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200/50 focus:border-blue-300 outline-none transition-all shadow-lg hover:shadow-xl"
              />
            </div>
            <button
              onClick={() => navigate("/inquilinos/novo")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all whitespace-nowrap flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" /> Novo Inquilino
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-3xl p-8 text-center">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      )}

      {/* Cards Glass Inquilinos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filtered.map((inquilino) => (
          <div
            key={inquilino.id}
            className="group bg-white/80 backdrop-blur-xl hover:bg-white/95 rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-slate-200/40 hover:border-blue-200/60 hover:-translate-y-3 transition-all duration-500 overflow-hidden h-full flex flex-col cursor-pointer"
            onClick={() => navigate(`/inquilinos/${inquilino.id}`)}
          >
            {/* Header Card */}
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-200/50 group-hover:scale-110 transition-all">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold rounded-full">
                #{inquilino.id}
              </span>
            </div>

            {/* Nome Principal */}
            <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-blue-900 transition-colors line-clamp-2">
              {inquilino.nome}
            </h3>

            {/* Contatos */}
            <div className="space-y-4 mb-8 flex-1">
              {inquilino.email && (
                <div className="flex items-center gap-3 p-4 bg-blue-50/70 rounded-2xl hover:bg-blue-50/90 transition-all">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-500 font-medium truncate">Email</p>
                    <p className="font-semibold text-slate-800 truncate">{inquilino.email}</p>
                  </div>
                </div>
              )}
              
              {inquilino.telefone && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50/70 rounded-2xl hover:bg-emerald-50/90 transition-all">
                  <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-500 font-medium truncate">Telefone</p>
                    <p className="font-semibold text-slate-800 truncate">{inquilino.telefone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Fração/Edifício */}
            {inquilino.fracao && (
              <div className="p-4 bg-gradient-to-r from-slate-50/70 to-blue-50/70 rounded-2xl mb-8 space-y-2">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-slate-600" />
                  <p className="font-semibold text-slate-800 text-lg">Fr. {inquilino.fracao.numero}</p>
                </div>
                <p className="text-sm text-slate-600 ml-11">{inquilino.fracao.edificio?.nome || "—"}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 mt-auto">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Inquilino</span>
              <div className="flex items-center text-blue-600 font-bold text-xl group-hover:translate-x-2 transition-all">
                Ver detalhes →
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white/50 backdrop-blur-xl rounded-3xl p-20 border-2 border-dashed border-slate-300/50 text-center group hover:-translate-y-2 transition-all">
            <User className="w-32 h-32 text-slate-300 mx-auto mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-4xl font-black text-slate-600 mb-4">Nenhum inquilino encontrado</h3>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
              Cadastre o primeiro inquilino ou ajuste a pesquisa acima
            </p>
            <button
              onClick={() => navigate("/inquilinos/novo")}
              className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-xl"
            >
              <Plus className="w-7 h-7 mr-3" /> Criar Primeiro Inquilino
            </button>
          </div>
        )}
      </div>

      {/* Export Buttons AZUL */}
      {filtered.length > 0 && (
        <div id="printArea" className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl max-w-4xl mx-auto">
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
            <button onClick={print} className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-500/90 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <Printer className="w-5 h-5 group-hover:scale-110" /> Imprimir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquilinoList;
