// src/components/fracoes/FracaoList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Printer,
  Search,
  Plus,
  Building2,
  Home,
  Pencil,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const FracaoList = () => {
  const [fracoes, setFracoes] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get("/fracoes");
      setFracoes(res.data);
    } catch {
      setError("Não foi possível carregar as frações");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = fracoes.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.numero?.toLowerCase().includes(q) ||
      f.tipo?.toLowerCase().includes(q) ||
      f.proprietario?.nome?.toLowerCase().includes(q) ||
      f.inquilino?.nome?.toLowerCase().includes(q)
    );
  });

  const handleEdit = (id) => navigate(`/fracoes/editar/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar esta fração?")) return;
    try {
      await api.delete(`/fracoes/${id}`);
      toast.success("Fração eliminada com sucesso!");
      fetchData();
    } catch {
      toast.error("Erro ao eliminar fração.");
    }
  };

  // EXPORTS
  const exportCSV = () => {
    const header = ["ID","Número","Tipo","Estado","Edifício","Proprietário","Inquilino"];
    const rows = filtered.map((f) => [
      f.id, f.numero, f.tipo, f.estado,
      f.edificio?.nome, f.proprietario?.nome, f.inquilino?.nome
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fracoes.csv";
    link.click();
  };

  const exportExcel = () => {
    const data = filtered.map((f) => ({
      ID: f.id,
      Número: f.numero,
      Tipo: f.tipo,
      Estado: f.estado,
      Edifício: f.edificio?.nome,
      Proprietário: f.proprietario?.nome,
      Inquilino: f.inquilino?.nome,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Frações");
    XLSX.writeFile(wb, "fracoes.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Frações", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["ID","Número","Tipo","Estado","Edifício","Proprietário","Inquilino"]],
      body: filtered.map((f) => [
        f.id, f.numero, f.tipo, f.estado,
        f.edificio?.nome, f.proprietario?.nome, f.inquilino?.nome
      ]),
    });
    doc.save("fracoes.pdf");
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
          
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-2">
              Frações
            </h1>
            <p className="text-xl text-slate-600 font-semibold">
              {filtered.length} de {fracoes.length} encontradas
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            
            {/* SEARCH */}
            <div className="relative flex-1 lg:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar frações..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-200 outline-none shadow-lg"
              />
            </div>

            {/* BOTÃO NOVO */}
            <button
              onClick={() => navigate("/fracoes/nova")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Fração
            </button>

          </div>
        </div>
      </div>

      {/* ERRO */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center text-red-600 font-semibold">
          {error}
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl border hover:-translate-y-2 transition-all flex flex-col"
          >
            <div className="flex justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>

              <div className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">
                {f.estado || "Ativo"}
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">
              Fração {f.numero}
            </h3>

            <p className="text-sm text-slate-600 mb-2">
              Tipo: {f.tipo || "-"}
            </p>

            <p className="text-sm text-slate-600 mb-2">
              Edifício: {f.edificio?.nome || "-"}
            </p>

            <p className="text-sm text-slate-600 mb-4">
              Proprietário: {f.proprietario?.nome || "-"}
            </p>

            <div className="flex justify-between mt-auto pt-4 border-t">
              <button onClick={() => handleEdit(f.id)} className="text-blue-600">
                <Pencil />
              </button>
              <button onClick={() => handleDelete(f.id)} className="text-red-600">
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EXPORTS */}
      {filtered.length > 0 && (
        <div id="printArea" className="bg-white/60 rounded-3xl p-6 shadow-xl flex flex-wrap gap-3 justify-center">
          <button onClick={exportCSV} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex gap-2">
            <FileText /> CSV
          </button>
          <button onClick={exportExcel} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl flex gap-2">
            <FileSpreadsheet /> Excel
          </button>
          <button onClick={exportPDF} className="bg-red-600 text-white px-6 py-3 rounded-2xl flex gap-2">
            <FileDown /> PDF
          </button>
          <button onClick={handlePrint} className="bg-slate-600 text-white px-6 py-3 rounded-2xl flex gap-2">
            <Printer /> Imprimir
          </button>
        </div>
      )}
    </div>
  );
};

export default FracaoList;
