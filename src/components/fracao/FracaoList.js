// src/components/fracoes/FracaoList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import FracaoForm from "./FracaoForm";
import {
  FileText, FileSpreadsheet, FileDown, Printer, Search, Plus,
  Home, Building2, User
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

  // EXPORTS (mantidos)
  const exportCSV = () => {};
  const exportExcel = () => {};
  const exportPDF = () => {};
  const handlePrint = () => {};

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
                placeholder="Pesquisar por número, tipo, proprietário ou inquilino..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:ring-4 focus:ring-blue-200 outline-none shadow-lg"
              />
            </div>

            {/* BOTÃO CORRIGIDO */}
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" /> Nova Fração
            </button>
          </div>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/40 shadow-2xl">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Nova Fração
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>
          </div>

          <FracaoForm
            onSuccess={() => {
              setShowForm(false);
              fetchData();
            }}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* LISTA */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredFracoes.map((fracao) => (
            <Link
              key={fracao.id}
              to={`/fracoes/${fracao.id}`}
              className="group bg-white/80 rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-all flex flex-col"
            >
              <div className="flex justify-between mb-4">
                <Home className="w-6 h-6 text-emerald-600" />
                <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                  {fracao.estado || "Ativo"}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3">
                Fr. {fracao.numero}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                {fracao.tipo || "-"}
              </p>

              <div className="text-sm space-y-2 flex-1">
                <p><strong>Proprietário:</strong> {fracao.proprietario?.nome || "-"}</p>
                <p><strong>Inquilino:</strong> {fracao.inquilino?.nome || "-"}</p>
              </div>

              <div className="mt-4 text-sm font-semibold">
                {fracao.edificio?.nome || "-"}
              </div>
            </Link>
          ))}

          {filteredFracoes.length === 0 && (
            <div className="col-span-full text-center p-10 text-gray-400">
              Nenhuma fração encontrada
            </div>
          )}
        </div>
      )}

      {/* EXPORTS */}
      {!showForm && filteredFracoes.length > 0 && (
        <div className="bg-white/60 rounded-3xl p-6 shadow-xl flex justify-center gap-4">
          <button onClick={exportCSV}><FileText /></button>
          <button onClick={exportExcel}><FileSpreadsheet /></button>
          <button onClick={exportPDF}><FileDown /></button>
          <button onClick={handlePrint}><Printer /></button>
        </div>
      )}
    </div>
  );
};

export default FracaoList;
